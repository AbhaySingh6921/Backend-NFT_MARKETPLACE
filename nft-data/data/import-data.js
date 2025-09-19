
//this is use to import many data at once time
const fs=require("fs");
const dotenv=require("dotenv")
const  mongoose=require("mongoose");
dotenv.config({path:"./.env"});
const NFT=require("../../models/nftModel")
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
   const nfts = JSON.parse(
  fs.readFileSync(`${__dirname}/nft-simple.json`, "utf-8")
);

// IMPORT DATA
const importData = async () => {
  try {
    await NFT.create(nfts);
    console.log("DATA successfully Loaded");
    process.exit();//exit to the server
  } catch (error) {
    console.log(error);
  }
};

// DELETE DATA
const deleteData = async () => {
  try {
    await NFT.deleteMany();
    console.log("DATA successfully Deleted");
    process.exit();
  } catch (error) {
    console.log(error);
  }
};
// console.log(process.argv);
//pocess[2]----->
/**[
  '/usr/bin/node',             // process.argv[0] → path to Node.js binary
  '/path/to/import-data.js',   // process.argv[1] → path to your script file
  '--import'                   // process.argv[2] → the argument you passed
] */
if(process.argv[2]==="--import"){
  importData();
}else if (process.argv[2]==="--delete"){
  deleteData();
}
//node nft-data/data/import-data.js --delete //to deploy







