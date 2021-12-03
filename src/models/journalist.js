const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const journalistSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    age:{
        type:Number,
        default:00,
        validate(value){
            if (value<0) {
                throw new Error('Please Enter a Valid Age must number...!')
            }
        }
    },
    mobile:{
        type:String,
        required:true,
        trim:true,
        validate(value){
            if(!validator.isMobilePhone(value ,['ar-EG'])){
                throw new Error('Please Enter a Valid Mobile in egypt...!')
            }
        }
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true,
        lowercase:true,
        validate(value){
            if (!validator.isEmail(value)) {
                throw new Error('Please Enter a Valid Email...!')
            }
        }
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minLength:6
    },
    avatar:{
        type:Buffer,
        default:`https://cdn2.f-cdn.com/contestentries/1440473/30778261/5bdd02db9ff4c_thumb900.jpg`
    },
    tokens:[
        {
            token:{
                type:String,
                required:true
            }
        }
    ]
},{timestamps:true});

///journalist & reports
journalistSchema.virtual('reports',{
    ref:'reports',
    localField:'_id',
    foreignField:'owner'
})

///hash password
journalistSchema.pre('save',async function(next){
    const journalist = this
    // console.log(journalist)
    if (journalist.isModified('password')){
        journalist.password =await bcrypt.hash(journalist.password,8)
    }
    next()
})

///login
journalistSchema.statics.findByCredentials = async (email,password) =>{
    const journalist =await Journalist.findOne({email:email})
    if(!journalist){
        throw new Error('please sign up...!')
    }
    // console.log(journalist)
    const isMatch = await bcrypt.compare(password,journalist.password)
    if(!isMatch){
        throw new Error('Unable to login...!')
    }
    return journalist 
}

///jsonwebtoken
journalistSchema.methods.genrateToken = async function(){
    const journalist = this
    // console.log(journalist)
    const token = jwt.sign({_id:journalist._id.toString()},process.env.JWT_SECRET)
    journalist.tokens = journalist.tokens.concat({token})
    await journalist.save()
    return token
}

////hide dataa 
journalistSchema.methods.toJSON = function(){
    const journalist = this 
    const journalistObject = journalist.toObject()
    delete journalistObject.password
    delete journalistObject.tokens
    return journalistObject
}
/////////////////////////////////////////////
/////////////////////////////////////////////
const Journalist =mongoose.model('Journalist',journalistSchema)
/////////////////////////////////////////////
module.exports = Journalist
