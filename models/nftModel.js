const  mongoose=require("mongoose");
//slugify is a package that converts a string into a URL-friendly format by replacing spaces and special characters with hyphens or underscores.
const slugify=require("slugify");
const  validator=require("validator")


const nftschema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"a nft must have a name"],
        unique:true,
        trim:true,
        maxlength:[40,"nft have more then 40 char" ],//maxlength work on string 
        minlength:[10,"nft have less then 10 char"],
        //validate:[validator.isAlpha,"nft name must only contain characters"],//validator is a package that validate the data
    },
    slug:String,
    secretNft:{
        type:Boolean,
        default:false,
    },
    duration:{
        type:String,
        required:[true,"a nft must have a duration"],
    },
    maxGroupSize:{
        type:Number,
        required:[true,"a nft must have a GroupSize"],
    },
    difficulty:{
        type:String,
        required:[true,"a nft must have a difficulty"],
        enum:{
            values:["easy","medium","difficult"],
            messege:"difficulty is either: easy, medium, difficult",
        }
    },
    ratingsAverage:{
        type:Number,
        default:5.8,
        min:[1,"rating must be above 1.0"],//min work on number
        max:[5,"rating must be below 5.0"],
    },
    ratingsQuantity:{
        type:Number,
        default:0
    },
    rating:{
        type:Number,
        default:4.5,
    },
    price:{
        type:Number,
        required:[true,"A nft must have a price"]
    },
    priceDiscount:{
        type:Number,
        validate:{
            validator:function(val){
                return val<this.price;//20<100 if 200>100 thorw an error 
            },
            message:"Discount price ({VALUE}) should be below regular price",
        },
    },
    summary:{
        type:String,
        trim:true,
        required:[true,"must be provide summary"]
    },
    description:{
        type:String,
        trim:true,
    },
    imageCover:{
       type:String,
       required:[true,"must be provide imageCover"]
    },
    images:[String],
    createdAt:{
        type:Date,
        default:Date.now(),
        select:false,
    },
    startDates:[Date],
} ,{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
});

//Mongoose Virtual is a property that is not stored in the database, but is calculated dynamically when you retrieve documents. It is used to show extra or derived information without saving additional fields in the database.
nftschema.virtual("durationWeeks").get(function () {
    return this.duration / 7;
});

//MONGOOSE MIDDLEWARE

//Document middleware  

/** -->why we use pre middleware
 * To validate or check conditions before update/save
 * To modify data before saving
 * --->why we post middleware(runs after .save() and .create() methods)
 * For logging or debugging saved documents
 * To trigger side effects after save/update
*/
nftschema.pre("save",function(next){
    // console.log(this);
    this.slug=slugify(this.name,{lower:true});
    next();
    
});
//QUERY MIDDLEWARE
nftschema.pre(/^find/,function(next){
    
    this.find({secretNft:{$ne:true}});//Only include documents where scerateNft is not true.-->means false case included or show
    this.start=Date.now();
    next();
});
//aggretor middleware
nftschema.pre("aggregate",function(next){
    this.pipeline().unshift({$match:{secretNft:{$ne:true}}})//unshift-->Adds one or more elements to the start of the array.
    next();
})



const NFT=mongoose.model("NFT",nftschema);

module.exports=NFT;
