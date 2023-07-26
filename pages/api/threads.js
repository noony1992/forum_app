import { PrismaClient } from '@prisma/client'
import { authOptions } from 'pages/api/auth/[...nextauth]'
import { getServerSession  } from "next-auth/next"   

const prisma = new PrismaClient()

export default async function handler(req, res) {
  const session = await getServerSession( req, res, authOptions)
    if (req.method === 'POST') { 
      if (session) {   
        const threadTitle = req.body.title;
        const threadAuthor = req.body.author;
        const createdAt = req.body.createdAt.toString();
        const threadBodyText = req.body.bodyText;
        const category = req.body.category;

        const newThreadId = await prisma.thread.create({
          data: {
            title: threadTitle,
            bodyText: threadBodyText,
            category: category,
            author: threadAuthor,
            createdAt: createdAt,
          },
          include: {
            user: {
              select: {
                username: true,
                picture: true,
              }
            },
          }
        })
          res.status(201).json({ newThreadId });
      } else {
        // Not Signed in
        res.status(401)
      }
  } else if (req.method === 'GET') {
    const threads = await prisma.thread.findMany({ 
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
    });  
      res.status(201).json(threads);
  } else if(req.method === 'PUT'){
    const session = await getServerSession( req, res, authOptions)
    if (session) {
      const updatedTitle = req.body.title;
      const threadId = req.body.threadid;

      const updateUser = await prisma.thread.update({
        where: {
          id: threadId,
        },
        data: {
          title: updatedTitle,
        },
      })
      res.json(updateUser);
    } else {
      // Not Signed in
      res.status(401)
    }
  }
}
