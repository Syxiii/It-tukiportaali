// Backend/prisma/client.js
import pkg from "@prisma/client";

const { PrismaClient } = pkg;   // destructure from the default export
const prisma = new PrismaClient();

export default prisma;
