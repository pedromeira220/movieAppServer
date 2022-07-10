import { prisma } from "../prisma";

export type movieProps = {
    listId: string,
    TMDBid: number,
}

export async function addMoviesToList(movie: movieProps) {

    try {
        const { listId, TMDBid } = movie;

        const movieCreated = await prisma.movie.create({
            data: {
                listId,
                TMDBid
            }
        });

        return movieCreated;
    } catch (error) {
        console.log(error);
        return null;

    }
}