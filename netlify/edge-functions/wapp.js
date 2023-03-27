
export default async (request, context) => {

    const token = Deno.env.get("WHATSAPP_TOKEN");
    const verify_token = Deno.env.get("VERIFY_TOKEN");

  
    if (context.request && context.request.url.searchParams.get("hub.mode") === "subscribe" &&
    context.request.url.searchParams.get("hub.verify_token") === verify_token) {

      return new Response(JSON.stringify(
        {status: 200,
         body: context.request.url.searchParams.get("hub.challenge"),
        })
    );
  
    } else {
  
        return new Response(JSON.stringify({status: 404, body:"unmatched"}));

    }
  
  
  
  
  }
  