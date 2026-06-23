export async function POST(req) {
  try {
    const { notes } = await req.json();

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `Convert these notes into MCQs, short questions and revision points:\n\n${notes}`,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    console.log(data);

    if (data.error) {
      return Response.json({
        quiz: "Gemini Error: " + data.error.message,
      });
    }

    const text =
      data.candidates?.[0]?.content?.parts?.[0]?.text;

    return Response.json({
      quiz: text || "No text generated",
    });
  } catch (err) {
    return Response.json({
      quiz: "Server Error: " + err.message,
    });
  }
}