import type { PrismaClient } from "@prisma/client";
import { GlobalResponseError } from "#helpers/errors";
import { hashAuth, isMatchAuth } from "#modules/auth/service";
import type { PayloadUpdatePassword } from "./models";

const updatePasswordAuth = async (
	prisma: PrismaClient,
	payload: PayloadUpdatePassword & {
		userId: string;
	},
) => {
	const auth = await prisma.auth.findUniqueOrThrow({
		where: {
			userId: payload.userId,
		},
		select: {
			password: true,
		},
	});

	const isPasswordMatch = await isMatchAuth(
		payload.oldPassword,
		auth.password,
	);

	if (!isPasswordMatch) {
		throw new GlobalResponseError(401, "Password not match", {
			client: "Invalid credentials",
		});
	}

	const passwordHash = await hashAuth(payload.password);

	return prisma.auth.update({
		where: {
			userId: payload.userId,
		},
		data: {
			password: passwordHash,
		},
	});
};

export { updatePasswordAuth };
