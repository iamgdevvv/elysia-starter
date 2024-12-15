import { Role } from "@prisma/client";
import { t } from "elysia";
import { PasswordModel, UsernameModel } from "#helpers/models";

const AuthModel = t.Object({
	password: PasswordModel,
	role: t.Enum(Role),
	createdAt: t.Date({ format: "date-time" }),
	updatedAt: t.Date({ format: "date-time" }),
	userId: t.String({ format: "uuid" }),
});

const PayloadRegisterModel = t.Object({
	username: UsernameModel,
	email: t.String(),
	password: PasswordModel,
});

const PayloadLoginModel = t.Object({
	username: UsernameModel,
	password: PasswordModel,
});

type PayloadLogin = typeof PayloadLoginModel.static;
type PayloadRegister = typeof PayloadRegisterModel.static;

export { AuthModel, PayloadLoginModel, PayloadRegisterModel };
export type { PayloadLogin, PayloadRegister };
