import { PrismaClient } from "@prisma/client";
import type Elysia from "elysia";

const prisma = new PrismaClient();

prisma
	.$connect()
	.then(() => {
		console.log("Prisma is connected to the database");
	})
	.catch((error) => {
		console.error("Error connecting to Prisma:", error);
	});

const prismaElysia = (app: Elysia) => app.decorate("prisma", prisma);

export default prismaElysia;
