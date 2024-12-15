import type { JWTOption } from "@elysiajs/jwt";
import env from "#helpers/env";

const jwtConfig: JWTOption = {
	name: "jwt",
	secret: env.JWT_SECRETS,
	exp: env.JWT_EXPIRED,
};

export { jwtConfig };
