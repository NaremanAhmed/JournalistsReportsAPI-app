const express = require('express')
const router =new express.Router()
const reports = require('../models/reports')
const auth = require('../middelware/auth')
const multer = require('multer');

/** Post ************************************************/
////
router.post('/reports',auth,async(req,res)=>{
    try{
        const reports = new Reports({...req.body,owner:req.journalist._id})
        await reports.save()
        res.status(200).send(reports)
    }
    catch(e){
        res.status(400).send("Error"+e)
    }
})
/** Get ************************************************/
////by id
router.get('/reports/:id',auth,async(req,res)=>{
    try{
        const _id = req.params.id
        const reports = await Reports.findOne({_id,owner:req.journalist._id})
        if(!reports){
            return res.status(404).send('No reports is found...!')
        }
        res.status(200).send(reports)
    }
    catch(e){
        res.status(500).send("Error"+e)
    }
})
// get all 
router.get('/reports',auth,async(req,res)=>{
    try{
        await req.journalist.populate("reports");
        res.status(200).send(req.journalist.reports)
    }
    catch(e){
        res.status(500).send("Error"+e)
    }
});
/** Patch ************************************************/
////Update reports
router.patch('/reports/:id',auth,async(req,res)=>{
    try{
        const _id = req.params.id
        const updates = Object.keys(req.body)
        const reports = await Reports.findOne({_id,owner:req.journalist._id})
        if(!reports){
            return res.status(404).send('No reports is found to update ..( ')
        }
        updates.forEach((el)=>reports[el]=req.body[el])
        await reports.save()
        res.send(reports)
    }
    catch(e){
        res.status(400).send("Error "+e)
    }
})
/** Delete ************************************************/
////Delete reports
router.delete('/reports/:id',auth,async(req,res)=>{
    try{
        const _id = req.params.id
        const reports = await Reports.findOneAndDelete({_id,owner:req.journalist._id})
        if(!reports){
        return  res.status(404).send('No reports is found to delete ..! ')
        }
        res.status(200).send(reports)
    }
    catch(e){
        res.status(500).send('Error '+e)
    }
})
/** Images ************************************************/
const uploads = multer({
    limits:{
        fileSize:5000000
    },

    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|png|jpeg|jfif)$/)){
            cb(new Error('Sorry you must upload image ..(  ..!'))
        }
        cb(null,true);
    }
})
/** Post ************/
router.post('/reports/images',auth,uploads.single('reportsImg'),async(req,res)=>{
    try{
        req.reports.reportsImg = req.file.buffer;
        await req.reports.save();
       res.send("Done ..!");
    }
    catch(e){
        res.status(500).send('error '+e);
    }
})
////image by id
// router.post('/reports/images/:id',auth,uploads.single('reportsImg'),async(req,res)=>{
//     try{
//         const _id = req.params.id
//         const reports = new Reports.findById(_id)
//         if(!reports){
//             res.status(404).send('Reports not found ..!')
//         }
//         reports.reportsImg = req.file.buffer
//         await reports.save()
//         res.send('Donee ..')
//     }
//     catch(e){
//         res.status(500).send('error '+e);
//     }
// })
///////////////////////////////////////////////////////
router.get('/newspaper/:id',auth,async(req,res)=>{
    try {
        const _id = req.params.id
        const reports = await Reports.findOne({_id,owner:req.journalist._id})
        if (!reports) {
            return res.status(404).send('No reports Found heree ...(..')
        }
        await reports.populate('owner')
        res.status(200).send(reports.owner)    
    } 
    catch (e) {
        res.status(500).send('e'+e)
    }
})

module.exports = router