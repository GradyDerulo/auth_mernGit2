//2
//from
import {
	PASSWORD_RESET_REQUEST_TEMPLATE,
	PASSWORD_RESET_SUCCESS_TEMPLATE,
	VERIFICATION_EMAIL_TEMPLATE,
} from "./emailTemplates.js";
/* import { mailtrapClient, sender } from "./mailtrap.config.js"; */


	//recipients
/* import { VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js"; */
import { transport, sender } from "./mailtrap.config.js";

export const sendVerificationEmail = async (email, name, verificationToken) => {
  try {
    // Remplace les variables dans le template
    const htmlContent = VERIFICATION_EMAIL_TEMPLATE
      .replace("{name}", name)
      .replace("{verificationCode}", verificationToken);


	  
    // Envoi avec Nodemailer
    const response = await transport.sendMail({
      from: sender,
      to: email,    // derumanga@gmail.com
      subject: "Verify your email",
      html: htmlContent,
      text: `Your verification code is: ${verificationToken}`, // Version texte
      category: "Email Verification",
    });

    /* console.log("✅ Verification email sent:", response.messageId); */
    console.log("✅ Verification email sent:", response);
		//Verification email sent: undefined  message_ids
    return response;
  } catch (error) {
    console.error("❌ Error sending verification email:", error);
    throw new Error(`Email sending failed: ${error.message}`);
  }
};
//__________________________________________________________________________



//______________________________________________________________________________












//___________________________________________________________________________________
			//Ici on envoi du template MailTrap
export const sendWelcomeEmail_Avant = async (email, name) => {
	const recipient = [{ email }];

	try {
		const response = await mailtrapClient.send({
			from: sender,
			to: recipient,
			template_uuid: "e65925d1-a9d1-4a40-ae7c-d92b37d593df",
			template_variables: {
				company_info_name: "Auth Company",
				name: name,
			},
		});

		   // Envoi avec Nodemailer
    const response2 = await transport.sendMail({
      from: sender,
      to: email,    // derumanga@gmail.com
      subject: "Verify your email",
      html: htmlContent,
      text: `Your verification code is: ${verificationToken}`, // Version texte
      category: "Email Verification",
    });



		console.log("Welcome email sent successfully", response);
	} catch (error) {
		console.error(`Error sending welcome email`, error);

		throw new Error(`Error sending welcome email: ${error}`);
	}
};



export const sendWelcomeEmail = async (email, userName) => {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f8f8f8;">
      <div style="max-width: 500px; margin: auto; background: #ffffff; padding: 25px; border-radius: 10px;">
        <h2 style="color: #4CAF50; text-align: center;">Bienvenue, ${userName} ! 🎉</h2>

        <p style="font-size: 16px; color: #333;">
          Nous sommes ravis de t’avoir parmi nous. Ton compte a bien été créé et tu peux dès maintenant accéder à toutes les fonctionnalités de notre plateforme.
        </p>

        <p style="font-size: 15px; color: #555;">
          Si tu as la moindre question, notre équipe est toujours disponible pour t’aider.
        </p>

        <p style="font-size: 16px; margin-top: 20px;">À très bientôt 👋</p>
      </div>
    </div>
  `;

  try {
    const response = await transport.sendMail({
      from: sender,  //Expediteur 
      to: email,	//destinateur
      subject: "Bienvenue parmi nous ! 🎉",
      html: htmlContent,
    });

    console.log("Welcome Email sent:", response);
    return response;
  } catch (error) {
    console.error("Error sending Welcome Email:", error);
    throw new Error("Failed to send welcome email");
  }
};

//___________________________________________________________________________________



// envoyer un e-mail de réinitialisation du mot de passe
export const sendPasswordResetEmail = async (email, resetURL) => {
/* 	const recipient = [{ email }]; */

	try {
/* 		const response_Avant = await mailtrapClient.send({
			from: sender,
			to: recipient,
			subject: "Reset your password",
			html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
			category: "Password Reset",
		});
 */


       // Envoi avec Nodemailer
    const response = await transport.sendMail({
      from: sender,
      to: email,    // derumanga@gmail.com
     	subject: "Reset your password",
    //  text: `Your verification code is: ${verificationToken}`, // Version texte
      	html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),  // Version html
      	category: "Password Reset",
    });
    
    console.log("✅ Verification email sent:", response);

	} catch (error) {
		console.error(`Error sending password reset email`, error);

		throw new Error(`Error sending password reset email: ${error}`);
	}
};

//___________________________________________________________________________________




//envoyer un e-mail de réinitialisation de succès
export const sendResetSuccessEmail = async (email) => {
	/* const recipient = [{ email }]; */

	try {

     const response_simple = await transport.sendMail({
      from: sender,
      to: email,    // derumanga@gmail.com
     	subject: "Password Reset Successful",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
      category: "Password Reset", 
    });

    console.log("✅ Verification email sent:", response_simple);


		console.log("Password reset email sent successfully", response);
	} catch (error) {
		console.error(`Error sending password reset success email`, error);

		throw new Error(`Error sending password reset success email: ${error}`);
	}
};
//___________________________________________________________________________________
