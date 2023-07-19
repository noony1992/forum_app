import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req, res) {
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
        }
      })

      res.status(201).json(newCommentReplies);
    }
  } else if (req.method === 'PUT'){
//     const commentText = req.body.text;
//     const CommentId = req.body.id;

//     const updateComment = await prisma.comments.update({
//       where: {
//         id: CommentId,
//       },
//       data: {
//         text: commentText,
//       },
//     })
//     res.json(updateComment);
  }
}