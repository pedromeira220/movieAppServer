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


const PORT = 3333;

const app = express();
var pedro = 1;


//Middleware
app.use(express.json());

function checkToken(req: Request, res: Response, next: NextFunction ) {
    const authHeader = req.headers.authorization;
    const token  = authHeader && authHeader.split(' ')[1];

    if(!token) {
        return res.status(401).json({error: true, msg: "Access denied"});
    } 

    try {

        const secret = credentials.jwt.secret;

        jwt.verify(token, secret); 
        next(); 

    }catch(error) {
        console.log(error);
        return res.status(401).json({error: true, msg:"Invalid token"});
        
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
app.get('/user/:id', checkToken, async (req: Request, res: Response) => {
    const userId = req.params.id;
    const userFound = await prisma.user.findFirst({
        where: {
            id: userId,
        }, 
        select: {
            password: false,
            email: true, 
            id: true,
            name: true
        }
    }); 

    if (!userFound) {
        return res.status(404).json({ error: true, msg: "User not found" })
    }


    return res.status(200).json({ error: false, user: userFound });
});

app.listen(PORT, () => {
    console.log("HTTP server running on the port " + PORT);

});