import { jwt } from "@elysiajs/jwt";
import Elysia from "elysia";
import prismaElysia from "#decorators/prisma";
import env from "#helpers/env";
import { databaseError, globalError, serverError } from "#helpers/errors";
import { jwtConfig } from "#helpers/jwt";
import { type ResponseError, ResponseErrorModel } from "#helpers/models";
import {
	type ResponseUser,
	ResponseUserModel,
} from "#modules/user/response.models";
import { loginAuth, registerAuth } from "./handler";
import { PayloadLoginModel, PayloadRegisterModel } from "./models";
import { ResponseLoginModel } from "./response.models";
import { encodeSubAuth } from "./service";

const authRoutes = new Elysia({ prefix: "/auth" })
	.use(jwt(jwtConfig))
	.use(prismaElysia)
	.post(
		"/register",
		async ({ body, prisma, set }): Promise<ResponseUser> => {
			const registerRecordUser = await registerAuth(prisma, body);

			set.status = 201;

			return {
				statusCode: 201,
				success: true,
				message: "Success register user",
				data: registerRecordUser,
			};
		},
		{
			body: PayloadRegisterModel,
			response: {
				201: ResponseUserModel,
				500: ResponseErrorModel,
			},
		},
	)
	.post(
		"/login",
		async ({ body, prisma, jwt }) => {
			const { userId } = await loginAuth(prisma, body);

			const token = await jwt.sign({
				sub: encodeSubAuth(userId),
			});

			return {
				statusCode: 200,
				success: true,
				message: "Success login user",
				data: {
					token,
					exp: env.JWT_EXPIRED,
				},
			};
		},
		{
			body: PayloadLoginModel,
			response: {
				200: ResponseLoginModel,
				500: ResponseErrorModel,
			},
		},
	);
authRoutes.onError(({ error, code, ...ctx }): ResponseError => {
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

export default authRoutes;
