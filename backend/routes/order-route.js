import express from 'express'
import { orderData } from '../controllers/order-controller.js'
import userMiddlerware from '../middlewares/user.mid.js'

const router=express.Router()

router.post("/", userMiddlerware,orderData)

export default router