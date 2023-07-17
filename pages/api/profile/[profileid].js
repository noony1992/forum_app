import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req, res) {
    const query = req.query;

    if (req.method === 'POST') {    
        
    
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
                    }
                  },
                  user: true,
                }
              },
              user: true,
            }
          }
          },
        });  
        delete profile[0].email;
        delete profile[0].password;
        //console.log(profile[0].user.password)

        res.json(profile);
      }
}