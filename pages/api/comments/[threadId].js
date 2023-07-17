import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req, res) {
  if (req.method === 'DELETE') { 
    const deleteComment = await prisma.comments.delete({
      where: {
        id: parseInt(req.query.threadId),
      },
    })
    res.status(201).json(deleteComment);
  }
}