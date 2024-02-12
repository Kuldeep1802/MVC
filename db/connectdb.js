const mongoose = require('mongoose')
const Live_URL = 'mongodb+srv://kudeepyadav9363:kuldeep@cluster0.2qu10rz.mongodb.net/adminssion1234?retryWrites=true&w=majority'
const Local_URL = "mongodb://127.0.0.1:27017/adminssion1234";
const connectdb = () =>  {
    return mongoose.connect(Live_URL)
    .then(() => {
        console.log('connecting successfully')
    }).catch((error) => {
        console.log(error)
    })
}
module.exports = connectdb