const jwt = require('jsonwebtoken')   // use for security 
const { model } = require('mongoose')
const UserModel = require('../models/User')

const checkUserAuth = async (req, res, next) => {
   // console.log('middlewear')
   const {token} = req.cookies  // token get
  // console.log(token)
  
  if(!token) {  
    req.flash('error','unauthorized Login')
    res.redirect('/')
  } else {
    const data = jwt.verify(token,'skabcsbcksdbcsdvbkdnckdbcs')
    const userdata = await UserModel.findOne({_id: data.ID})
    // console.log(userdata)
     // console.log(data)
     req.userdata = userdata
    next()

   }
}

module.exports = checkUserAuth