import {
	PrismaClientInitializationError,
	PrismaClientKnownRequestError,
	PrismaClientRustPanicError,
	PrismaClientUnknownRequestError,
	PrismaClientValidationError,
} from "@prisma/client/runtime/library";
import {
	type ErrorContext,
	InternalServerError,
	InvalidCookieSignature,
	NotFoundError,
	ParseError,
	ValidationError,
} from "elysia";
import type { ResponseError } from "#helpers/models";

class GlobalResponseError extends Error {
	statusCode: ResponseError["statusCode"];
	success: ResponseError["success"];
	error: ResponseError["error"];

	constructor(
		statusCode: ResponseError["statusCode"],
		message: ResponseError["message"],
		error: ResponseError["error"],
	) {
		super(message);
		this.statusCode = statusCode;
		this.success = false;
		this.error = error;
	}
}

const databaseError = (
	error: Error,
	ctx: ErrorContext,
): ResponseError | null => {
	if (
		error instanceof PrismaClientKnownRequestError ||
		error instanceof PrismaClientUnknownRequestError ||
		error instanceof PrismaClientRustPanicError ||
		error instanceof PrismaClientInitializationError ||
		error instanceof PrismaClientValidationError
	) {
		let statusCode = 500;
		let message = error.message;

		if (error instanceof PrismaClientKnownRequestError) {
			statusCode = 400;
			message = "A database request error occurred";

			if (error.code === "P2002") {
				statusCode = 409;
				message = "Record already exists";
			} else if (error.code === "P2025") {
				statusCode = 404;
				message = "Record not found";
			}
		}

		if (error instanceof PrismaClientValidationError) {
			message = "Validation error";
		}

		if (error instanceof PrismaClientInitializationError) {
			message = "Database initialization failed";
		}

		if (error instanceof PrismaClientRustPanicError) {
			message = "A database engine panic occurred";
		}

		ctx.set.status = statusCode;

		return {
			statusCode,
			success: false,
			message,
			error: {
				database: error,
			},
		};
	}

	return null;
};

const serverError = (error: Error, ctx: ErrorContext): ResponseError | null => {
	if (
		error instanceof InternalServerError ||
		error instanceof NotFoundError ||
		error instanceof ParseError ||
		error instanceof ValidationError ||
		error instanceof InvalidCookieSignature
	) {
		let message = error.message;

		if (error instanceof ValidationError) {
			try {
				message = JSON.parse(error.message).summary;
			} catch {
				message = error.message;
			}
		}

		return {
			statusCode:
				typeof ctx.set.status === "number" ? ctx.set.status : 500,
			success: false,
			message: message || "Internal server error",
			error: {
				server: error,
			},
		};
	}

	return null;
};

const globalError = (error: Error, ctx: ErrorContext): ResponseError | null => {
	if (error instanceof GlobalResponseError) {
		ctx.set.status = error.statusCode;

		const { statusCode, success, message, error: errorError } = error;

		return {
			statusCode,
			success,
			message,
			error: errorError,
		};
	}
	return null;
};

export { GlobalResponseError, databaseError, serverError, globalError };
