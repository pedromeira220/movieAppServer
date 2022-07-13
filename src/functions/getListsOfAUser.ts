import { prisma } from "../prisma";


export async function getListsOfAUser(userId: string) {
    const listsFound = await prisma.list.findMany({
        where: {
            ownerId: userId,
        },
        select: {
            ownerId: false,
            id: true,
            name: true,
            type: true
        }
    });


    return listsFound;


}