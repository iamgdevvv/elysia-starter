import type { Role } from "@prisma/client";
import { GlobalResponseError } from "#helpers/errors";

const authorization = (authRole: Role, roles: Role[]) => {
	const allowed = roles.includes(authRole);

	if (!allowed) {
		throw new GlobalResponseError(
			403,
			"You are not allowed to access this resource",
			{
				client: "Forbidden",
			},
		);
	}
};

export { authorization };
