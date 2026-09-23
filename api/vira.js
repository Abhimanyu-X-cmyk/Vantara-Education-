export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ error: "Question is required" });
    }

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" +
        process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [
              {
                text: "You are VIRA, the AI teacher of VANTARA EDUCATION. Explain concepts clearly and simply for students of Classes 6 to 12. For mathematics, show steps. For science and other subjects, explain concepts with examples. Be encouraging, accurate, and educational."
              }
            ]
          },
          contents: [
            {
              role: "user",
              parts: [{ text: question }]
            }
          ]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.message || "Gemini API error"
      });
    }

    const answer =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "VIRA couldn't generate an answer.";

    return res.status(200).json({ answer });
  } catch (error) {
    return res.status(500).json({
      error: "Server error"
    });
  }
}