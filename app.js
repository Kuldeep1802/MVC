const express = require('express')
const app = express()
const port = 3000;
const web = require('./routes/web')
const connectdb = require('./db/connectdb')

// connect flash and session
const session = require('express-session')
const flash = require('connect-flash')
const cookieParser = require('cookie-parser')


//token get
app.use(cookieParser())

app.use(session ({
    secret:'secret',
    cookie:{maxAge: 60000},
    resave: false,
    saveUninitialized:false,  
}))
// flash messages
app.use(flash())

//connectdb
connectdb()
// data get object 
// parse application/ 
app.use(express.urlencoded({extended:false}));

//ejs setup
app.set('view engine','ejs')

// css image link
app.use(express.static('public'))


//fileuploader for image
const fileuploader = require('express-fileupload')

//call function of 
app.use(fileuploader({useTempFiles: true}))

//route load 
app.use('/',web)                        


app.listen(port, ()=>  {
    console.log('server get started')
})