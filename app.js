
// ////GET ReQUEST
// app.get('/api/v1/nfts',(req,res)=>{
//     res.status(200).json({
//         status:"success",
//         result:nfts.length,
//         data:{
//             nfts,
//         }
//     })
// })

// //POST REQUEST
// //suppose  A client (Postman, frontend app, etc.) sends a POST request with NFT data in the request body to add data
// app.post('/api/v1/nfts', (req, res) => {
//   // 1. Get the last ID and increment it
//   const newId = nfts[nfts.length - 1].id + 1;

//   // 2. Merge new ID with request body
//   const newNft = Object.assign({ id: newId }, req.body);//object.assign-> it assign to existing file;

//   // 3. Add to the array
//   nfts.push(newNft);

//   // 4. Save to file 
//   try {
//     fs.writeFileSync(//this write for database
//       `${__dirname}/nft-data/data/nft-simple.json`,
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
// });

// //get single nft
// app.get('/api/v1/nfts/:id/',(req,res)=>{
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
// })

// //Patch Method
// app.patch('/api/v1/nfts/:id',(req,res)=>{

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
// })

// //delete method
// app.delete('/api/v1/nfts/:id',(req,res)=>{

//   //validation
//   if(req.params.id*1>nfts.length){
//     return res.status(404).json({
//       status:"404 error",
//       data:{
//         nfts:"not found"
//       }
//     })
//   }
//   res.status(204).json({
//     status:"success",
//     data:{
//       nft:{},
//     }
//   })
// })
// const fs=require("fs");//fs give a interaction with file system on your computer
// const express=require("express");
// const morgan=require("morgan");//this give what the client req  in terminal

// const app=express();//it is now a server object
// app.use(morgan("dev"))
// app.use(express.json());

// //middleware ->order is required
// app.use((req,res,next)=>{
//   console.log("hey am from middleware");
//   next();
// })
// app.use((req,res,next)=>{
//   req.requestTime=new Date().toISOString();
//   next();
// })
// const nfts=JSON.parse(fs.readFileSync(`${__dirname}/nft-data/data/nft-simple.json`)//Json.parse->This converts that JSON string into a usable JavaScript object/array.
// );

// //--------------FUNCTION START -----------------//


// //TO GET ALL THE NFTS
// const getAllNfts=(req,res)=>{
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
// const CreateNfts=(req, res) => {
//   // 1. Get the last ID and increment it
//   const newId = nfts[nfts.length - 1].id + 1;

//   // 2. Merge new ID with request body
//   const newNft = Object.assign({ id: newId }, req.body);//object.assign-> it assign to existing file;

//   // 3. Add to the array
//   nfts.push(newNft);

//   // 4. Save to file 
//   try {
//     fs.writeFileSync(//this write for database
//       `${__dirname}/nft-data/data/nft-simple.json`,
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
// const getSingleNfts=(req,res)=>{
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
// const UpdateNfts=(req,res)=>{

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
// const DeleteNfts=(req,res)=>{

//   //validation
//   if(req.params.id*1>nfts.length){
//     return res.status(404).json({
//       status:"404 error",
//       data:{
//         nfts:"not found"
//       }
//     })
//   }
//   res.status(204).json({
//     status:"success",
//     data:{
//       nft:{},
//     }
//   })
// }
// //-----------------FUNCTION END----------------------------//


// //----------------USER START------------//
// const getAllUser=(req,res)=>{
//   res.status(500).json({
//     status:"error",
//     message:"Internal server Error"
//   })
// }
// const CreateUser=(req,res)=>{
//   res.status(500).json({
//     status:"error",
//     message:"Internal server Error"
//   })
// }
// const getSingleUser=(req,res)=>{
//   res.status(500).json({
//     status:"error",
//     message:"Internal server Error"
//   })
// }
// const UpdateUser=(req,res)=>{
//   res.status(500).json({
//     status:"error",
//     message:"Internal server Error"
//   })
// }
// const DeleteUser=(req,res)=>{
//   res.status(500).json({
//     status:"error",
//     message:"Internal server Error"
//   })
// }


// //nft router
// /*
// 1->app.get('/api/v1/nfts',getAllNfts);
// 2->app.get('/api/v1/nfts',CreateNfts);
// 3->app.get('/api/v1/nfts/:id',getSingleNfts);
// 4->app.get('/api/v1/nfts/:id',UpdateNfts);
// 5->app.get('/api/v1/nfts/:id',DeleteNfts);
// */

// //short hand for above 
// const nftsRouter=express.Router()
// const UserRouter=express.Router();
// //nft router
// nftsRouter.route('/').get(getAllNfts).post(CreateNfts);//using 1,2
// nftsRouter
// .route('/:id')
// .get(getSingleNfts)
// .patch(UpdateNfts)
// .delete(DeleteNfts);//using 3,4,5
// //user router
// UserRouter.route('/').get(getAllUser).post(CreateUser)
// UserRouter.route('/:id').get(getSingleUser).delete(DeleteUser).patch(UpdateUser);

// ;//why we use->it create a mini router if it is not use then it look messy
// app.use("/api/v1/nfts",nftsRouter);
// app.use('/api/v1/users',UserRouter);


// const port=4011;//having port 4011
// app.listen(port,()=>{//listen to the port
//     console.log(`App running on port ${port}........`);
// })

//-----------------------part 2-------------------------//



const express=require("express");
const morgan=require("morgan");//this give what the client req  in terminal
const nftsRouter=require("./routes/nftRoute");
const UserRouter=require("./routes/userRoute");
const rateLimit=require("express-rate-limit");//this is used to limit the number of requests from a single IP address
const helmet=require("helmet");//this is used to secure the app by setting various HTTP headers
const mongoSantize=require("express-mongo-sanitize");//this is used to prevent NoSQL injection attacks by sanitizing user input
const xss=require("xss-clean");//this is used to prevent XSS attacks by sanitizing user input

const app=express();//it is now a server object

//if if the environment is dev then only use middleware not for prodution envuronment
// if(process.env.NODE_ENV==="development"){
// app.use(morgan("dev"))//for middleware
// }
app.use(morgan("dev"))//for middleware

app.use(express.json({limit:"10kb"}));
//serveing template demo
app.use(express.static(`${__dirname}/nft-data/img`))//It tells Express to serve static files (like images, CSS, JS files) from the nft-data/img folder to the client.


//data sanitation against nosql query injection
app.use(mongoSantize());//this is used to prevent NoSQL injection attacks by sanitizing user input
//data sanitation against XSS attacks
app.use(xss());//this is used to prevent XSS attacks by sanitizing user input


//secure header http
app.use(helmet());//this is used to secure the app by setting various HTTP headers
const limiter=rateLimit({
  max:100,//max 100 request per hour
  windowMs:60*60*1000,//1 hour
  message:"Too many requests from this IP, please try again in an hour"
})
app.use('/api',limiter);//apply rate limit to all api routes


//why we use->it create a mini router if it is not use then it look messy
app.use("/api/v1/nfts",nftsRouter);//tell  For any request that starts with /api...../ use the routes and logic inside nftsrouter
app.use('/api/v1/users',UserRouter);


module.exports=app;

