import { PrismaClient } from '@prisma/client'
import { authOptions } from 'pages/api/auth/[...nextauth]'
import { getServerSession  } from "next-auth/next"

export default async function handler(req, res) {
    const session = await getServerSession( req, res, authOptions)

    if (session) {
        const prisma = new PrismaClient()
        if (req.method === 'GET') { 
            const categories = await prisma.threadCategories.findMany();  
            res.json(categories);
        }
        if (session && session.user[0].admin === true) {
            if (req.method === 'POST') { 
                console.log(session)
                const category = req.body.category;
                const newCategory = await prisma.threadCategories.create({
                    data: {
                        category: category,
                    },
                })
                res.status(201).json(newCategory);
                
            } else if (req.method === 'PUT'){
        
            }
        } else {
            // Not Signed in
            res.status(401)
        }
    } else {
    // Not Signed in
    res.status(401)
    }
}

