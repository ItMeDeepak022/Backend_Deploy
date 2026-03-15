let express=require('express')
const { viewData, createData, delData, updateData } = require('../controllers/userController')
let userRouter=express()

userRouter.post('/create',createData)
//  http://localhost:8000/admin/user/create

 userRouter.get('/view',viewData)
// http://localhost:8000/admin/user/view

userRouter.delete('/delete/:id',delData)

userRouter.put('/update',updateData)

module.exports={userRouter}