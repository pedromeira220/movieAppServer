import { prisma } from "../prisma";
import { movieProps } from "./addMoviesToList";

export async function deleteMovieByTmdBidAndListId({ TMDBid, listId }: movieProps) {

    try {

        const movieFound = await prisma.movie.findFirst({
            where: {
                TMDBid,
                listId
            }
        });

        if (!movieFound) {
            return null;
        }

        const movieId = movieFound.id;


        const movieDeleted = await prisma.movie.delete({
            where: {
                id: movieId,
            }
        });

        return movieDeleted;
    } catch (error) {
        console.error(error);
        return null;

    }

}

/*
Primeiro buscar o id do filme que deseja ser deletado
Deletar um filme da lista de um usuário especifico pelo ID da lista e do TMDB

*/