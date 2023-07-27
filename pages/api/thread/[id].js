import { PrismaClient } from '@prisma/client'
import { authOptions } from 'pages/api/auth/[...nextauth]'
import { getServerSession  } from "next-auth/next"   

const prisma = new PrismaClient()

export default async function handler(req, res) {
  const session = await getServerSession( req, res, authOptions)

  if (session) {
    if (req.method === 'GET') { 
      const thread = await prisma.thread.findUnique({
        where: {
          id: parseInt(req.query.id),
        },
        include: { 
            comments: {
              include: {
                user: true,
                commentReplies: {
                  include: {
                    user: true
                  }
                }
              }
            },
            user: {
              select: {
                username: true,
                picture: true,
                admin: true,
              }
            },
          },
      })
      res.status(201).json(thread);
    }
  } else {
      // Not Signed in
      res.status(401)
  }
}