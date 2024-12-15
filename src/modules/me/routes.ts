import { jwt } from "@elysiajs/jwt";
import Elysia from "elysia";
import prismaElysia from "#decorators/prisma";
import { databaseError, globalError, serverError } from "#helpers/errors";
import { jwtConfig } from "#helpers/jwt";
import {
	HeaderAuthorizationModel,
	type ResponseBase,
	ResponseBaseModel,
	type ResponseError,
	ResponseErrorModel,
} from "#helpers/models";
import {
	type ResponseUser,
	ResponseUserModel,
} from "#modules/user/response.models";
import { authPlugin } from "#plugins/auth";
import { updatePasswordAuth } from "./handler";
import { PayloadUpdatePasswordModel } from "./models";

const meRoutes = new Elysia({ prefix: "/me" })
	.use(jwt(jwtConfig))
	.use(prismaElysia)
	.use(authPlugin)
	.guard({
		response: {
			500: ResponseErrorModel,
		},
		headers: HeaderAuthorizationModel,
	})
	.get(
		"/",
		({ user }): ResponseUser => {
			return {
				statusCode: 200,
				success: true,
				message: "Success retrive user",
				data: user,
			};
		},
		{
			response: {
				200: ResponseUserModel,
				500: ResponseErrorModel,
			},
		},
	)
	.post(
		"/change-password",
		async ({ body, prisma, user }): Promise<ResponseBase> => {
			await updatePasswordAuth(prisma, {
				...body,
				userId: user.id,
			});

			return {
				statusCode: 200,
				success: true,
				message: "Success change password",
			};
		},
		{
			body: PayloadUpdatePasswordModel,
			response: {
				200: ResponseBaseModel,
				500: ResponseErrorModel,
			},
		},
	);

meRoutes.onError(({ error, code, ...ctx }): ResponseError => {
	const responseDatabaseError = databaseError(error, ctx);
	if (responseDatabaseError) return responseDatabaseError;

	const responseServerError = serverError(error, ctx);
	if (responseServerError) return responseServerError;

	const responseGlobalError = globalError(error, ctx);
	if (responseGlobalError) return responseGlobalError;

	return {
		statusCode: 500,
		success: false,
		message: error.message,
		error: {},
	};
});

export default meRoutes;
