const mongoose = require('mongoose');

const reportsSchema = new mongoose.Schema({
    title:{
        type:String,
        trim:true,
        required:true
    },
    description:{
        type:String,
        trim:true,
        require:true
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        require:true
    },
    reportsImg:{
        type:Buffer,
        default:`https://i.pinimg.com/originals/61/ea/94/61ea94b38db7f292dcf6dda1513b8253.jpg`
    }
},{timestamps:true})

const Reports = mongoose.model('Reports',reportsSchema)
module.exports = Reports