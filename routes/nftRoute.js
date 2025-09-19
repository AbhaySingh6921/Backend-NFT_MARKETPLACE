const express=require("express");
const fs=require("fs");//fs give a interaction with file system on your computer
const authController=require("../controllers/authControllers");

const nftController=require("../controllers/nftControllers");
const app = require("../app");
const { route } = require("./userRoute");
const router=express.Router()//This creates a mini router object in Express.handle route  for specific resourse 

//if a user want to delete create nft it req id
//so let create the middleware of id
// router.param("id",nftController.checkId);//it tell that if the router contain any paramter include the id then it trigger and checkid 

//-----TOP 5 NFTS BY PRICE
router.route('/top-5-nfts').get(nftController.aliasTopNFTs,nftController.getAllNfts)
//statc router
router.route('/nft-stats').get(nftController.getNFTsStats);
//get monthly plan
router.route('/monthly-plan/:year').get(nftController.getMonthlyPlan);



//route->use lets you group multiple HTTP methods (GET, POST, PATCH, DELETE, etc.) for the same URL path,
router.route('/').get(authController.protect,nftController.getAllNfts)
//.post(nftController.checkBody,nftController.CreateNfts);
.post(nftController.CreateNfts);
router
.route('/:id')
.get(nftController.getSingleNfts)
.patch(nftController.UpdateNfts)
.delete(authController.protect,
    authController.reStrictTo("admin","guide"),
    nftController.DeleteNfts);

module.exports=router;