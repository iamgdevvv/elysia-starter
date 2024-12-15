import { t } from "elysia";
import { ResponseBaseModel } from "#helpers/models";
import { AuthModel } from "#modules/auth/models";
import { UserModel } from "./models";

const ResponseDataUserModel = t.Object({
	...UserModel.properties,
	auth: t.Optional(AuthModel),
});

const ResponseUserModel = t.Object({
	...ResponseBaseModel.properties,
	data: ResponseDataUserModel,
});

const ResponseUsersModel = t.Object({
	...ResponseBaseModel.properties,
	data: t.Array(ResponseDataUserModel),
});

type ResponseUser = typeof ResponseUserModel.static;
type ResponseUsers = typeof ResponseUsersModel.static;

export { ResponseUserModel, ResponseUsersModel };
export type { ResponseUser, ResponseUsers };
