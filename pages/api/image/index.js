import formidable from "formidable"
import path from "path"
import fs from "fs/promises"
import { PrismaClient } from '@prisma/client'



export const config = {
  api: {
    bodyParser: false
  }
}

const readFile = (req, saveLocally) => {
  const options = {}
  
  if (saveLocally) {
    options.uploadDir = path.join(process.cwd(), "/public/images")
    options.filename = (name, ext, path, form) => {
      return Date.now().toString() + "_" + path.originalFilename
    }
  }

  options.maxFileSize = 4000 * 1024 * 1024
  const form = formidable(options)
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      dbupdate(fields, files)   
      if (err) reject(err)
      resolve({ fields, files })
    })
  })
}

const handler = async (req, res) => {
  try {
    await fs.readdir(path.join(process.cwd() + "/public", "/images"))
  } catch (error) {
    await fs.mkdir(path.join(process.cwd() + "/public", "/images"))
  }
  await readFile(req, true)
  res.json({ done: "ok" })
}

async function dbupdate(fields, files) {
  const prisma = new PrismaClient()
  const newComment = await prisma.user.update({
    where: {
      id: parseInt(fields.userid[0]),
    },
    data: {
      picture: files.myImage[0].newFilename,
    },
  })
}

export default handler