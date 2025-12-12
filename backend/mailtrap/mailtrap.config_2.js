//1
/* 
import { MailtrapClient } from "mailtrap";
import dotenv from "dotenv";

dotenv.config();

export const mailtrapClient = new MailtrapClient({
	endpoint: process.env.MAILTRAP_ENDPOINT,
	token: process.env.MAILTRAP_TOKEN,
});

export const sender = {
	email: "mailtrap@demomailtrap.com",    //ON DOIT TROUVER DEMO
	name: "Burak",
};
 -----------------------------------------------------------------------------------*/

 //==================================================2 ====================================

  //Code avec l'api http de Mailtrap
  //installer : npm i mailtrap
  //NB: tu n'as pas besoin de nodemailer car tu utilises l'api Mailtrap , pas SMTP

/* const Nodemailer = require("nodemailer");  pas besoin ici*/

/* const { MailtrapTransport } = require("mailtrap"); */

//********************************************************************************** */

/* import { MailtrapTransport } from "mailtrap";
const TOKEN = "b1797bf0190b5fbea26bd63927028b70";
const ENDPOINT =  "https://send.api.mailtrap.io/";


const client = new Mailtrapclient({ endpoint: ENDPOINT, token : TOKEN});

const sender = {
  address: "hello@demomailtrap.co",
//  name: "Mailtrap Test",
  name: "DJIMI Vardy",
};

const recipients = [
  "derumanga@gmail.com",
];

client
  .sendMail({
    from: sender,
    to: recipients,
    subject: "You are awesome!",
    text: "Congrats for sending test email with Mailtrap!",
    category: "Integration Test",
  })
  .then(console.log, console.error); */

//********************************************************************************** */


 //================================================== Fin 2 ====================================



 import Nodemailer from "nodemailer";
import { MailtrapTransport } from "mailtrap";

const TOKEN = "b1797bf0190b5fbea26bd63927028b70";

const transport = Nodemailer.createTransport(
  MailtrapTransport({
    token: TOKEN,
  })
);

const sender = {
  address: "hello@demomailtrap.co",
  name: "Djimi",  //Expediteur
};
const recipients = [
  "derumanga@gmail.com",  //Destinateur on va le suppr
];

transport
  .sendMail({
    from: sender,
    to: recipients,
    subject: "You are awesome!",
    text: "Congrats for sending test email with Mailtrap!",
    category: "Integration Test",
  })
  .then(console.log, console.error);


/*   {
  success: true,
  message_ids: [ '2eec2330-d17d-11f0-0000-f1adff4bb960' ]
} */