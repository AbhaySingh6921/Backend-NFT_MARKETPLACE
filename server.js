const app=require("./app");
const dotenv=require("dotenv")
const  mongoose=require("mongoose");
dotenv.config({path:"./.env"});
const DB=process.env.DATABASE.replace("<PASSWORD>",process.env.DATABASE_PASSWORD)
//connected to cloud database this thing no need to understnad
mongoose
   .connect(DB,{
    useCreateIndex:true,
    useFindAndModify:false,
    useNewUrlParser:true,
   }).then((con)=>{
    // console.log(con.connection);
    console.log("db is succefull connec")
   })
   //-------------------//


//  console.log(app.get("env"))
//console.log(process.env)
// const nftschema=new mongoose.Schema({
//     name:{
//         type:String,
//         required:[true,"a nft must have a name"],
//         unique:true,
//     },
//     rating:{
//         type:Number,
//         default:4.5,
//     },
//     price:{
//         type:Number,
//         required:[true,"A nft must have a price"]
//     }
    
// });
// //This Model lets you create, read, update, and delete NFTs from your database
// //this make NFT collection on db as nfts(make it lowercase+plural)
// const NFT=mongoose.model("NFT",nftschema);
// //instance
// const testNFt=new NFT({
//     name:"the abhay Moneky",
//     rating:7.0,
//     price:568
// })//save
// testNFt.save().then(docNFT=>{
//     console.log(docNFT)
// }).catch(error=>{
//     console.log(error)
// })



const port=process.env.PORT;//having port 4011
app.listen(port,()=>{//listen to the port
    console.log(`App running on port ${port}........`);
})

//hfhcj