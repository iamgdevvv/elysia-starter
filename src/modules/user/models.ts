import type { Prisma, User } from "@prisma/client";
import { type TSchema, t } from "elysia";
import {
	PasswordModel,
	QueryParamsModel,
	UsernameModel,
} from "#helpers/models";

const UserModel = t.Object({
	id: t.String({ format: "uuid" }),
	username: UsernameModel,
	email: t.String({ format: "email" }),
	isActive: t.Boolean(),
	isDeleted: t.Boolean(),
	createdAt: t.Date({ format: "date-time" }),
	updatedAt: t.Date({ format: "date-time" }),
} satisfies Record<keyof User, TSchema>);

const ParamUserIdModel = t.Object({
	id: UserModel.properties.id,
});

const QueryParamUserModel = t.Object({
	auth: t.Optional(t.Boolean()),
} satisfies Partial<Record<keyof Prisma.UserInclude, TSchema>>);

const QueryParamUsersModel = t.Object({
	...QueryParamsModel.properties,
	...t.Partial(t.Omit(UserModel, ["id"])).properties,
	...QueryParamUserModel.properties,
});

const PayloadCreateUserModel = t.Object({
	...t.Omit(UserModel, ["id", "isDeleted", "createdAt", "updatedAt"])
		.properties,
	password: PasswordModel,
});

const PayloadUpdateUserModel = t.Optional(
	t.Omit(UserModel, ["id", "isDeleted", "createdAt", "updatedAt"]),
);

type ParamUserId = typeof ParamUserIdModel.static;
type QueryParamUser = typeof QueryParamUserModel.static;
type QueryParamUsers = typeof QueryParamUsersModel.static;
type PayloadCreateUser = typeof PayloadCreateUserModel.static;
type PayloadUpdateUser = typeof PayloadUpdateUserModel.static;

export {
	UserModel,
	ParamUserIdModel,
	QueryParamUserModel,
	QueryParamUsersModel,
	PayloadCreateUserModel,
	PayloadUpdateUserModel,
};
export type {
	ParamUserId,
	QueryParamUser,
	QueryParamUsers,
	PayloadCreateUser,
	PayloadUpdateUser,
};
