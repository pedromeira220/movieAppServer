import express from 'express';
import { createUserInDataBase } from './functions/createUserInDataBase';
import { findUserInDatabaseByEmail } from './functions/findUserInDatabaseByEmail';
import { prisma } from './prisma';

const PORT = 3333;

const app = express();

app.use(express.json());


app.post('/user/register', async (req, res) => {

    const { email, password, name } = req.body.user;

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

    const userRegistered = createUserInDataBase({ email, password, name});

    return res.status(201).json({ data: userRegistered });
});

app.post('/user/register', async (req, res) => {
    const { password, email } = req.body.user;

    if(!password) {
        return res.status(422).json({ error: true, msg: "The password is required" });
    }

    if(!email) {
        return res.status(422).json({ error: true, msg: "The email is required" });
    }
})

app.listen(PORT, () => {
    console.log("HTTP server running on the port " + PORT);

}); 




//Functions 
