import express from 'express';
import { createUserInDataBase } from './functions/createUserInDataBase';
import { decrypt } from './functions/decrypt';
import { encrypt } from './functions/encrypt';
import { findUserInDatabaseByEmail } from './functions/findUserInDatabaseByEmail';
import { prisma } from './prisma';
import jwt from 'jsonwebtoken';
import { credentials } from './credentials';

//express types
import { Request, Response, NextFunction } from 'express';
import { createListInDataBase } from './functions/createListInDataBase';

import { listProps } from './functions/createListInDataBase';
import { addMoviesToList, movieProps } from './functions/addMoviesToList';
import { deleteMovieByTmdBidAndListId } from './functions/deleteMovieByTMDBidAndListId';

const PORT = 3333;

const app = express();



//Middleware
app.use(express.json());


function checkToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: true, msg: "Access denied" });
    }

    try {

        const secret = credentials.jwt.secret;

        jwt.verify(token, secret);
        next();


    } catch (error) {
        console.log(error);
        return res.status(401).json({ error: true, msg: "Invalid token" });

    }
}


//Public route
app.post('/user/register', async (req, res) => {

    type userProps = {
        email?: string,
        password?: string
        name?: string
    }

    type userRegisteredProps = {
        id: string,
        email: string,
        password?: string
        name?: string
    }


    const { email, password, name }: userProps = req.body.user;

    if (!email) {
        return res.status(422).json({ error: true, msg: "O email é obrigatório" });
    }
    if (!name) {
        return res.status(422).json({ error: true, msg: "O nome do usuário é obrigatório" });
    }
    if (!password) {
        return res.status(422).json({ error: true, msg: "A senha é obrigatório" });
    }

    const checkUser = await findUserInDatabaseByEmail(email);

    if (checkUser) {
        return res.status(422).json({ error: true, msg: "Usuário já cadastrado" });
    }

    const encryptedPassword = encrypt(password);


    const userRegistered: userRegisteredProps = await createUserInDataBase({ email, encryptedPassword, name });

    return res.status(201).json({ data: userRegistered });
});

app.post('/user/login', async (req, res) => {

    type userProps = {
        password: string | null,
        email: string | null,
    }

    const { password, email }: userProps = req.body.user;

    if (!password) {
        return res.status(422).json({ error: true, msg: "The password is required" });
    }

    if (!email) {
        return res.status(422).json({ error: true, msg: "The email is required" });
    }

    const userFound = await findUserInDatabaseByEmail(email);

    if (!userFound) {
        return res.status(404).json({ error: true, msg: "User or password invalid" });
    }

    const decryptPassword = decrypt(userFound.password);

    if (password !== decryptPassword) {
        return res.status(404).json({ error: true, msg: "User or password invalid" });
    }
    try {
        const secret = credentials.jwt.secret;
        const token = jwt.sign({
            id: userFound.id,
        }, secret);

        return res.status(200).json({ error: false, user: { email, token } });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: true, msg: "Internal server error, please try again later" });

    }

});

//Private route
//Get user data by it id
app.get('/user/data/:user_id', checkToken, async (req: Request, res: Response) => {
    const userId = req.params.user_id;

    if (!userId) {
        return res.status(422).json({ error: false, msg: "The user id is required" });
    }

    const userFound = await prisma.user.findFirst({
        where: {
            id: userId,
        },
        select: {
            password: false,
            email: true,
            id: true,
            name: true,
            lists: true
        }
    });

    if (!userFound) {
        return res.status(404).json({ error: true, msg: "User not found" })
    }


    return res.status(200).json({ error: false, user: userFound });
});

app.get('/user/create_list/:list_name/:list_type/:user_id', checkToken, async (req: Request, res: Response) => {

    const { list_name, list_type, user_id } = req.params;

    if (!list_name) {
        return res.status(422).json({ error: true, msg: "The list name is required" });
    }

    if (!list_type) {
        return res.status(422).json({ error: true, msg: "The list type is required" });
    }

    if (!user_id) {
        return res.status(422).json({ error: true, msg: "The user ID is required" });
    }


    const list: listProps = {
        name: list_name,
        type: list_type,
        ownerId: user_id,
    }


    const listCreated = createListInDataBase(list);

    if (listCreated == null) {
        return res.status(500).json({ error: true, msg: "Internal server error, try again later" });
    }

    return res.status(200).json({ listCreated });
});


app.get('/user/add_movie_to_list/:list_id/:TMDB_id', checkToken, async (req: Request, res: Response) => {

    const { list_id, TMDB_id } = req.params;

    if (!list_id) {
        return res.status(422).json({ error: true, msg: "The list id is required" });
    }

    if (!TMDB_id) {
        return res.status(422).json({ error: true, msg: "The TMDB id is required, this is the movie id on the The Movie DataBase API" });
    }

    if ((typeof parseInt(TMDB_id) != 'number')) {
        return res.status(422).json({ error: true, msg: "The TMDB id have to be a number" });
    }

    const movie: movieProps = {
        listId: list_id,
        TMDBid: parseInt(TMDB_id)
    }

    const movieCreated = addMoviesToList(movie);

    if (movieCreated == null) {
        return res.status(500).json({ error: true, msg: "Internal server error, try again later" });
    }

    return res.status(200).json({ movieCreated });
});

app.post('/user/delete_movie', checkToken, async (req: Request, res: Response) => {
    const { list_id, TMDB_id } = req.body;

    if (!list_id) {
        return res.status(422).json({ error: true, msg: "The list id is required" });
    }

    if (!TMDB_id) {
        return res.status(422).json({ error: true, msg: "The TMDB id is required, this is the movie id on the The Movie DataBase API" });
    }

    if (isNaN(parseInt(TMDB_id))) {
        return res.status(422).json({ error: true, msg: "The TMDB id have to be a number" });
    }

    const movie: movieProps = {
        listId: list_id,
        TMDBid: parseInt(TMDB_id),
    }

    const deletedMovie = await deleteMovieByTmdBidAndListId(movie);

    if (!deletedMovie) {
        return res.status(404).json({ error: true, msg: "Movie id or list id invalid" });
    }

    return res.status(200).json({ deletedMovie });
});

app.listen(PORT, () => {
    console.log("HTTP server running on the port " + PORT);

});