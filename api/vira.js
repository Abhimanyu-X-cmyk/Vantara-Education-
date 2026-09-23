module.exports = async (req, res) => {
  try {
    const key = process.env.GEMINI_API_KEY;

    if (!key) {
      return res.status(500).json({
        answer: "AI service error: GEMINI_API_KEY is missing."
      });
    }

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": key
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: "You are VIRA, the AI teacher of VANTARA EDUCATION. Answer the student's question clearly and simply."
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({
        answer: "Gemini error: " + (data.error?.message || "Unknown Gemini error")
      });
    }

    const answer =
      data.candidates?.[0]?.content?.parts?.[0]?.text;

    return res.status(200).json({
      answer: answer || "Gemini returned no answer."
    });

  } catch (error) {
    return res.status(500).json({
      answer: "Server error: " + error.message
    });
  }
};