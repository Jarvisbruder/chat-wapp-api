
export default async (request, context) => {

    const token = Deno.env.get("WHATSAPP_TOKEN");
    const verify_token = Deno.env.get("VERIFY_TOKEN");

  
    if (request.httpMethod === 'GET' &&
    request.queryStringParameters["hub.mode"] === "subscribe" &&
    request.queryStringParameters["hub.verify_token"] === verify_token) {

      return new Response(JSON.stringify(
        {status: 200,
         body: request.queryStringParameters["hub.challenge"],
        })
    );
  
    } else {
  
        return new Response(JSON.stringify({status: 404, body:"unmatched"}));

    }
  
  
  
  
  }
  