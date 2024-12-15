import type { PrismaClient } from "@prisma/client";
import { NotFoundError } from "elysia";
import { GlobalResponseError } from "#helpers/errors";
import type { PayloadLogin, PayloadRegister } from "./models";
import { hashAuth, isMatchAuth } from "./service";

const registerAuth = async (prisma: PrismaClient, payload: PayloadRegister) => {
	const passwordHash = await hashAuth(payload.password);

	const createUserAuth = await prisma.auth.create({
		data: {
			password: passwordHash,
			user: {
				create: {
					username: payload.username,
					email: payload.email,
				},
			},
		},
		select: {
			user: true,
		},
	});

	return createUserAuth.user;
};

const loginAuth = async (prisma: PrismaClient, payload: PayloadLogin) => {
	const auth = await prisma.auth.findFirstOrThrow({
		where: {
			user: {
				OR: [
					{
						username: payload.username,
					},
					{
						email: payload.username,
					},
				],
			},
		},
		select: {
			password: true,
			userId: true,
		},
	});

	if (!auth) {
		throw new NotFoundError("User auth not found");
	}

	const isPasswordMatch = await isMatchAuth(payload.password, auth.password);

	if (!isPasswordMatch) {
		throw new GlobalResponseError(401, "Password not match", {
			client: "Invalid credentials",
		});
	}

	return {
		userId: auth.userId,
	};
};

export { registerAuth, loginAuth };
