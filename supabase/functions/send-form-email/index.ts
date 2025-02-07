
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ContactFormData {
  type: 'contact';
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface CareerFormData {
  type: 'career';
  name: string;
  email: string;
  phone?: string;
  position: string;
  resume: string;
  github?: string;
  telegram?: string;
  coverLetter: string;
}

type FormData = ContactFormData | CareerFormData;

const client = new SmtpClient({
  connection: {
    hostname: "smtp.gmail.com",
    port: 465,
    tls: true,
    auth: {
      username: "tradenlypro@gmail.com",
      password: Deno.env.get('GMAIL_APP_PASSWORD') as string,
    },
  },
});

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData: FormData = await req.json();
    let emailContent: string;
    let subject: string;

    if (formData.type === 'contact') {
      subject = `New Contact Form Submission: ${formData.subject}`;
      emailContent = `
Name: ${formData.name}
Email: ${formData.email}
Subject: ${formData.subject}

Message:
${formData.message}
      `;
    } else {
      subject = `New Career Application: ${formData.position}`;
      emailContent = `
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone || 'Not provided'}
Position: ${formData.position}
Resume URL: ${formData.resume}
GitHub: ${formData.github || 'Not provided'}
Telegram: ${formData.telegram || 'Not provided'}

Cover Letter:
${formData.coverLetter}
      `;
    }

    await client.send({
      from: "tradenlypro@gmail.com",
      to: "tradenlypro@gmail.com",
      subject,
      content: emailContent,
    });

    await client.close();

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in send-form-email function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
