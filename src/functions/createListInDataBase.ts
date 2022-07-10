import { prisma } from "../prisma";

export type listProps = {
    name: string
    type: string
    ownerId: string
}

export async function createListInDataBase(list: listProps) {

    const { name, type, ownerId } = list;

    try {
        const listCreated = await prisma.list.create({
            data: {
                name,
                type,
                ownerId
            }
        });

        return listCreated;
    } catch (error) {
        console.log(error);
        return null;

    }


}