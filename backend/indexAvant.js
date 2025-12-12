import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";  //Pour lire les cookies
import path from "path";
import mongoose from "mongoose";
import { connectDB_MongoDB } from "./db/connectDB.js";
import authRoutes from "./routes/auth.route.js";



dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use(express.json()); // allows us to parse incoming requests:req.body
app.use(cookieParser()); // allows us to parse incoming cookies  (Tres important pour lecture des cookies)
                        // 	(  projet reservation hotel avec Lamadev)



app.use("/api/auth", authRoutes);


/* app.get('/', (req,res)=>{   //  Tester http://localhost:3000/
    res.send("Hello Derulo")
});   originalPath*/



if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/frontend/dist")));

    /* app.get("*", (req, res) => {    Ancien  */
    app.get("/*", (req, res) => {       // new 
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
    });
}

app.listen(PORT, ()=>{
    connectDB_MongoDB()
    console.log(`Server is running on port ${PORT}`);
    
})