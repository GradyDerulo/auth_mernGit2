import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie_AVANT = (res, userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return token;
};

//=============================================================================

export const generateTokenAndSetCookie = (res, userId) => {
  // 1. CREATION TOKEN JWT
  const token = jwt.sign(
    { userId }, // Payload : données encodées dans le token
    process.env.JWT_SECRET, // Clé secrète pour signer le token
    {
      expiresIn: "7d", // Le token expire dans 7 jours
    }
  );

  // 2. CONFIGURATION COOKIE
  res.cookie("token", token, {
    httpOnly: true, // Empêche l'accès via JavaScript (protection XSS)
    secure: process.env.NODE_ENV === "production", // HTTPS seulement en prod
    sameSite: "strict", // Protection contre les attaques CSRF
    maxAge: 7 * 24 * 60 * 60 * 1000, // Expiration du cookie (7 jours)
  });

  return token;
};


/*  comment on le test sur postman et comment on le recuperer coté client dans une route securisée
EXPLICATION DU JWT

* Structure : header.payload.signature
* Payload : Contient "userId" (et d'autres données optionnelles)
* Signature : Garantit l'integrité avec JWT_SECRET


Ce qui m'interesse

* Stateless : Le serveur n'a pas besoin de stocker le token


SECURITE DES COOKIES :

* httpOnly : Le cookie n'est pas accessible via document.cookie
* secure : Envoi uniquement via HTTPS en production
* sameSite: "strict" : Cookie envoyé uniquement pour les requêtes du même site (PAS COMPRIS)
* maxAge: Durée de vie cohérente avec le JWT(7 jours)















*/
