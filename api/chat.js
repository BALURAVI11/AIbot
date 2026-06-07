// Vercel Serverless Function: Secure Gemini AI Proxy Handler with Groq Fallback
export default async function handler(req, res) {
  // Only allow POST requests for secure prompt submission
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Method Not Allowed' }));
    return;
  }

  const { prompt } = req.body;
  if (!prompt) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Prompt is required' }));
    return;
  }

  // 1. Try Gemini AI (Primary Engine)
  try {
    let apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      const ENCODED_FALLBACK = "QVEuQWI4Uk42STFxMDY5RlN1VGx2N2JSWGJPN3ZvTWs0a193NklEY3NuSFVpMVV2TXJaS0E=";
      apiKey = Buffer.from(ENCODED_FALLBACK, "base64").toString("utf-8");
    }

    const apiURL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    const apiResponse = await fetch(apiURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          maxOutputTokens: 1000,
          temperature: 0.7
        }
      })
    });

    if (!apiResponse.ok) {
      const errBody = await apiResponse.text();
      throw new Error(`Gemini API HTTP Error ${apiResponse.status}: ${errBody}`);
    }

    const data = await apiResponse.json();
    if (data.candidates && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0].text) {
      const answer = data.candidates[0].content.parts[0].text.trim();
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ answer }));
      return;
    }

    throw new Error("Invalid response format received from Google Gemini API.");
  } catch (geminiError) {
    console.warn("⚠️ Primary Gemini engine failed. Triggering Groq Fallback...", geminiError.message);

    // 2. Trigger Groq API (Fallback Engine)
    try {
      const groqKey = process.env.GROQ_API_KEY;
      if (!groqKey) {
        throw new Error("GROQ_API_KEY environment variable is not configured.");
      }

      const groqURL = "https://api.groq.com/openai/v1/chat/completions";
      const groqResponse = await fetch(groqURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${groqKey}`
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
          max_tokens: 1000
        })
      });

      if (!groqResponse.ok) {
        const groqErr = await groqResponse.text();
        throw new Error(`Groq API HTTP Error ${groqResponse.status}: ${groqErr}`);
      }

      const groqData = await groqResponse.json();
      if (groqData.choices && groqData.choices[0] && groqData.choices[0].message) {
        const answer = groqData.choices[0].message.content.trim();
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ answer }));
        return;
      }

      throw new Error("Invalid response format received from Groq API.");
    } catch (groqError) {
      console.error("❌ Both Primary Gemini and Fallback Groq engines failed:", groqError.message);
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: `AI engine failure: Gemini (${geminiError.message}) & Groq (${groqError.message})` }));
    }
  }
}
