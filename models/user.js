const mongoose= require('mongoose')
const bcrypt= require('bcrypt')
const config = require('../config/db')

const UsetSchema = mongoose.Schema({
    name:{
        type:String
    },
    email:{
        type:String,
        required:true
    },
    login:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})

const User = module.exports = mongoose.model('User',UsetSchema)

module.exports.getUserByLogin = (login, callback) => {
    const query={login:login}
    User.findOne(query,callback);
}
module.exports.getUserById = (id, callback) => {
    User.findById(id,callback);
}
module.exports.addUser = (newUser, callback) => { 
    bcrypt.genSalt(10, (err, salt) => {
        console.log(newUser.name);
        bcrypt.hash(newUser.password, salt, (err, hash) => {
           if(err) throw err
           newUser.password=hash
           newUser.save(callback)
        });
    });
 
}
module.exports.comparePass = (passFromUser,userDBPass,callback) => {
    bcrypt.compare(passFromUser,userDBPass,(err,isMatch)=>{
        if(err) throw err;
        callback(null,isMatch); 
    })
}