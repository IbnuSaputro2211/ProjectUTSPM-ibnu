import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { message } = await req.json();
  const API_KEY = process.env.GEMINI_API_KEY;
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;
  
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: message }] }],
      }),
    });
    
    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Maaf, tidak bisa menjawab.";
    
    return NextResponse.json({ reply });
  } catch (err) {
    console.error(err); 
    return NextResponse.json({ error: "Gagal mendapatkan respon dari AI" }, { status: 500 });
  }
}