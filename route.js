export async function POST(req) {

  try{

    const { notes } = await req.json();

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body: JSON.stringify({
          contents:[
            {
              parts:[
                {
                  text:`
Convert these study notes into:

1. MCQs
2. Short Questions
3. Quick Revision Points

Notes:
${notes}
                  `
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    return Response.json({
      quiz:
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No response from Gemini"
    });

  }catch(err){

    return Response.json({
      error: err.message
    }, { status:500 });

  }

}