const express = require('express')
const router = new express.Router()
const Journalist = require('../models/journalist')
const auth =require('../middelware/auth')
const multer = require('multer');

/** Post ************************************************/
////SginUp
router.post('/journalists',async(req,res)=>{
    try {
        const journalist = new Journalist(req.body)
        const token = await journalist.genrateToken()
        await journalist.save()
        res.status(200).send({journalist,token})
    } 
    catch(e){
        res.status(400).send("Error "+ e)
    }
})
////LogIn
router.post('/journalists/login',async(req,res) => {
    try{
        const journalist = await Journalist.findByCredentials(req.body.email,req.body.password)
        const token = await journalist.genrateToken()
        res.status(200).send({journalist,token})
    }
    catch(e){
        res.status(400).send("Error "+ e)
    }
})
/** Get ************************************************/
////get all journalists
router.get('/journalists',auth,async(req,res)=>{
    try{
        const journalists = await Journalist.find({});
        res.status(200).send(journalists)
    }
    catch(e){
        res.status(500).send("Error " + e)
    }
})
////get journalist by id
router.get('/journalists/:id',auth,async(req,res)=>{
    try{
        const _id = req.params.id;
        const journalist = await Journalist.findById(_id);
        if(!journalist){
            res.status(404).send('Journalist not found...!');
        }
        res.status(200).send(journalist);
    }
    catch(e){
        res.status(400).send(e);
    }
})
////get journalists profile
router.get('/profile',auth,async(req,res)=>{
    res.send(req.journalist);
})
/** Patch ************************************************/
////update journalist
router.patch('/journalists/:id',auth,async(req,res)=>{
    try{
        const updates = Object.keys(req.body)
        // console.log(updates);
        const allowdUpdates = ["name", "password"]
        var isValid = updates.every((update)=>allowdUpdates.includes(update))
        if (!isValid) {
            return res.status(400).send('cannot update...!')
        }
        const _id = req.params.id
        const journalist = await Journalist.findById(_id)
        // console.log(journalist)
        if (!journalist) {
            return res.status(404).send('no journalist is found...!')
        }
        updates.forEach((update)=> journalist[update] = req.body[update])
        await journalist.save()
        res.status(200).send(journalist)
    }
    catch(e){
        res.status(400).send("Error "+ e)
    }
})
/** Delete ************************************************/
////delete journalist
router.delete('/users/:id',auth,async (req,res)=>{
    try{
        const _id =req.params.id
        const journalist = await Journalist.findByIdAndDelete(_id)
        if (!journalist) {
            return res.status(404).send('unable to find journalist..!')
        }
        res.status(200).send(journalist)
    }
    catch(e){
        res.status(500).send(e)
    }
})
////logout
router.delete('/logout',auth,async(req,res)=>{
    try {
        req.journalist.tokens = req.journalist.tokens.filter((el)=>{
            return el.token !== req.token
        })  
        await req.journalist.save()
        res.send('Logout Successfully...!')  
    } 
    catch(e) {
        res.status(500).send(e)
    }
})
////logout all
router.delete('/logoutall',async(req,res)=>{
    try {
        req.journalist.tokens = []
        await req.journalist.save()
        res.send('logout from all devices successfully ...!')  
    } 
    catch(e) {
        res.status(500).send(e)
    }
})
/** Images ************************************************/
const uploads = multer({
    limits:{
        fileSize:3000000
    },

    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|png|jpeg|jfif)$/)){
            cb(new Error('Sorry you must upload image'))
        }
        cb(null,true);
    }
})
/** Post ************/
router.post('/profile/avatar',auth,uploads.single('avatar'),async(req,res)=>{
    try{
        req.journalist.avatar = req.file.buffer;
        await req.journalist.save();
       res.send("Done ..!");
    }
    catch(e){
        res.status(500).send('error '+e);
    }
})
/////////////////////////////////////////////////////////////////
module.exports = router
