const mongoose=require('mongoose');

const APiModel=mongoose.model("UserFormData",new mongoose.Schema({
    name:{type:String,require:true},
    email:{type:String,require:true},
    phone:{type:String,require:true},
    address:{type:String,require:true},
    grade:{type:String,require:true},
pass:{type:String,require:true},
gender:{type:String,require:true},

})) 

module.exports= APiModel;