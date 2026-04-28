import { Router } from 'express'
import rateLimit from 'express-rate-limit';
import {
    deleteCustomer,
    getCustomerById,
    getCustomers,
    updateCustomer,
} from '../controllers/customers'
import auth from '../middlewares/auth'

const customerRouter = Router()

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 25, // максимум 25 запросов с IP
  message: 'Too many requests, try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

customerRouter.get('/', limiter, auth, getCustomers)
customerRouter.get('/:id', auth, getCustomerById)
customerRouter.patch('/:id', limiter, auth, updateCustomer)
customerRouter.delete('/:id', auth, deleteCustomer)

export default customerRouter
