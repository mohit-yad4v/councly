export async function POST(request: Request) {
  const { question, model } = await request.json();

  if (!question || !model) {
    return Response.json(
      { error: "question and model are required" },
      { status: 400 },
    );
  }

  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: question },
        ],
      }),
    },
  );

  if (!response.ok) {
    console.log(await response.text()); 
    return Response.json({ error: "Model request failed" }, { status: 502 });
  }

  const data = await response.json();

  const answer = data.choices[0].message.content;

  return Response.json({ answer });
}