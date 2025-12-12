import mongoose from "mongoose";


const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true, // Empêche deux utilisateurs avec le même email
    },
    password: {
      type: String,
      required: true, // Mot de passe hashé (jamais stocké en clair)
    },
    name: {
      type: String,
      required: true, // Nom complet de l'utilisateur
    },
    lastLogin: {
      type: Date,
      default: Date.now, // Date du dernier login, utile pour la sécurité
    },
    isVerified: {
      type: Boolean,
      default: false, // Indique si l'email a été vérifié
    },
    resetPasswordToken: String, // Token pour réinitialiser le mot de passe
    resetPasswordExpiresAt: Date, // Date d'expiration du token de réinitialisation
    
    
    verificationToken: String, // Code/Token pour vérifier l'email
    verificationTokenExpiresAt: Date, // Expiration du token de vérification
  },
  { timestamps: true } // Ajoute automatiquement createdAt et updatedAt
);

export const User = mongoose.model("User", userSchema);


/* 

Importance de chaque champ:

email : Identifiant principal, doit être unique
password : Sécurité, toujours hashé avant stockage
name: Information personnelle pour l'affichage
lastlogin: Suivie d'activité, detection d'activité suspecte
isVerifield : Sécurité, empêche l'utilisation sans vérification
resetPasswordToken/ExpiresAt : Sécurité pour la récuperation de compte
verificationToken/ExpiresAt : Verification d'email sécurisée
timestamps: Audit, savoir quand le compte a été créé/modifié






*/























