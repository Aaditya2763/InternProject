
const mongoose=require('mongoose');


const userSchema=new mongoose.Schema({
  
    
    name:{
        type:String
    },

    phone_no :{
        type:Number
    },

    email:{
        type:String
    },

    hobbies:{
         type:String
    }


});

const user=mongoose.model('user',userSchema)



module.exports=user;