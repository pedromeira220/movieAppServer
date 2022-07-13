import { prisma } from "../prisma";


export async function deleteListById(listId: string) {
    const listFound = await prisma.list.findFirst({
        where: {
            id: listId,
        },
        select: {
            id: true,
            type: true,
            ownerId: true

        }
    });

    if (!listFound) {
        return null;
    }


    const deletedList = await prisma.list.delete({
        where: {
            id: listId,
        },
        select: {
            id: true,
            type: true,
            ownerId: true
        }
    });

    return deletedList;

}