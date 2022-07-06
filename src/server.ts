import express from 'express';
import { createUserInDataBase } from './functions/createUserInDataBase';
import { decrypt } from './functions/decrypt';
import { encrypt } from './functions/encrypt';
import { findUserInDatabaseByEmail } from './functions/findUserInDatabaseByEmail';
import { prisma } from './prisma';


const PORT = 3333;

const app = express();

app.use(express.json());


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


    const userRegistered: userRegisteredProps = await createUserInDataBase({ email, encryptedPassword, name});

    return res.status(201).json({ data: userRegistered });
});

app.post('/user/login', async (req, res) => {

    type userProps = {
        password: string | null,
        email: string | null,
    }

    const { password, email }: userProps = req.body.user;

    if(!password) {
        return res.status(422).json({ error: true, msg: "The password is required" });
    }

    if(!email) {
        return res.status(422).json({ error: true, msg: "The email is required" });
    }

    const userFound = await findUserInDatabaseByEmail(email);

    if(!userFound) {
        return res.status(404).json({ error: true, msg: "User or password invalid" });
    }

    const decryptPassword = decrypt(userFound.password);

    if(password !== decryptPassword) {
        return res.status(404).json({ error: true, msg: "User or password invalid" });
    }

    return res.status(200).json({error: false, user: {email, password}});
})

app.listen(PORT, () => {
    console.log("HTTP server running on the port " + PORT);
    
}); 


