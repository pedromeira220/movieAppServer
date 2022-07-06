import { prisma } from '../prisma';

type userProps = {
    email: string,
    password: string
    name: string
}

export async function createUserInDataBase({email, password, name}: userProps) {
    const userCreated = await prisma.user.create({
        data: {
            email,
            name,
            password
        }
    });
    return userCreated;
}