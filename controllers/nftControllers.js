
// // const fs=require("fs");
// // const nfts=JSON.parse(fs.readFileSync(`${__dirname}/../nft-data/data/nft-simple.json`)//Json.parse->This converts that JSON string into a usable JavaScript object/array.
// // );

// //from real database
// const NFT =rquire("../models/nftModel")

// // exports.checkId=(req,res,next,value)=>{
// //   console.log(`ID: ${value}`);
// //     //validation
// //   if(req.params.id*1>nfts.length){
// //     return res.status(404).json({
// //       status:"404 error",
// //       data:{
// //         nfts:"not found"
// //       }
// //     })
    
// //   }
// //   next();
// // }
// //for checking missing data 
// // exports.checkBody=(req,res,next)=>{
// //    if(!req.body.name || !req.body.price){
// //     return res.json({
// //       status:"fail",
// //       messege:"data missing(name || price)",
// //     })
// //    }
// //    next();
// // }
// exports.getAllNfts=(req,res)=>{
//   console.log(req.requestTime);
//   res.status(200).json({
//     status:"success",
//     result:nfts.length,
//     requestTime:req.requestTime,
//     data:{
//       nfts,
//     }
//   })
// }
// //create nft
// exports.CreateNfts=(req, res) => {
//   // 1. Get the last ID and increment it
//   const newId = nfts[nfts.length - 1].id + 1;

//   // 2. Merge new ID with request body
//   const newNft = Object.assign({ id: newId }, req.body);//object.assign-> it assign to existing file;

//   // 3. Add to the array
//   nfts.push(newNft);

//   // 4. Save to file 
//   try {
//     fs.writeFileSync(//this write for database
//       `${__dirname}/../nft-data/data/nft-simple.json`,
//       JSON.stringify(nfts)//JSON.stringify convert the json/object(sent by user) into Array/String and add to the nfts
//     );
//     res.status(201).json({
//       status: "success",
//       nft: newNft,
//     });
//   } catch (err) {
//     res.status(500).json({
//       status: "error",
//       message: "Failed to save NFT to file",
//     });
//   }
// };
// // GET SINGLE NFTS
// exports.getSingleNfts=(req,res)=>{
//   //console.log(req.params)//this give the parameter passed in the url by client
//   const id=req.params.id*1//why *1? because req.params is string and we need number
//   if(id>=nfts.length){
//     return res.status(404).json({
//       status:"404 error",
//       message:"NFT not found",
//     })
//   }
//   const nft=nfts.find((el)=>el.id ===id);
//   res.json({
//     status:"success",
//     data:{
//       nft:nft,
//     }
//   })
// };
// //UPDATE NFTS
// exports.UpdateNfts=(req,res)=>{

//   //validation
//   if(req.params.id*1>nfts.length){
//     return res.status(404).json({
//       status:"404 error",
//       data:{
//         nfts:"not found"
//       }
//     })
//   }
//   res.status(200).json({
//     status:"success",
//     data:{
//       nft:"updated"
//     }
//   })
// }
// //DELETE NFTS
// exports.DeleteNfts=(req,res)=>{
//   res.status(204).json({
//     status:"success",
//     data:{
//       nft:{},
//     }
//   })
// }

//-------------------part 2-------------//


//from real database
//import the NFT modal or instance
// const NFT =require("../models/nftModel")

// exports.aliasTopNFTs=async(req,res,next)=>{
//   req.query.limit="5";
//   req.query.sort="-ratingAverage,price";
//   req.query.fields="name,price,ratingAverage,difficulty";
//   next();
// }



// exports.getAllNfts = async (req, res) => {

//     // const nfts=await NFT.find(queryObj)
//     // const nfts=await NFT.find({
//     //   price:78,
//     //   duration:67,
//     // }) // fetches all documents from the "nfts" collection (which came from your NFT model).
//   try {
//     const queryObj = { ...req.query }; // copy of real query
//     const excludedField = ["page", "sort", "limit", "fields","orderBy"];
//     excludedField.forEach((el) => delete queryObj[el]); // remove unwanted fields from query
  
//     /** why we advanced filtering here?
//      * -> USER SEND--->GET /api/v1/nfts?duration[gte]=5&price[lt]=100
//      * ->come in backend as ->req.query ={ duration:{gte:'5'},difficulty:'easy' }
//       -->but mangoose want this as -->   { duration:{$gte:'5'},difficulty:'easy' }                                 
//        -->so we add $ to the query
//       ->
//      */

//     // ADVANCE FILTERATION QUERY
//     let queryStr = JSON.stringify(queryObj); // convert query object to string
//     queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`); // add $  for MongoDB operators

//     // Executive query
//     let query = NFT.find(JSON.parse(queryStr));//back to object 

//     //SORTING METHOD
//     if(req.query.sort){
//       const sortBy=req.query.sort.split(',').join(" ")
//       console.log(sortBy);
//       query=query.sort(sortBy);
//     }else{
//       query=query.sort("-createdAt")
//     }

//     //FIELD LIMITING
//     if(req.query.fields){
//       const fields=req.query.fields.split(",").join(" ");
//       query=query.select(fields)
//     }else{
//       query=query.select("-__v");
//     }

//     //PAGINATION FUNCTION
//      const page=req.query.page*1 ||1;//if user set the page otherwise page will 1
//      const limit=req.query.limit*1 || 10;
//      const skip=(page-1) *limit;

//      query=query.skip(skip).limit(limit);

//      if(req.query.page){
//       const newNFTs=await NFT.countDocuments();// Count total NFTs in the collection
//       if(skip>=newNFTs) throw new Error("this page is not exist")
//      }
    

//     const nfts = await query; // executes the query and fetches real data

//     // send query response to client
//     res.status(200).json({
//       status: "success",
//       result: nfts.length,
//       data: {
//         nfts,
//       },
//     });

//   } catch (error) {
//     res.status(400).json({
//       status: "fail",
//       message: error,
//     });
//   }
// };

// //create nft
// exports.CreateNfts=async(req, res) => {
//   // const newNFT=new NFT({});
//   // newNFT.save();
//   //other way to write this make this async function ->fetching a data might be waiting process
  
//   try{
//     const newNFT=await NFT.create(req.body);//this create->rather than doing .new and .save separately.
//     res.status(201).json({
//       status:"success",
//       data:{
//         nft:newNFT
//       },
//     });
//   }catch(error){
//      res.status(400).json({
//       status:"fail",
//       message:error,
//      })
//   }
  

// };
// // GET SINGLE NFTS
// exports.getSingleNfts=async(req ,res)=>{
//   try{
//     const nft=await NFT.findById(req.params.id)
//     res.status(200).json({
//       status:"success",
//       data:{
//         nft,
//       },
//     })
//   }catch(error){
//      res.status(400).json({
//       status:"fail",
//       message:error,
//      })
//   }

// };
// //UPDATE NFTS//PATCH METHOD
// exports.UpdateNfts=async(req,res)=>{
//   try{
//     //new:true->Returns the updated document instead of the old one
//     //runValidators:true->Runs schema validators on the updated data
//     const nft=await NFT.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
//     res.status(200).json({
//       status:"success",
//       data:{
//         nft,
//       },
//     })
//   }catch(error){
//      res.status(400).json({
//       status:"fail",
//       message:error,
//      })
//   }

  
// }
// //DELETE NFTS
// exports.DeleteNfts=async(req,res)=>{
//   try{
//     await NFT.findByIdAndDelete(req.params.id)
//     res.status(200).json({
//       status:"success",
//       data:null,
      
//     })
//   }catch(error){
//      res.status(400).json({
//       status:"fail",
//       message:error,
//      })
//   }
// }


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
