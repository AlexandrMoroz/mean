const express= require('express')
const cors = require('cors')
const bodyParser= require('body-parser')
const mongoose= require('mongoose')
const passport= require('passport')  
const path  = require('path')
const config = require('./config/db')
const account = require('./routes/account')

const app = express()

const port = 3000



app.use(passport.initialize())
app.use(passport.session())

require('./config/password')(passport)
app.use(cors())

app.use(bodyParser.json())

app.use(express.static(path.join(__dirname,'public')))

app.use('/account', account)

mongoose.connect(config.db,{useNewUrlParser: true,useUnifiedTopology: true })

mongoose.connection.on("connect",()=>{
    console.log("подключенно")
})

mongoose.connection.on("error",()=>{
    console.log("Не подключенно")
})


app.get('/',(req,res)=>{
    res.send('Главная страница');
});


app.listen(port,()=>{
    console.log("Сервер был запущен по порту: 3000");
});