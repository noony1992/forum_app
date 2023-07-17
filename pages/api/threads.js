import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req, res) {

  if (req.method === 'POST') {    
    const threadTitle = req.body.title;
    const threadAuthor = req.body.author;
    const createdAt = req.body.createdAt.toString();

    const newThreadId = await prisma.thread.create({
      data: {
        title: threadTitle,
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

  } else if (req.method === 'GET') {
    const threads = await prisma.thread.findMany({ 
      include: { 
        comments: {
          include: {
            user: true
          }
        },
        user: {
          select: {
            username: true,
            picture: true,
          }
        },
      },
    });  
    res.json(threads);
  } else if(req.method === 'PUT'){
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
  }

}
