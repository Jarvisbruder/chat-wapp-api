
export default async (request, context) => {

    const token = Deno.env.get("WHATSAPP_TOKEN");
    const verify_token = Deno.env.get("VERIFY_TOKEN");

  
    const mode = context.request.url.searchParams.get("hub.mode");
    const challenge = context.request.url.searchParams.get("hub.challenge");
  
    if (mode && token) {
      if (mode === "subscribe" && token === verify_token) {
        context.response.status = 200;
        context.response.body = challenge;
      } else {
        context.response.status = 403;
      }
    }

  
        return new Response(JSON.stringify({status: 404, body:"unmatched"}));

    }
   