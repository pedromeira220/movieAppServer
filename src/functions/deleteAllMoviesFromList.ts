import { prisma } from "../prisma";


export async function deleteAllMoviesFromList(listId: string) {

    await prisma.movie.deleteMany({
        where: {
            listId
        }
    });

}