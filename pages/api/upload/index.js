import formidable from "formidable"
import path from "path"
import fs from "fs/promises"

export const config = {
  api: {
    bodyParser: false
  }
}

const readFile = (req, saveLocally) => {
  const options = {}
  if (saveLocally) {
    options.uploadDir = path.join(process.cwd(), "/public/uploads")
    options.filename = (name, ext, path, form) => {
      return Date.now().toString() + "_" + path.originalFilename
    }
  }
  options.maxFileSize = 4000 * 1024 * 1024
  const form = formidable(options)
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err)
      console.log()
      resolve({ fields, files })
    })
  })
}

const handler = async (req, res) => {
  try {
    await fs.readdir(path.join(process.cwd() + "/public", "/uploads"))
  } catch (error) {
    await fs.mkdir(path.join(process.cwd() + "/public", "/uploads"))
  }
  const file = await readFile(req, true)
  res.json({ filePath: `public/uploads/${file.files.payroll.newFilename}` })
}

export default handler
