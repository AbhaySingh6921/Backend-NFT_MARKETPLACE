


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

