const express = require('express')
const { model } = require('mongoose')
const Frontcontroller = require('../controller/Frontcontroller')
const checkUserAuth = require('../middlewear/auth')
const coursecontroller = require('../controller/coursecontroller')
const Admincontroller = require('../controller/Admincontroller')

const route = express.Router()

// route  //url           
route.get('/',Frontcontroller.login)  //method
route.get('/register',Frontcontroller.register)
route.get('/dashboard',checkUserAuth,Frontcontroller.dashboard)
route.get('/about',checkUserAuth,Frontcontroller.about)
route.get('/contact',checkUserAuth,Frontcontroller.contact)

// datainsert
route.post('/insertreg',Frontcontroller.insertReg)
route.post('/vlogin',Frontcontroller.vlogin)
route.get('/logout',Frontcontroller.logout)
route.get('/profile',checkUserAuth,Frontcontroller.profile)
route.post('/update_profile',checkUserAuth,Frontcontroller.updateprofile)
route.post("/changepassword", checkUserAuth, Frontcontroller.changepassword);

//display course
route.post('/courseinsert',checkUserAuth,coursecontroller.courseinsert)
route.get('/course_display',checkUserAuth, coursecontroller.courseDisplay)
route.get('/course_view/:id',checkUserAuth, coursecontroller.courseview)
route.get('/course_edit/:id',checkUserAuth, coursecontroller.courseedit)
route.get('/course_delete/:id',checkUserAuth, coursecontroller.coursedelete)
route.post('/courseUpdate/:id',checkUserAuth, coursecontroller.courseUpdate)

//admincontroller
route.get('/admin/deshboard',checkUserAuth,Admincontroller.deshboard)
route.post
module.exports = route