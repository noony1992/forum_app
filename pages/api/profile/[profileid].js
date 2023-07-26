import { PrismaClient } from '@prisma/client'
import { authOptions } from 'pages/api/auth/[...nextauth]'
import { getServerSession  } from "next-auth/next"   

const prisma = new PrismaClient()

export default async function handler(req, res) {
    const query = req.query;
    const session = await getServerSession( req, res, authOptions)

    if (session) {
      if (req.method === 'POST') {    
          //add post stuff later
      } else if (req.method === 'GET') {
          const profile = await prisma.user.findMany({ 
            where: {
              username: query.profileid,
              },
            include: { 
              threads: {
                include: {
                  user: true,
                  comments: {
                    include: {
                      user: true,
                      commentReplies: true,
                    }
                  }
                }
              },
            comments: {
              include: {
                thread: {
                  include: {
                    comments: {
                      include: {
                        user: true,
                        commentReplies: true,
                      }
                    },
                    user: true,
                  }
                },
                user: true,
                commentReplies: true,
              }
            }
            },
          });  
          delete profile[0].email;
          delete profile[0].password;
          //console.log(profile[0].user.password)

          res.json(profile);
         }
      } else {
        // Not Signed in
        res.status(401)
    }
}