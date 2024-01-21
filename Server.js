const express = require("express");
const app = express();
require("dotenv").config({path:"./config/.env"});
const mongoose = require("mongoose");
const User = require("./models/user.js");
const bodyParser = require("body-parser");


// parse my app :
app.use(bodyParser.urlencoded({extended: false}))
// parse my app en form json
app.use(bodyParser.json())

// connection database :
mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("MongoDB connected"))
.catch(err => console.log(err))


// routes : 
app.post("/",async (req,res,next)=>{
    const newUser = new User(req.body);
    try{
        await newUser.save();
        res.status(201).json({message: "success"})
    }catch(error){
        res.status(500).send(error);
    }
});

app.get("/",async (req,res,next)=>{
    try{
        const users = await  User.find({});
        res.status(201).send(users);
    }catch(error){
        res.status(500).send(error);
    }
});
app.put("/:id",async (req,res,next)=>{
    try{
        const updateUser = await User.findOneAndUpdate(
            {_id: req.params.id},
            {$set: req.body}
        );
        if(!updateUser){
            res.status(404).send("not found");
        }
        res.status(201).send(updateUser);

    }catch(error){
        res.status(500).send(error);
    }
});
app.delete("/:id",async (req,res,next)=>{
    try{await User.findOneAndDelete({_id:req.params.id})
    res.status(201).send("success");}
    catch(error){
        res.status(500).send(error);
    }
});



// run the server-----------------------------------------------
const port = process.env.PORT;
app.listen(port,()=>console.log("SERVER RUN IN PORT ",port));