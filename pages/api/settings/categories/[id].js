import { PrismaClient } from '@prisma/client'
import { useSession, getSession } from "next-auth/react"

const prisma = new PrismaClient()

export default async function handler(req, res) {
  const session = await getSession({ req })
    
  if (session && session.user[0].admin === true) {
    if (req.method === 'DELETE') { 
      const deleteCategory = await prisma.threadCategories.delete({
        where: {
          id: parseInt(req.query.id),
        },
      })
      res.status(201).json(deleteCategory);
    }
  } else {
    // Not Signed in
    res.status(401)
  }
}