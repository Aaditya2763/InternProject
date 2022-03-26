const flash = require('connect-flash/lib/flash');
const express=require('express');
var mailer=require('nodemailer');

const router=express.Router();
const bodyParser = require('body-parser')
const User=require('../model/user');





// Basic route
router.get('/',(req,res)=>{
 res.redirect("/products")

})

//Route to display index page
router.get(("/products"),async(req,res)=>{

    const users=await User.find({})

   res.render("products/index",{users})
})


//Route to display Form for adding new entity
router.get('/products/new',(req,res)=>{

    res.render('products/new');
})

//Route to post data to ('/Products)

router.post("/products",async(req,res)=>{

const {name ,phone_no,email,hobbies}=req.body;

await User.create({name ,phone_no,email,hobbies});
 req.flash('success', 'User created successfully!');
res.redirect('/products')

}) 

//route to Update form

router.get('/products/:id/edit',async(req,res)=>{

    const {id}=req.params;
    
 const user= await User.findById(id) ;
    res.render("products/edit",{user} )
})

//route to patch data

router.patch('/products/:id',async(req,res)=>{
    const {id}=req.params;
    const {name, price, img, desc }=req.body;  //error is caused  because i have not destructured name ,price ,img,desc etc
   await User.findByIdAndUpdate(id,{name, price, img, desc });
    req.flash('success', 'User updated Successfully!');
  res.redirect('/products');
})

// Route to delete  entity from entity table

router.delete('/products/:id', async (req,res)=>{   //Error is  cause due to "" qotes in router and no space between async and (req,res)
    const {id} =req.params;
    await User.findByIdAndDelete(id);
    req.flash('success', 'User deleted successfully!');
res.redirect('/products');


})




router.post('/products/:id/mail',async(req,res) =>{
const {id}=req.params;
    const data= await User.findById(id);
     const user=data;
      var transporter=mailer.createTransport(
          {
              host:'smtp.gmail.com',
              port:465,
              secure:true,
              requireTLS:true,
              service:'gmail',
              auth:{
                  user:'singhaditya2763@gmail.com',
                  pass:'dcdxehczurygspsp'

              }
          }
      )


      var mailOptions={
          from:'singhaditya2763@gmail.com',
          to: 'hunnypaliwal09@gmail.com',
          subject: 'This is a system generated mail do not reply.' ,
          text: ` This is the system generated data of Mr/Mrs. ${user.name}
                  id :${user._id},
                  Name :${user.name},
                  Phone_no:${user.phone_no},
                  Email :${user.email},
                  hobbies:${user.hobbies}`
      }
      
  transporter.sendMail(mailOptions,(error,info)=>{
          if(error){
              console.log(error)
          }
          else {
              console.log("mail sent successfully"+ info.response)
          }
      })
      
    req.flash('success', 'mail sent successfully!');

    res.redirect('/products');
})


module.exports=router;