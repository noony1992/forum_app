import { PrismaClient } from '@prisma/client'
import { authOptions } from 'pages/api/auth/[...nextauth]'
import { getServerSession  } from "next-auth/next"

const prisma = new PrismaClient()

export default async function handler(req, res) {
  const session = await getServerSession( req, res, authOptions)

  if (session) {
    if (req.method === 'POST') { 
      const parentId = parseInt(req.body.parentId); 

      const comment = await prisma.comments.findUnique({
        where: {
          id: parentId,
        }
      });

      if (!comment) {
        res.status(404).json({ error: 'Comment not found.' });
      } else {
        const newCommentReplies = await prisma.commentReplies.create({
          data: {
            commentId: parentId,
            text: req.body.text,
            author: req.body.author,
            createdAt: req.body.timestamp.toString(),
          },
          include: {
            user: true
          }
        })

        res.status(201).json(newCommentReplies);
      }
    } 
  } else {
    // Not Signed in
    res.status(401)
  }
}