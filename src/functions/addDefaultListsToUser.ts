import { createListInDataBase, listProps } from "./createListInDataBase";


export async function addDefaultListsToUser(userId: string) {



    const lists = [
        {
            name: "Main list",
            ownerId: userId,
            type: "0"
        },
        {
            name: "Favorite",
            ownerId: userId,
            type: "1"
        },
        {
            name: "Friends recommendations",
            ownerId: userId,
            type: "2"
        }
    ]

    const newLists = []


    for (let i = 0; i < lists.length; i++) {

        const currentList: listProps = lists[i];

        newLists.push(await createListInDataBase(currentList));
    }

    return newLists;
}