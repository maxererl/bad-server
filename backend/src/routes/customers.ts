import { Router } from 'express'
import rateLimit from 'express-rate-limit';
import {
    deleteCustomer,
    getCustomerById,
    getCustomers,
    updateCustomer,
} from '../controllers/customers'
import auth, { roleGuardMiddleware } from '../middlewares/auth'
import { Role } from '../models/user'

const customerRouter = Router()

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 25, // максимум 25 запросов с IP
  message: 'Too many requests, try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

customerRouter.get('/',
    limiter,
    auth,
    roleGuardMiddleware(Role.Admin),
    getCustomers
)
customerRouter.get('/:id', auth, roleGuardMiddleware(Role.Admin), getCustomerById)
customerRouter.patch('/:id', limiter, auth, roleGuardMiddleware(Role.Admin), updateCustomer)
customerRouter.delete('/:id', auth, roleGuardMiddleware(Role.Admin), deleteCustomer)

export default customerRouter
