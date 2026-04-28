import { Request, Express } from 'express'
import multer, { FileFilterCallback, StorageEngine } from 'multer'
import { mkdirSync, unlinkSync } from 'fs'
import { writeFile } from 'fs/promises'
import path, { join } from 'path'
import { randomUUID } from 'crypto'
import BadRequestError from '../errors/bad-request-error'

const types = [
    'image/png',
    'image/jpg',
    'image/jpeg',
    'image/gif',
    'image/svg+xml',
]

const fileFilter = (
    _req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
) => {
    cb(null, types.includes(file.mimetype))
}

const storage: StorageEngine = {
    async _handleFile(_req, file, cb) {
        const destination = join(
            __dirname,
            process.env.UPLOAD_PATH_TEMP
                ? `../public/${process.env.UPLOAD_PATH_TEMP}`
                : '../public'
        )
        mkdirSync(destination, { recursive: true })

        const chunks: Buffer[] = []
        file.stream.on('data', (chunk: Buffer) => chunks.push(chunk))
        file.stream.on('error', cb)
        file.stream.on('end', async () => {
            try {
                const buffer = Buffer.concat(chunks)

                if (buffer.length < 2048 || buffer.length > 10485760) {
                    return cb(new BadRequestError('Invalid file size'))
                }

                const { fileTypeFromBuffer } = await import('file-type')
                const type = await fileTypeFromBuffer(buffer)
                if (!type || !types.includes(type.mime)) {
                    return cb(new BadRequestError('Invalid file type'))
                }

                const filename = randomUUID() + path.extname(file.originalname)
                const filePath = join(destination, filename)
                await writeFile(filePath, buffer)

                return cb(null, { destination, filename, path: filePath, size: buffer.length })
            } catch (err) {
                return cb(err as Error)
            }
        })
    },

    _removeFile(_req, file, cb) {
        unlinkSync(file.path)
        cb(null)
    },
}

export default multer({ storage, fileFilter })
