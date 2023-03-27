
exports.handler = async (event, context) => {
    
  const token = process.env.WHATSAPP_TOKEN;
  const verify_token = process.env.VERIFY_TOKEN;

  if (event.httpMethod === 'GET' &&
  event.queryStringParameters["hub.mode"] === "subscribe" &&
  event.queryStringParameters["hub.verify_token"] === verify_token) {

    return {
      statusCode: 200,
      body: event.queryStringParameters["hub.challenge"]
    }

  } else if (event.httpMethod === 'POST' && event.body) {

    const body = JSON.parse(event.body);

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

      await fetch(`https://graph.facebook.com/v12.0/${phone_number_id}/messages?access_token=${token}`, {
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

    return {
      statusCode: 200
    }

  } else {

    return {
      statusCode: 404,
      body: "not matched"

    }
  }




}
