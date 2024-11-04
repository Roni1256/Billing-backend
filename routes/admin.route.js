import express from 'express'
import { getAllUsers,deleteUser,adminLogin } from '../controller/admin.controller.js'
import { deleteAllUser } from '../controller/admin.controller.js'
const route = express.Router()

route.get('/users',getAllUsers)
route.delete('/users/:id',deleteUser)
route.delete('/users',deleteAllUser)
route.post('/login',adminLogin)



export default route