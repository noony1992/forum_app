import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req, res) {
    if (req.method === 'GET') { 
        const categories = await prisma.threadCategories.findMany();  
        res.json(categories);
    }
    if (req.method === 'POST') { 
        const category = req.body.category;
        const newCategory = await prisma.threadCategories.create({
            data: {
                category: category,
            },
        })
        console.log(newCategory)
        res.status(201).json(newCategory);
        
    } else if (req.method === 'PUT'){

    }
}