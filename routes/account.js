const express= require('express')
const router= express.Router()
const User = require('../models/user')
const passport = new require('passport');
const jwt = require("jsonwebtoken")
const config = require("../config/db")
// router.get('/reg', (req,res)=>{
//     res.send('Страница регистрации');
// });

router.post('/reg', (req,res)=>{
    console.log(req.body.name)
    let newUser=new User({
        name :req.body.name,
        email :req.body.email,
        login :req.body.login,
        password :req.body.password,
    })
   User.addUser(newUser,(err,user)=>{
    if (err) {
        res.json({succes:false,msg:"Пользователь не был добавлен"});
    }else
        res.json({succes:true,msg:"Пользователь был добавлен"});
   })
});

router.post('/auth', (req,res)=>{
   const login=req.body.login
   const password=req.body.password

   User.getUserByLogin(login,(err,user)=>{
       if(err) throw err;
       if(!user)
            return res.json({succes: false, msg:"Пользователь не найден"})

        User.comparePass(password, user.password,(err,isMatch)=>{
            if(err) throw err;

            if(isMatch){
                const token = jwt.sign(user.toJSON(), config.secret, {
                    expiresIn: 3600 * 24
                })
                res.json({
                    succes: true, 
                    token:'JWT' + token,
                    user: {
                        id: user._id,
                        name: user.name,
                        login: user.login,
                        email: user.email
                    },
                    msg:"Вход выполнен"})
            }else{
                return res.json({succes: false, msg:"Пароли не совпадают"})
            }
            
        })
   });
});

router.get('/dashbord', passport.authenticate('jwt',{session:false}), (req,res)=>{
    res.send('Страница Пользователя');
});
module.exports = router;