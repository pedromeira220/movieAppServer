import { prisma } from "../prisma"

type props = {
    listId: string
}

export async function getMoviesFromList({ listId }: props) {
    const listFound = await prisma.movie.findMany({
        where: {
            listId,
        },
        select: {
            id: true,
            TMDBid: true,
            listId: true,
        }
    });

    return listFound;
}