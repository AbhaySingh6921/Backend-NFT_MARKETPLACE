class APIFeatures {
  constructor(query,queryString){
    this.query=query; //query is the query that we will execute
    this.queryString=queryString; //queryString is the real query that user send
  }
  //FILTERATION
  filter(){
    const queryObj = { ...this.queryString}; // copy of real query
    const excludedField = ["page", "sort", "limit", "fields","orderBy"];
    excludedField.forEach((el) => delete queryObj[el]); // remove unwanted fields from query
  
    

    // ADVANCE FILTERATION QUERY
    let queryStr = JSON.stringify(queryObj); // convert query object to string
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`); // add $  for MongoDB operators
     this.query=this.query.find(JSON.parse(queryStr)); //back to object
     return this;
  }
  //SORT
  sort(){
     if(this.queryString.sort){
      const sortBy=this.queryString.sort.split(',').join(" ")
      // console.log(sortBy);
      this.query=this.query.sort(sortBy);
    }else{
      this.query=this.query.sort("-createdAt")
    }
    return this;
  }
  //FIELD LIMITING(showing only specific fields)
  limitfields(){
     if(this.queryString.fields){
      const fields=this.queryString.fields.split(",").join(" ");
      this.query=this.query.select(fields)
    }else{
      this.query=this.query.select("-__v");
    }
    return this;
  }
  //PAGINATION
  pagination(){
    const page=this.queryString.page*1 ||1;
    const limit=this.queryString.limit*1 || 10;
    const skip=(page-1)*limit;
    this.query=this.query.skip(skip).limit(limit);
   
    
    if(this.queryString.page){
      const newNFTs= NFT.countDocuments();// Count total NFTs in the collection
      if(skip>=newNFTs) throw new Error("this page is not exist")
    }
   return this;
  }
  
}
module.exports=APIFeatures;