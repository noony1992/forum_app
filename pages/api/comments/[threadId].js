import { PrismaClient } from '@prisma/client'
import { authOptions } from 'pages/api/auth/[...nextauth]'
import { getServerSession  } from "next-auth/next"   

const prisma = new PrismaClient()

export default async function handler(req, res) {
  const session = await getServerSession( req, res, authOptions)

  if (session) {
    if (req.method === 'DELETE') { 
      const deleteComment = await prisma.comments.delete({
        where: {
          id: parseInt(req.query.threadId),
        },
      })
      res.status(201).json(deleteComment);
    }
  } else {
      // Not Signed in
      res.status(401)
  }
}