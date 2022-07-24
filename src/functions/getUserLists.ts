import { prisma } from "../prisma";



export async function getUserLists(userId: string) {
    const listsFound = await prisma.list.findMany({
        where: {
            ownerId: userId,
        },
        select: {
            id: true,
            movie: true,
            name: true,
            type: true,
            ownerId: true,
        },
    });


    return listsFound;
}