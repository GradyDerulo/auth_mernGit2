import express from "express";
import { signup, login, logout, verifyEmail,  forgotPassword,resetPassword, checkAuth} from "../controllers/auth.controller.js";
/* import {
    login,
    logout,
    signup,
    verifyEmail,
    forgotPassword,
    resetPassword,
    checkAuth,
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/verifyToken.js"; */

import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();


// Acceder via compass http://localhost:5000/api/auth/check-auth
//DOnc il lit le cookie puis il affiche les informations de l'utilisateur connecté
router.get("/check-auth", verifyToken, checkAuth); //7   route nececcitant le cookie ou token

router.post("/signup", signup); //1
router.post("/login", login);//4
router.post("/logout", logout);  //3


router.post("/verify-email", verifyEmail); // 2


// Acceder via compass http://localhost:5000/api/auth/forgot-password  ({body: {"email" : "dady@gmail.com"}})
// ET nous renvoie sur GMAIL --> click sur btn "reset password" de Gmail et vous serez rediriger dans cette url  ==>
//      http://localhost:5173/reset-password/52e5682b77cd1b9b5605e5350dc60901cce0157a
router.post("/forgot-password", forgotPassword); //5

        /*            |
                      v
                 
                 dans la page ci dessous     */
            //  Maintenant c'est dans cett page qu'on va enfin changer notre Mot de passe dans notre BD
// reset-password/52e5682b77cd1b9b5605e5350dc60901cce0157a

// Acceder via compass :  http://localhost:5000/api/auth/52e5682b77cd1b9b5605e5350dc60901cce0157a
//body {password: "newPassWord"}

// NB : le token de l'email doit être valide (52e5682b77cd1b9b5605e5350dc60901cce0157a)
//NB:  et ce token une fois generé n'a la durée que d'1 heure donc faites très attention
router.post("/reset-password/:token", resetPassword); //6







//**************************************************************************************** */

//          Route pour comprendre stateless  

// MIDDLEWARE (verifyToken.js)
// Stateless = Pas de DB query, juste vérification cryptographique


// ROUTES PROTÉGÉES
router.get("/profile", verifyToken, async (req, res) => {
  // req.userId est déjà disponible grâce au middleware
  const user = await User.findById(req.userId); // Seule DB query pour les données
  
  res.json(user);
});

router.post("/posts", verifyToken, async (req, res) => {
  // Même token, même vérification, pas de session storage
  const post = new Post({
    title: req.body.title,
    author: req.userId // Direct du token
  });
});









export default router;
