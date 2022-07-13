import { prisma } from "../prisma";


export async function getListsOfAUser(userId: string) {
    const listsFound = await prisma.list.findMany({
        where: {
            ownerId: userId,
        },
    });

    console.log("lista encontrada:", listsFound);

    return listsFound;


}