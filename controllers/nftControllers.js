


///////////////part 3/////////////////////
const NFT =require("../models/nftModel")
const APIFeatures=require("../utils/apiFeature.js")

exports.aliasTopNFTs=async(req,res,next)=>{
  req.query.limit="5";
  req.query.sort="-ratingAverage,price";
  req.query.fields="name,price,ratingAverage,difficulty";
  next();
}



exports.getAllNfts = async (req, res) => {
  try {
    const features=new APIFeatures(NFT.find(),req.query)
    .filter()
    .sort()
    .limitfields()
    .pagination(); // chaining methods to build the query
    

    const nfts = await features.query; // executes the query and fetches real data

    // send query response to client
    res.status(200).json({
      status: "success",
      result: nfts.length,
      data: {
        nfts,
      },
    });

  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }
};

//create nft
exports.CreateNfts=async(req, res) => {
  // const newNFT=new NFT({});
  // newNFT.save();
  //other way to write this make this async function ->fetching a data might be waiting process
  
  try{
    const newNFT=await NFT.create(req.body);//this create->rather than doing .new and .save separately.
    res.status(201).json({
      status:"success",
      data:{
        nft:newNFT
      },
    });
  }catch(error){
     res.status(400).json({
      status:"fail",
      message:error,
     })
  }
  

};
// GET SINGLE NFTS
exports.getSingleNfts=async(req ,res)=>{
  try{
    const nft=await NFT.findById(req.params.id)
    res.status(200).json({
      status:"success",
      data:{
        nft,
      },
    })
  }catch(error){
     res.status(400).json({
      status:"fail",
      message:error,
     })
  }

};
//UPDATE NFTS//PATCH METHOD
exports.UpdateNfts=async(req,res)=>{
  try{
    //new:true->Returns the updated document instead of the old one
    //runValidators:true->Runs schema validators on the updated data
    const nft=await NFT.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
    res.status(200).json({
      status:"success",
      data:{
        nft,
      },
    })
  }catch(error){
     res.status(400).json({
      status:"fail",
      message:error,
     })
  }

  
}
//DELETE NFTS
exports.DeleteNfts=async(req,res)=>{
  try{
    await NFT.findByIdAndDelete(req.params.id)
    res.status(200).json({
      status:"success",
      data:null,
      
    })
  }catch(error){
     res.status(400).json({
      status:"fail",
      message:error,
     })
  }
}

//AGGREGATION PIPELINE(for calculating statics)
//usefull for dashboard,admin panel, etc
exports.getNFTsStats=async(req,res)=>{
  try{
     const stats=await NFT.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } } // Match NFTs with ratingAverage greater than or equal to 4.5
      },
      {
        $group:{
          _id:"$ratingsAverage", // Group by difficulty level
          numNFT:{$sum:1}, // Count the number of NFTs
          avgRating:{$avg:"$ratingsAverage"}, // Calculate average rating
          avgPrice:{$avg:"$price"},
          minPrice:{$min:"$price"}, // Calculate minimum price  
          maxPrice:{$max:"$price"}, // Calculate maximum price
          count:{$sum:1} // Count the number of NFTs
        }
      },
      {
        $sort:{avgRating:-1} // Sort by average rating in ascending order
      },
      {
        $match:{
          _id:{$ne:null} // Exclude null values from the results
        }
      }
     ]);
    res.status(200).json({
      status:"success",
      data:{
        stats,
      },
    }) 
  }catch(error){
    res.status(400).json({
      status:"fail",
      message:error,
    })
  }
}

//CALCULATING NUMBER OF NFT CREATE IN MONTH OR MONTHLY PLAN
exports.getMonthlyPlan = async (req, res) => {
  try {
    const year = req.params.year * 1;

    const plan = await NFT.aggregate([
      // Split array elements into separate docs
      { $unwind: "$startDates" },
      
      // Filter by year (only works if startDates are Date objects)
      { 
        $match: { 
          startDates: { 
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`)
          }
        }
      },
      {
        $group:{
          _id:{$month:"$startDates"},// Group by month
          numNFTStarts:{$sum:1}, // Count the number of NFTs started in that month
          nfts:{$push:"$name"}, // Collect names of NFTs started in that month
        }
      },
      {
        $addFields:{
          month:"$_id", // Add a new field 'month' with the month number

        }
      },
      { //hide the fields
        $project:{
          _id:0, // Exclude the _id field from the output
          
        }
      },
      {
        $sort:{numNFTStarts:-1} // Sort by number of NFT starts in descending order
      }
      
    ]);

    res.status(200).json({
      status: "success",
      data: { plan }
    });

  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message
    });
  }
};
