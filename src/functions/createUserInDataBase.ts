import { prisma } from '../prisma';

type userProps = {
    email: string,
    encryptedPassword: string
    name: string
}

export async function createUserInDataBase({email, encryptedPassword, name}: userProps) {
    const userCreated = await prisma.user.create({
        data: {
            email,
            name,
            password: encryptedPassword
        }
    });
    return userCreated;
}