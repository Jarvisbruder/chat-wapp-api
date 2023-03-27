

export default async (request, context) => {

    const token = Deno.env.get("WHATSAPP_TOKEN");
    const verify_token = Deno.env.get("VERIFY_TOKEN");

  
    if (request.httpMethod === 'GET' &&
    request.queryStringParameters["hub.mode"] === "subscribe" &&
    request.queryStringParameters["hub.verify_token"] === verify_token) {
  
      return Response.status(200).body(request.queryStringParameters["hub.challenge"])
  
    } else if (request.httpMethod === 'POST' && request.body) {
  
      const body = JSON.parse(request.body);
  
      console.log(JSON.stringify(body, null, 2));// Check the Incoming webhook message
  
      if (
        body.object &&
        body.entry &&
        body.entry[0].changes &&
        body.entry[0].changes[0] &&
        body.entry[0].changes[0].value.messages &&
        body.entry[0].changes[0].value.messages[0]
      ) {
        const phone_number_id = body.entry[0].changes[0].value.metadata.phone_number_id;
        const from = body.entry[0].changes[0].value.messages[0].from;
        const msg_body = body.entry[0].changes[0].value.messages[0].text.body;
  
 
        const payload = {
          "messaging_product": "whatsapp",
          "recipient_type": "individual",
          "to": from,
          "type": "text",
          "text": {
            "preview_url": false,
            "body": `Hi... ${from}, your message is: ${msg_body}`
          }
        }
  
  
       await fetch('https://graph.facebook.com/v12.0/' + phone_number_id + "/messages", {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          },
        body: JSON.stringify(payload),
        redirect:'follow'
        })
        .then(res => res.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
        console.log(response)
  
  
      }
  
      return Response.status(200)
  
    } else {
  
        return Response.status(200).body("not matched")
    }
  
  
  
  
  }
  