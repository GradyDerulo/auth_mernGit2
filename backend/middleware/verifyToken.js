import jwt from "jsonwebtoken";



//==========================================================

export const verifyToken = (req, res, next) => {
  // 1. EXTRACTION : Récupère le token depuis les cookies
  const token = req.cookies.token;
  
  // 2. VERIFICATION PRESENCE
  if (!token) return res.status(401).json({ 
    success: false, 
    message: "Unauthorized - no token provided" 
  });
  
  try {
    // 3. DECODAGE : Vérifie la signature avec la clé secrète
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. VERIFICATION VALIDITE
    if (!decoded) return res.status(401).json({ 
      success: false, 
      message: "Unauthorized - invalid token" 
    });

    // 5. AJOUT INFO : Ajoute l'ID utilisateur à la requête
    req.userId = decoded.userId;
    
    // 6. PASSAGE AU MIDDLEWARE SUIVANT
    next();
  } catch (error) {
    console.log("Error in verifyToken ", error);
    // 7. GESTION ERREURS (token expiré, signature invalide, etc.)
    return res.status(500).json({ success: false, message: "Server error" });
  }
};











/* 
__________________________________________________________________________________________

Types d'erreurs possibles :

* TokenExpiredError : Token a expiré (au-delà de 7 jours)
* JsonWebTokenError : Signature invalide ou token malformé
* NotBeforeError : Token utilisé avant la date autorisée (J PAS COMPRIS)


FLOW d'authentification complet :

1. Inscription --> signup()  --> JWT crée --> Cookie défini
2. Requêtes suivantes --> Cookie envoyé automatiquement
3. middleware --> verifyToken() -->Vérifié JWT --> Ajoute userId à req

CET ICI QUA ça M'INTERESSE 
4. Routes protégés --> ACCES UNIQUEMENT AU TOKEN VALIDE
exemple d'une route protegé puis exemple coté client comment on accede à cette route protegée


Avantage de cette architecture :

Sécurisé : Password hashé, cookies httpOnly, JWT signé
Staleless: Pas de session stockée côté serveur
Expiration: Tokens temporaires pour limiter des risques
Validation: Email à verifier avant utilisation complete

Flexible : JWT peut contenir d'autres données si necessaire
si oui donne moi un exemple puis montre moi comme on accede aux données de JWT coté client






*/

































































export const verifyToken_Avant = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ success: false, message: "Unauthorized - no token provided" });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) return res.status(401).json({ success: false, message: "Unauthorized - invalid token" });

        req.userId = decoded.userId;
        next();
    } catch (error) {
        console.log("Error in verifyToken ", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};









