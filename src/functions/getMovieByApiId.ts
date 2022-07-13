import { prisma } from "../prisma";


export async function getMovieByApiID(TMDBid: number, listId: string) {
    const movieFound = await prisma.movie.findFirst({
        where: {
            listId,
            TMDBid
        },
        select: {
            id: true,
            TMDBid: true,
            listId: true
        }
    });

    return movieFound;
}


