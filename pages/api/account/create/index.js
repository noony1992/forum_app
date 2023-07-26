import { PrismaClient } from '@prisma/client'
import bcrypt from "bcrypt";

const prisma = new PrismaClient()

export default async function handler(req, res) {

    if (req.method === 'POST') { 
        const username = req.body.username;
        const email = req.body.email;
        const password = await bcrypt.hash(req.body.password, 10);

        const newAccount = await prisma.user.create({
          data: {
            username: username,
            email: email,
            password: password,
          }
        })
          res.status(201).json( newAccount );
    } 
}
