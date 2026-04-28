import { Router } from 'express'
import rateLimit from 'express-rate-limit';
import { uploadFile } from '../controllers/upload'
import fileMiddleware from '../middlewares/file'

const uploadRouter = Router()

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 10, // максимум 10 запросов с IP
  message: 'Too many requests, try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

uploadRouter.post('/', limiter, fileMiddleware.single('file'), uploadFile)

export default uploadRouter
