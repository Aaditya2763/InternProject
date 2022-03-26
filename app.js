
if(process.env.NODE_ENV!=='production'){
  require('dotenv').config();
}

const express=require('express');
const app=express();
const path=require('path');
const productRoutes=require('./routes/productRoutes');
const ejsMate=require('ejs-mate');
const mongoose=require('mongoose');
const methodoverride=require('method-override')
const bodyParser = require('body-parser')
const flash=require('connect-flash');
const mailer=require('nodemailer');
const session=require('express-session');
const MongoStore = require('connect-mongo'); // used to store sessions because session memory is not enough to store a large numbers of sessions

const db_Url= process.env.DB_URL||'mongodb://localhost:27017/InternProject';

    mongoose.connect(db_Url)
.then(() => {
    console.log("DB Connected")
})
.catch((err) => {
   console.log("err") 
});


app.engine('ejs',ejsMate);
app.set('view engine','ejs')
app.set("views",path.join(__dirname,"views"));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }))
 




const store = MongoStore.create({
  secret: 'weneedabettersecret',
  mongoUrl: db_Url,
  touchAfter: 24 * 3600
});
// sessions are requiresd to use flash

 const sessionConfig = {
   store,
    secret: 'weneedabettersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
      // secure: true,
      httpOnly: true,
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7 * 1,
      maxAge:1000 * 60 * 60 * 24 * 7 * 1
    }
  }




  const SeedUser=require('./seed');
  SeedUser();



 app.use(methodoverride("_method"));
 app.use(session(sessionConfig));
 app.use(flash());  // common mistake is i am not using () after flash. ie  app.use(flash) instead of eriting ap.use (flash());
 


 //res.locals are used oto pass the flash message to the  every  routes  and help us to don't write msg in every routes etc 
// for more details please refer lecture-34 part-1

 app.use((req, res, next) => {     
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;
   
    next();
  });

app.use(productRoutes);





 





 





const port = process.env.PORT || 3000;


app.listen(port,()=>{
  console.log(`server started at port ${port}`);
});