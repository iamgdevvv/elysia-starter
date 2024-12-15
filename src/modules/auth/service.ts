import Cryptr from "cryptr";
import env from "#helpers/env";

const hashAuth = async (password: string) => {
	return await Bun.password.hash(password, {
		algorithm: "bcrypt",
	});
};

const isMatchAuth = async (password: string, hash: string) => {
	return await Bun.password.verify(password, hash);
};

const encodeSubAuth = (userId: string) => {
	const cryptr = new Cryptr(env.JWT_SECRETS);

	return cryptr.encrypt(userId);
};

const decodeSubAuth = (token: string): string => {
	const cryptr = new Cryptr(env.JWT_SECRETS);

	return cryptr.decrypt(token);
};

export { hashAuth, isMatchAuth, encodeSubAuth, decodeSubAuth };
