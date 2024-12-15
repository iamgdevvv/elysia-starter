import { t } from "elysia";
import { PasswordModel } from "#helpers/models";

const PayloadUpdatePasswordModel = t.Object({
	oldPassword: PasswordModel,
	password: PasswordModel,
});

type PayloadUpdatePassword = typeof PayloadUpdatePasswordModel.static;

export { PayloadUpdatePasswordModel };
export type { PayloadUpdatePassword };
