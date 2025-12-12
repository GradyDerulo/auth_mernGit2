const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require("cors");
const cookieParser = require('cookie-parser')


const { uploadController } = require("../api/Routes/uploadImage.js");
const authRoute = require('./Routes/auth.js');
const prodRoute = require('./Routes/product.js');
const saleRoute = require('./Routes/sale.js');
const userRoute = require('./Routes/users.js');
const expenseRoute = require("./Routes/expenses")

/* const uploadController = require('./Routes/uploadImage.js'); */
const zoyaRoute = require("./Routes/zoyaR.js")  //zoyaRoute


const app = express();
dotenv.config();

//middlewares
app.use(cors()); /*Local */

 /*
app.use(cors({
  origin: ["http://localhost:5173", "http://172.20.10.10:5173"] //Autorise votre Ip frontend
//  origin: ["http://172.20.10.10:5173"] //Autorise votre Ip frontend
})); */    // Réseau

app.use(cookieParser()); //Obligatoire pour lire req.cookies
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static('public'))    //c'est dans ce dossier que seront logé nos images




const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to mongoDB.");
  } catch (error) {
    throw error;
  }
};
mongoose.connection.on("disconnected", () => {
  console.log("mongoDB disconnected!");
});


app.use('/upload', uploadController);    /*Modifié ici   */  //image

app.use("/api/zoya", zoyaRoute);  //test

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute)
app.use("/api/products", prodRoute)
app.use("/api/sales", saleRoute);
app.use("/api/expenses", expenseRoute);


app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  });
});



app.listen(8800, () => {
  connect();
  console.log(`Server tourne au port 8800`)
})
