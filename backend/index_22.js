
import express from "express";


const app = express();

app.get("/", (req, res)=>{ //  http://localhost:5000/
res.send("Je suis bien 122 MESSI BB SOIF")
})



app.listen(5000, ()=>{
    console.log("Serveur tourne sur le port 5000");
    
})