// Vercel Serverless Function: Secure Gemini AI Proxy Handler
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

  // Retrieve private environment variable configured in Vercel Dashboard
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Gemini API Key is not configured on Vercel. Please set GEMINI_API_KEY in your Vercel Project Settings.' }));
    return;
  }

  try {
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
          maxOutputTokens: 500,
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
  } catch (err) {
    console.error("Gemini API serverless error:", err);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: err.message }));
  }
}
