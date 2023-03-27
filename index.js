import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

dotenv.config();

const app = express().use(bodyParser.json());

app.listen(process.env.PORT || 8000, () => {    console.log("listening")  })  // node index.js

const token = process.env.WHATSAPP_TOKEN;
const verify_token = process.env.VERIFY_TOKEN;

app.get("/webhook", (req, res) => {

  // Parse params from the webhook verification request
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];


  if (mode && token) {
    if (mode === "subscribe" && token === verify_token) {
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
});




app.post("/webhook", (req, res) => {
    
    console.log(JSON.stringify(req.body, null, 2));// Check the Incoming webhook message
  
    // info on WhatsApp text message payload: https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples#text-messages
    if (req.body.object) {
      if (
        req.body.entry &&
        req.body.entry[0].changes &&
        req.body.entry[0].changes[0] &&
        req.body.entry[0].changes[0].value.messages &&
        req.body.entry[0].changes[0].value.messages[0]
      ) {
        let phone_number_id =
          req.body.entry[0].changes[0].value.metadata.phone_number_id;
        let from = req.body.entry[0].changes[0].value.messages[0].from; // extract the phone number from the webhook payload
        let msg_body = req.body.entry[0].changes[0].value.messages[0].text.body; // extract the message text from the webhook payload

        fetch(`https://graph.facebook.com/v12.0/${phone_number_id}/messages?access_token=${token}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messaging_product: 'whatsapp',
                to: from,
                text: { body: `Hi... I'm your father, your message is: ${msg_body}` }
            })
        });

      }
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  });




  app.get("/", (req, res) => {
  res.status(200).send("on duty");
  });

  export default app;