const mongoose=require('mongoose');

const SalleryModel=mongoose.model("sallery",new mongoose.Schema({
    grade:{type:String,require:true},
    salary:{type:String,require:true},
    TA:{type:String,require:true},
    DA:{type:String,require:true},
   
})) 

module.exports= SalleryModel
;



