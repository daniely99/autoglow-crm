import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RequestBody {
  campaignId: string;
  clientIds: string[];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("📬 send-campaign function invoked");

    // Step A: Initialize Supabase client with user auth context
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error("No authorization header provided");
      return new Response(
        JSON.stringify({ error: "Authorization header required" }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    // Get the authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error("Failed to get user:", userError?.message);
      return new Response(
        JSON.stringify({ error: "Authentication failed" }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("✅ Authenticated user:", user.id);

    // Parse request body
    const { campaignId, clientIds }: RequestBody = await req.json();

    if (!campaignId || !clientIds || clientIds.length === 0) {
      console.error("Missing required fields: campaignId or clientIds");
      return new Response(
        JSON.stringify({ error: "campaignId and clientIds are required" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`📋 Processing campaign ${campaignId} for ${clientIds.length} clients`);

    // Step B: Fetch campaign data
    const { data: campaign, error: campaignError } = await supabase
      .from('campaigns')
      .select('id, name, message_template')
      .eq('id', campaignId)
      .maybeSingle();

    if (campaignError) {
      console.error("Error fetching campaign:", campaignError.message);
      return new Response(
        JSON.stringify({ error: "Failed to fetch campaign" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!campaign) {
      console.error("Campaign not found:", campaignId);
      return new Response(
        JSON.stringify({ error: "Campaign not found" }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`📝 Campaign found: "${campaign.name}"`);

    // Fetch client data
    const { data: clients, error: clientsError } = await supabase
      .from('clients')
      .select('id, name, phone')
      .in('id', clientIds);

    if (clientsError) {
      console.error("Error fetching clients:", clientsError.message);
      return new Response(
        JSON.stringify({ error: "Failed to fetch clients" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!clients || clients.length === 0) {
      console.error("No clients found for the provided IDs");
      return new Response(
        JSON.stringify({ error: "No clients found" }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`👥 Found ${clients.length} clients to process`);

    // Step C: Process each client
    const messageTemplate = campaign.message_template || "Hey [Name], it's time for your next service!";
    const messagesCreated: string[] = [];
    const skippedClients: string[] = [];

    for (const client of clients) {
      // Skip clients without phone numbers
      if (!client.phone) {
        console.log(`⚠️ Skipping client "${client.name}" - no phone number`);
        skippedClients.push(client.id);
        continue;
      }

      // Personalize the message by replacing [Name] placeholder
      const personalizedMessage = messageTemplate.replace(/\[Name\]/gi, client.name);

      console.log(`📤 Creating message for "${client.name}": "${personalizedMessage.substring(0, 50)}..."`);

      // Action 1: Insert message into database
      const { error: insertError } = await supabase
        .from('messages')
        .insert({
          client_id: client.id,
          user_id: user.id,
          content: personalizedMessage,
          direction: 'outbound',
          status: 'sent',
        });

      if (insertError) {
        console.error(`Failed to create message for client ${client.id}:`, insertError.message);
        continue;
      }

      // Action 2: SMS API call placeholder
      // TODO: Integrate with Twilio or another SMS provider
      // Example implementation:
      // -----------------------------------------
      // const twilioAccountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
      // const twilioAuthToken = Deno.env.get('TWILIO_AUTH_TOKEN');
      // const twilioPhoneNumber = Deno.env.get('TWILIO_PHONE_NUMBER');
      //
      // await twilio.messages.create({
      //   body: personalizedMessage,
      //   from: twilioPhoneNumber,
      //   to: client.phone,
      // });
      // -----------------------------------------

      messagesCreated.push(client.id);
    }

    console.log(`✅ Campaign complete: ${messagesCreated.length} messages sent, ${skippedClients.length} skipped`);

    // Step D: Return success response
    return new Response(
      JSON.stringify({
        success: true,
        messagesCreated: messagesCreated.length,
        skippedClients: skippedClients.length,
        campaignName: campaign.name,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("Unexpected error in send-campaign:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
