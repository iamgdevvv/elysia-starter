import type { Prisma, PrismaClient } from "@prisma/client";
import dayjs from "dayjs";
import { hashAuth } from "#modules/auth/service";
import type {
	PayloadCreateUser,
	QueryParamUser,
	QueryParamUsers,
} from "./models";

const getUsers = async (prisma: PrismaClient, query: QueryParamUsers) => {
	const {
		username,
		email,
		isActive,
		isDeleted,
		createdAt,
		updatedAt,
		limit,
		skip,
		desc,
		asc,
		q,
	} = query;

	const args: Prisma.UserFindManyArgs = {
		where: {
			isDeleted: typeof isDeleted === "boolean" ? isDeleted : false,
		},
		orderBy: [],
		take: limit,
		skip,
	};

	if (createdAt) {
		args.where = {
			createdAt: {
				lte: dayjs(createdAt).endOf("day").toDate(),
				gte: dayjs(createdAt).startOf("day").toDate(),
			},
		};
	}

	if (updatedAt) {
		args.where = {
			updatedAt: {
				lte: dayjs(updatedAt).endOf("day").toDate(),
				gte: dayjs(updatedAt).startOf("day").toDate(),
			},
		};
	}

	if (desc) {
		for (const field of desc) {
			args.orderBy = {
				...args.orderBy,
				[field]: "desc",
			};
		}
	}

	if (asc) {
		for (const field of asc) {
			args.orderBy = {
				...args.orderBy,
				[field]: "asc",
			};
		}
	}

	if (q) {
		const fieldSearchs: Prisma.UserOrderByRelevanceFieldEnum[] = [
			"email",
			"username",
		];

		for (const field of fieldSearchs) {
			args.where = {
				...args.where,
				OR: [
					{
						[field]: {
							contains: q,
							mode: "insensitive",
						},
					},
					{
						[field]: {
							search: q.split(" ").join(","),
							mode: "insensitive",
						},
					},
				],
			};
		}
	}

	if (username) {
		args.where = {
			username,
		};
	}

	if (email) {
		args.where = {
			email,
		};
	}

	if (typeof isActive === "boolean") {
		args.where = {
			isActive,
		};
	}

	return prisma.user.findMany(args);
};

const getUser = async (
	prisma: PrismaClient,
	{ id, query }: { id: string; query: QueryParamUser },
) => {
	const { auth } = query;

	const args: Prisma.UserFindUniqueOrThrowArgs = {
		where: {
			id,
			isDeleted: false,
		},
	};

	if (auth) {
		args.include = {
			auth: true,
		};
	}

	return prisma.user.findUniqueOrThrow(args);
};

const createUser = async (prisma: PrismaClient, payload: PayloadCreateUser) => {
	const passwordHash = await hashAuth(payload.password);

	return await prisma.user.create({
		data: {
			...payload,
			auth: {
				create: {
					password: passwordHash,
				},
			},
		},
	});
};

const updateUser = async (
	prisma: PrismaClient,
	{ id, payload }: { id: string; payload: PayloadCreateUser },
) => {
	return prisma.user.update({
		where: {
			id,
		},
		data: payload,
	});
};

const deleteUser = async (prisma: PrismaClient, id: string) => {
	return prisma.user.update({
		where: {
			id,
		},
		data: {
			isDeleted: true,
		},
	});
};

export { getUsers, getUser, createUser, updateUser, deleteUser };
