import { prisma } from "../prisma";


export async function findUserInDatabaseById(userId: string) {
    const userFound = await prisma.user.findFirst({
        where: {
            id: userId
        },
        select: {
            email: true,
            id: true,
            name: true,
        }
    });

    return userFound;
}