import mongoose from "mongoose";

/* 
==============================================
export const connectDB = async () => {
    try {
        console.log("mongo_uri: ", process.env.MONGO_URI);
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log("Error connection to MongoDB: ", error.message);
        process.exit(1); // 1 is failure, 0 status code is success
    }
};
 ================================*/
//==========================================
// "mongodb+srv://derulo_auth_mern:cXRANhsdkb4TMMTo@cluster0.42lzy8z.mongodb.net/AUTH_mern?appName=Cluster0"


export const connectDB_MongoDB = async () => {
  try { 
   /*  await mongoose.connect(process.env.MONGO_URI); */
    await mongoose.connect(process.env.MONGO_URI_Cloud);
    console.log("Connected to mongoDB.");
  } catch (error) {
    throw error;
  }
};
mongoose.connection.on("disconnected", () => {
  console.log("mongoDB disconnected!");
});