import bcryptjs from "bcryptjs";
import crypto from "crypto";

/* import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js"; */
import {
	sendPasswordResetEmail,
	sendResetSuccessEmail,
	sendVerificationEmail,
	sendWelcomeEmail,
} from "../mailtrap/emails.js";
import { User } from "../models/user.model.js"; 
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
//************************************************************************************* */

/* import bcryptjs from "bcryptjs";
import { User } from "../models/user.model.js"; */
/* import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js"; */
/* import { sendVerificationEmail } from "./emails.js";  */ // Chemin corrigé




export const signup_Avant = async (req, res) => {
  const { email, password, name } = req.body; // 1. Extraction des données

  try {
    // 2. VALIDATION : Vérification que tous les champs sont fournis
    if (!email || !password || !name) {
      throw new Error("All fields are required");
    }

    // 3. VERIFICATION UNICITE : Vérifie si l'email existe déjà
    const userAlreadyExists = await User.findOne({ email });
    
    if (userAlreadyExists) {
      return res.status(400).json({ 
        success: false, 
        message: "User already exists" 
      });
    }

    // 4. SECURITE : Hashage du mot de passe
    const hashedPassword = await bcryptjs.hash(password, 10);
    
    // 5. GENERATION TOKEN : Création d'un code à 6 chiffres pour vérification  
		//POURQUOI CREER CE CODE A 6 chiffre et comment ça se cree <===>  ( Dans le controller )
    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

    // 6. CREATION USER : Création de l'objet utilisateur
    const user = new User({
      email,
      password: hashedPassword, // Stockage du hash, pas du mot de passe clair
      name,
      verificationToken, // Code envoyé par email pour vérification
	//CRISPIN (ce code peut se verifier Selon la date du jour, Apres demain il faut new code )
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // Expire dans 24h
    });
		//   Tardons un peu ici :  verificationTokenExpiresAt
    // 7. SAUVEGARDE : Enregistrement dans la base de données
    await user.save();

    // 8. AUTHENTIFICATION : Création du token JWT et cookie
    generateTokenAndSetCookie(res, user._id);


		//EMAIL  POUR LE CODE DE VERIFICATION (A REMETTRE)
						//ICi         Voici les parametre (email et code à 6 chiffres)
		// await sendVerificationEmail(user.email, verificationToken); 

    // 9. REPONSE : Renvoie les données sans le mot de passe
    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        ...user._doc, // Spread operator pour copier toutes les propriétés
        password: undefined, // Supprime le password de la réponse
      },
    });
  } catch (error) {
    // 10. GESTION ERREURS
    res.status(400).json({ success: false, message: error.message });
  }
};

//======================================================================
export const signup = async (req, res) => {
  const { email, password, name } = req.body;

  try {
    if (!email || !password || !name) {
      throw new Error("All fields are required");
    }

    const userAlreadyExists = await User.findOne({ email });
    if (userAlreadyExists) {
      return res.status(400).json({ 
        success: false, 
        message: "User already exists" 
      });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    
    // Code à 6 chiffres
    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

    const user = new User({
      email,
      password: hashedPassword,
      name,
      verificationToken,
    //  verificationTokenExpiresAt: Date.now() + 15 * 60 * 1000, // 15 minutes
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // Expire dans 24h

      isVerified: false
    });

    await user.save();

    // Générer JWT
    generateTokenAndSetCookie(res, user._id);

    /* await sendVerificationEmail(user.email, user.name, verificationToken); */

			//  REMETTRE EMAIL
 	/*  await sendVerificationEmail("derumanga@gmail.com", user.name, verificationToken);  */



		/* console.log("Signup : ", user) */
    res.status(201).json({
      success: true,
      message: "User created. Please check your email for verification code.",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        isVerified: false
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
};


//=========================================================================================
/* 

	// jwt (creation du token)
		generateTokenAndSetCookie(res, user._id);

				//EMAIL  POUR LE CODE DE VERIFICATION (A REMETTRE)
		// await sendVerificationEmail(user.email, verificationToken); 
		res.status(201).json({
			success: true,
			message: "User created successfully",
			user: {
				...user._doc,
				password: undefined,
			},
		});

*/










//=====================================================================

export const verifyEmail_Avant = async (req, res) => {
	//on aura une interface user le permettant de saisir une valeur à 6 chiffres
	//1 2 3 4 5 6
	const { code } = req.body;
	try {
			//Ici on tente de trouver cet utilisateur 
		const user = await User.findOne({
			verificationToken: code,
			//si c'est superieur aux données actuelles, cela signifie que c'est toujours valable
			//c'est juste pour nous assurer que ce jeton n'as pas expiré

			/*  ça cause des erreurs, reglé ça plutard 
			ici on verifie simplement si ce jeton  t-il été expirer
			(comment on le verifie)
			verificationTokenExpiresAt: { $gt: Date.now() }, */
		});

		if (!user) {
			return res.status(400).json({ success: false, message: "Invalid or expired verification code" });
		}

			//Si oui cad si on reussi à verifier Alors on modifie les champs, 
		user.isVerified = true;	//on le passe à true pour dire OK le compte est verifié
		user.verificationToken = undefined; //on supprime ceci 
		user.verificationTokenExpiresAt = undefined;	//on supprime ceci car il n'y a aucun interêt
		await user.save();  //puis on sauvegarde dans la BD cad on met à jour notre BD

		//Puis envoyer un email De bienvenu
		//REVOIR (25minutes bouton desabonner )
	
		/*
	Error sending Welcome Email: Error: Error: Demo domains can only be used to send emails
		    to account owners. You can only send testing emails to your own email address.
		 await sendVerificationEmail("derumanga@gmail.com", user.name, verificationToken); 		*/
		await sendWelcomeEmail("derumanga@gmail.com", user.name);

		res.status(200).json({
			success: true,
			message: "Email verified successfully",
			user: {
				...user._doc,
				password: undefined,
			},
		});
	} catch (error) {
		console.log("error in verifyEmail ", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

//=====================================================================

export const verifyEmail = async (req, res) => {
	const { code } = req.body;
	try {
		const user = await User.findOne({
			verificationToken: code,
			verificationTokenExpiresAt: { $gt: Date.now() },
		});

		if (!user) {
			return res.status(400).json({ success: false, message: "Invalid or expired verification code" });
		}

		user.isVerified = true;
		user.verificationToken = undefined;
		user.verificationTokenExpiresAt = undefined;
		await user.save();

		/* await sendWelcomeEmail(user.email, user.name); */
		await sendWelcomeEmail("derumanga@gmail.com", user.name);


		res.status(200).json({
			success: true,
			message: "Email verified successfully",
			user: {
				...user._doc,
				password: undefined,
			},
		});
	} catch (error) {
		console.log("error in verifyEmail ", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

//===================================================================

		//generateTokenAndSetSookie
export const logout = async (req, res) => {
	res.clearCookie("token");
	res.status(200).json({ success: true, message: "Logged out successfully" });
};

//=====================================================================

export const login = async (req, res) => {
	const { email, password } = req.body;
	try {
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(400).json({ success: false, message: "Invalid credentials" });
		}
		const isPasswordValid = await bcryptjs.compare(password, user.password);
		if (!isPasswordValid) {
			return res.status(400).json({ success: false, message: "Invalid credentials" });
		}

		generateTokenAndSetCookie(res, user._id);

		user.lastLogin = new Date();  
		await user.save();

		res.status(200).json({
			success: true,
			message: "Logged in successfully",
			user: {
				...user._doc,
				password: undefined,
			},
		});
	} catch (error) {
		console.log("Error in login ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};


//=====================================================================

export const forgotPassword = async (req, res) => {
	const { email } = req.body;
	try {
		const user = await User.findOne({ email });

		if (!user) {
			return res.status(400).json({ success: false, message: "User not found" });
		}

		// Generate reset token
		const resetToken = crypto.randomBytes(20).toString("hex");
		const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour , pour qu'on verifie

		user.resetPasswordToken = resetToken; //on modifie le champ resetPasswordToken
		user.resetPasswordExpiresAt = resetTokenExpiresAt; //on modifie ceci aussi

		await user.save();


		// send email 
			//  `http://localhost:5173/reset-password/${resetToken}`
			//Reference à cette route : router.post("/reset-password/:token", resetPassword); //6
			
			//  REMETTRE EMAIL 
	/* await sendPasswordResetEmail("derumanga@gmail.com", `${process.env.CLIENT_URL}/reset-password/${resetToken}`);
 */



			// on renvoie à l'utilisateur qu'un message
		/* res.status(200).json({ success: true, message: "Password reset link sent to your email" }); */
		res.status(200).json({ success: true, message: "Un lien de réinitialisation de mot de passe a été envoyé à votre adresse e-mail." });
	} catch (error) {
		console.log("Error in forgotPassword ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};

//=====================================================================

export const resetPassword = async (req, res) => {
	try {
		const { token } = req.params;  //dans le parametre de l'url
		const { password } = req.body;

			//findOne pour nous renvoyer directement un objet et pas beosin de faire data[0].user
			//  Mais acceder à user directement
			//find lui renvoi bien un tableau et donc on serait obliger de faire ceci data[0].user
		const user = await User.findOne({
			resetPasswordToken: token,
			resetPasswordExpiresAt: { $gt: Date.now() }, //Ici on verifie la validité (NB; validité 1heure)
		});

		if (!user) {
			return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
		}


		// update password (On modifie le password directement dans notre BD)
		const hashedPassword = await bcryptjs.hash(password, 10);

		user.password = hashedPassword;  //on remplace l'ancien password par le nouveau
		user.resetPasswordToken = undefined;	//on met vide ce champs car ça n'a plus d'importance
		user.resetPasswordExpiresAt = undefined;	//on vide aussi celui ci
		await user.save();  //   puis on sauvegarde les modifications de cet utilisateur dans notre BD

			//ET ici on renvoi l'email de 
		/* await sendResetSuccessEmail(user.email); */
		//  REMETTRE EMAIL
		/* await sendResetSuccessEmail("derumanga@gmail.com"); */

		res.status(200).json({ success: true, message: "Password reset successful" });
	} catch (error) {
		console.log("Error in resetPassword ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};
//=====================================================================

//Fonction permettant de recuperer les infos de l'utilisateur connecté
export const checkAuth = async (req, res) => {
	try {
		const user = await User.findById(req.userId).select("-password"); //on exclus le password
		if (!user) {
			return res.status(400).json({ success: false, message: "User not found" });
		}

		res.status(200).json({ success: true, user });
	} catch (error) {
		console.log("Error in checkAuth ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};
