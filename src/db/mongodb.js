require('dotenv').config()
const mongoose = require("mongoose");

mongoose.set('strictQuery', false);

//****************System Default MongoDB Compass********************//

// mongoose.connect("mongodb://localhost:27017/Autometa" , {
//     useNewUrlParser:true,
//     useUnifiedTopology:true,
//     // useFindAndModify:false

// }).then(() => {
//     console.log(`Connected To MongoDB Database`);
// }).catch((e) => {
//     console.log(`Cannot Connect To Database`);
// })


//***********************  MongoDB Atlas  *********************// 

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(`Connected To MongoDB Database`);
}).catch((e) => {
    console.log(`Cannot Connect To Database`);
})