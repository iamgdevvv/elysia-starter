import Elysia from "elysia";
import prismaElysia from "#decorators/prisma";
import { databaseError, globalError, serverError } from "#helpers/errors";
import {
	HeaderAuthorizationModel,
	type ResponseError,
	ResponseErrorModel,
} from "#helpers/models";
import { authorization } from "#middleware/auth";
import { authPlugin } from "#plugins/auth";
import {
	createUser,
	deleteUser,
	getUser,
	getUsers,
	updateUser,
} from "./handlers";
import {
	ParamUserIdModel,
	PayloadCreateUserModel,
	QueryParamUserModel,
	QueryParamUsersModel,
} from "./models";
import {
	type ResponseUser,
	ResponseUserModel,
	type ResponseUsers,
	ResponseUsersModel,
} from "./response.models";

const userRoutes = new Elysia({ prefix: "/users" })
	.use(prismaElysia)
	.use(authPlugin)
	.onBeforeHandle(({ authRole }) => {
		authorization(authRole, ["ADMIN"]);
	})
	.guard({
		response: {
			500: ResponseErrorModel,
		},
		headers: HeaderAuthorizationModel,
	})
	.get(
		"/",
		async ({ query, prisma }): Promise<ResponseUsers> => {
			const recordUsers = await getUsers(prisma, query);

			return {
				statusCode: 200,
				success: true,
				message: "Success retrive all users",
				data: recordUsers,
			};
		},
		{
			query: QueryParamUsersModel,
			response: {
				200: ResponseUsersModel,
			},
		},
	)
	.get(
		"/:id",
		async ({ params, query, prisma }): Promise<ResponseUser> => {
			const recordUser = await getUser(prisma, { id: params.id, query });

			return {
				statusCode: 200,
				success: true,
				message: "Success retrive user",
				data: recordUser,
			};
		},
		{
			params: ParamUserIdModel,
			query: QueryParamUserModel,
			response: {
				200: ResponseUserModel,
			},
		},
	)
	.post(
		"/",
		async ({ body, prisma, set }): Promise<ResponseUser> => {
			const createRecordUser = await createUser(prisma, body);

			set.status = 201;

			return {
				statusCode: 201,
				success: true,
				message: "Success create user",
				data: createRecordUser,
			};
		},
		{
			body: PayloadCreateUserModel,
			response: {
				201: ResponseUserModel,
			},
		},
	)
	.patch(
		"/:id",
		async ({ params, body, prisma }): Promise<ResponseUser> => {
			const updateRecordUser = await updateUser(prisma, {
				id: params.id,
				payload: body,
			});

			return {
				statusCode: 200,
				success: true,
				message: "Success update user",
				data: updateRecordUser,
			};
		},
		{
			params: ParamUserIdModel,
			body: PayloadCreateUserModel,
			response: {
				200: ResponseUserModel,
			},
		},
	)
	.delete(
		"/:id",
		async ({ params, prisma }): Promise<ResponseUser> => {
			const deleteRecordUser = await deleteUser(prisma, params.id);

			return {
				statusCode: 200,
				success: true,
				message: "Success delete user",
				data: deleteRecordUser,
			};
		},
		{
			params: ParamUserIdModel,
			response: {
				200: ResponseUserModel,
			},
		},
	);

userRoutes.onError(({ error, ...ctx }): ResponseError => {
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

export default userRoutes;
