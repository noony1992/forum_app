import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req, res) {
  if (req.method === 'POST') { 
    const threadId = parseInt(req.body.threadId); 
    
    const thread = await prisma.thread.findUnique({
      where: {
        id: threadId,
      },
      include: {
        comments: true, // Include the comments associated with the thread
      },
    });

    if (!thread) {
      res.status(404).json({ error: 'Thread not found.' });
    } else {
      const newComment = await prisma.comments.create({
        data: {
          threadid: threadId,
          text: req.body.text,
          author: req.body.author,
          createdAt: req.body.timestamp.toString(),
        },
        include: {
          user: true,
        }
      })

      res.status(201).json(newComment);
    }
  } else if (req.method === 'PUT'){
    const commentText = req.body.text;
    const CommentId = req.body.id;

    const updateComment = await prisma.comments.update({
      where: {
        id: CommentId,
      },
      data: {
        text: commentText,
      },
    })
    res.json(updateComment);
  }
}