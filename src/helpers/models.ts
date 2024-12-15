import type {
	PrismaClientInitializationError,
	PrismaClientKnownRequestError,
	PrismaClientRustPanicError,
	PrismaClientUnknownRequestError,
	PrismaClientValidationError,
} from "@prisma/client/runtime/library";
import { type TSchema, t } from "elysia";
import type {
	InternalServerError,
	InvalidCookieSignature,
	NotFoundError,
	ParseError,
	ValidationError,
} from "elysia/dist/error";

const QueryParamsModel = t.Object({
	limit: t.Optional(t.Number({ minimum: 0, default: 10 })),
	skip: t.Optional(t.Number({ minimum: 0 })),
	desc: t.Optional(t.Array(t.String())),
	asc: t.Optional(t.Array(t.String())),
	q: t.Optional(t.String()),
});

const ResponseBaseModel = t.Object({
	statusCode: t.Number({ default: 200 }),
	success: t.Literal(true),
	message: t.String(),
});

const ResponseErrorModel = t.Object({
	statusCode: t.Number({ default: 500 }),
	success: t.Literal(false),
	message: t.String(),
	error: t.Object({
		database: t.Optional(
			t.Partial(
				t.Object({
					batchRequestIdx: t.Optional(t.Number()),
					cause: t.Unknown(),
					clientVersion: t.String(),
					code: t.String(),
					errorCode: t.Optional(t.String()),
					message: t.String(),
					meta: t.Optional(t.Record(t.String(), t.Unknown())),
					name: t.String(),
					retryable: t.Boolean(),
					stack: t.Optional(t.String()),
				} satisfies Record<
					Exclude<
						| keyof PrismaClientInitializationError
						| keyof PrismaClientKnownRequestError
						| keyof PrismaClientUnknownRequestError
						| keyof PrismaClientValidationError
						| keyof PrismaClientRustPanicError,
						symbol
					>,
					TSchema
				>),
			),
		),
		server: t.Optional(
			t.Partial(
				t.Union([
					t.String(),
					t.Object({
						cause: t.Unknown(),
						code: t.Union([t.String(), t.Number()]),
						message: t.String(),
						name: t.String(),
						stack: t.String(),
						status: t.Number(),
						type: t.String(),
						validator: t.Optional(
							t.Union([t.String(), t.Unknown()]),
						),
						value: t.Unknown(),
						all: t.Array(t.Unknown()),
						model: t.String(),
						toResponse: t.Function(
							[t.Record(t.String(), t.Unknown())],
							t.Void(),
						),
						key: t.String(),
					} satisfies Record<
						Exclude<
							| keyof ValidationError
							| keyof InternalServerError
							| keyof NotFoundError
							| keyof ParseError
							| keyof InvalidCookieSignature,
							symbol
						>,
						TSchema
					>),
				]),
			),
		),
		client: t.Optional(t.String()),
	}),
});

const HeaderAuthorizationModel = t.Object({
	authorization: t.String(),
});

const UsernameModel = t.String({ minLength: 6, maxLength: 20 });
const PasswordModel = t.String({ minLength: 8 });

type QueryParams = typeof QueryParamsModel.static;
type ResponseBase = typeof ResponseBaseModel.static;
type ResponseError = typeof ResponseErrorModel.static;
type HeaderAuthorization = typeof HeaderAuthorizationModel.static;

export {
	QueryParamsModel,
	ResponseBaseModel,
	ResponseErrorModel,
	HeaderAuthorizationModel,
	UsernameModel,
	PasswordModel,
};
export type { QueryParams, ResponseBase, ResponseError, HeaderAuthorization };
