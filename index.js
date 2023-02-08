require('dotenv').config();
const express =require('express');
const bodyParser=require('body-parser');
const ejs=require("ejs");
const mongoose =require('mongoose')
// const encrypt=require("mongoose-encryption")
const app=express();
// const md5=require("md5");
const bcrypt=require("bcrypt");
const saltRounds=10;



app.use(express.static("public"));
app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended:true}));


//connect with the monggose 
mongoose.set('strictQuery', false);
mongoose.connect("mongodb://localhost:27017/userDB")
//create the schema 

const userSchema=new mongoose.Schema({
    email:String,
    password:String
});


const secret =process.env.SECRET;
// second argument to make the specifi field which want to encrypt 
// userSchema.plugin(encrypt,{secret:secret,encryptedFields:['password']})

//create the model here
const User=new mongoose.model("User",userSchema);



app.get("/",function(req,res){
    res.render(__dirname + "/views/home.ejs");
})




app.get("/login",function(req,res){
    res.render("login");
})


app.post("/login",function(req,res){
    const username=req.body.username;
    const password=req.body.password;
    // const password=md5(req.body.password);


    User.findOne({email:username},function(err,foundUser){
        if(err){
            console.log(err);
        }else{
            if(foundUser){
                // if(foundUser.password===password){
                    //foundUser.password is the hash of the user password
                bcrypt.compare(password,foundUser.password,function(err,result){
                   if(result===true){
                    res.render("secrets");
                   }
                })    
                

                // }
            }
        }
    })
})



app.get("/register",function(req,res){
    res.render( "register");
})



app.post("/register",function(req,res){
    bcrypt.hash(req.body.password,saltRounds,function(err,hash){
        const newUser=new User({
            email:req.body.username,
            // password:md5(req.body.password)
            password:hash
        });
        newUser.save(function(err){
            if(err){
                console.log(err);
            }else{
                res.render("secrets")
            }
        })
    })
    
})

app.listen(3000,function(){
    console.log("the server is running on the port of 3000")
})


