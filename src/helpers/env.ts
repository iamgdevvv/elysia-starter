import { t } from "elysia";
import ajv from "#helpers/ajv";
import { GlobalResponseError } from "./errors";

const EnvModel = t.Object({
	NODE_ENV: t.Optional(
		t.Union([
			t.Literal("development"),
			t.Literal("staging"),
			t.Literal("production"),
			t.Literal("test"),
		]),
	),
	SERVER_PORT: t.Number(),
	DATABASE_URL: t.String(),
	JWT_SECRETS: t.String(),
	JWT_EXPIRED: t.Union([t.String(), t.Number()]),
});

const validate = ajv.compile(EnvModel);

const isValidEnv = validate({
	...process.env,
	NODE_ENV: process.env.NODE_ENV
		? process.env.NODE_ENV.toLowerCase()
		: "development",
	SERVER_PORT: process.env.SERVER_PORT
		? Number(process.env.SERVER_PORT)
		: 3000,
});

if (isValidEnv === false) {
	throw new GlobalResponseError(500, "Internal", {
		server: "Invalid environment variables",
	});
}

type ENV = typeof EnvModel.static;

const env = Bun.env as unknown as ENV;

export default env;
