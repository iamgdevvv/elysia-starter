import jwt from "@elysiajs/jwt";
import type { Role, User } from "@prisma/client";
import type Elysia from "elysia";
import prismaElysia from "#decorators//prisma";
import { GlobalResponseError } from "#helpers/errors";
import { jwtConfig } from "#helpers/jwt";
import { decodeSubAuth } from "#modules/auth/service";

const authPlugin = (app: Elysia) =>
	app
		.use(prismaElysia)
		.use(jwt(jwtConfig))
		.derive(
			async ({
				headers,
				jwt,
				prisma,
				route,
			}): Promise<{
				user: User & {
					auth: undefined;
				};
				authRole: Role;
			}> => {
				// Don't check auth when route is public
				if (route.includes("public")) {
					// @ts-expect-error
					return;
				}

				const headerAuth = headers.authorization;
				const bearer = headerAuth?.startsWith("Bearer ")
					? headerAuth.slice(7)
					: null;

				if (!bearer) {
					throw new GlobalResponseError(400, "Token not found", {
						client: "Authorization header not found",
					});
				}

				const jwtPayload = await jwt.verify(bearer);

				if (!jwtPayload || !jwtPayload.sub) {
					throw new GlobalResponseError(401, "Invalid token", {
						client: "Invalid credentials",
					});
				}

				const userId = decodeSubAuth(jwtPayload.sub);

				const user = await prisma.user.findUnique({
					where: {
						id: userId,
					},
					include: {
						auth: {
							select: {
								role: true,
							},
						},
					},
				});

				if (!user) {
					throw new GlobalResponseError(401, "Invalid user", {
						client: "Invalid credentials",
					});
				}

				if (!user.auth) {
					throw new GlobalResponseError(401, "Invalid user auth", {
						client: "Invalid credentials",
					});
				}

				if (user.isActive === false) {
					throw new GlobalResponseError(401, "Inactive user", {
						client: "Inactive user",
					});
				}

				if (user.isDeleted === true) {
					throw new GlobalResponseError(401, "Invalid deleted user", {
						client: "Deleted user",
					});
				}

				return {
					user: {
						...user,
						auth: undefined,
					},
					authRole: user.auth.role,
				};
			},
		);

export { jwtConfig, authPlugin };
