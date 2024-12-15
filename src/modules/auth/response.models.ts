import { t } from "elysia";
import { ResponseBaseModel } from "#helpers/models";

const ResponseLoginModel = t.Object({
	...ResponseBaseModel.properties,
	data: t.Object({
		token: t.String(),
		exp: t.Union([t.String(), t.Number()]),
	}),
});

type ResponseLogin = typeof ResponseLoginModel.static;

export { ResponseLoginModel };
export type { ResponseLogin };
