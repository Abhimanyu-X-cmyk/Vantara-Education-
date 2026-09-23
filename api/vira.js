
module.exports = async (req, res) => {
  try {
    const key = process.env.GEMINI_API_KEY;

    if (!key) {
      return res.status(500).json({
        answer: "ERROR: GEMINI_API_KEY is missing in Vercel."
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
                  text: "Reply with exactly: VIRA IS WORKING"
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
        answer: "GEMINI ERROR: " +
          (data.error?.message || JSON.stringify(data))
      });
    }

    const answer =
      data.candidates?.[0]?.content?.parts?.[0]?.text;

    return res.status(200).json({
      answer: answer || "Gemini returned no text.",
      reply: answer || "Gemini returned no text."
    });

  } catch (error) {
    return res.status(500).json({
      answer: "SERVER ERROR: " + error.message
    });
  }
};
