import { Request, Express } from 'express'
import multer, { FileFilterCallback } from 'multer'
import { mkdirSync } from 'fs'
import path, { join } from 'path'
import { randomUUID } from 'crypto'

type DestinationCallback = (error: Error | null, destination: string) => void
type FileNameCallback = (error: Error | null, filename: string) => void

const storage = multer.diskStorage({
    destination: (
        _req: Request,
        _file: Express.Multer.File,
        cb: DestinationCallback
    ) => {
        const destinationPath = join(
            __dirname,
            process.env.UPLOAD_PATH_TEMP
                ? `../public/${process.env.UPLOAD_PATH_TEMP}`
                : '../public'
        )

        mkdirSync(destinationPath, { recursive: true })

        cb(null, destinationPath)
    },

    filename: (
        _req: Request,
        file: Express.Multer.File,
        cb: FileNameCallback
    ) => {
        cb(null, randomUUID() + path.extname(file.originalname))
    },
})

const types = [
    'image/png',
    'image/jpg',
    'image/jpeg',
    'image/gif',
    'image/svg+xml',
]

const fileFilter = async (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
) => {
    if (!types.includes(file.mimetype)) {
        return cb(null, false)
    }

    const fileSize = Number(req.headers['content-length']);
    if (Number.isNaN(fileSize) || fileSize < 2048 || fileSize > 10485760) {
        return cb(null, false);
    }

    const { fileTypeFromBuffer } = await import('file-type');
    const type = await fileTypeFromBuffer(new Uint8Array(file.buffer.buffer));
    if (!type || !types.includes(type.mime)) {
        return cb(null, false);
    }

    return cb(null, true)
}

export default multer({ storage, fileFilter })
