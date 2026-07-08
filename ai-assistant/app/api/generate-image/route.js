export async function POST(req) {
  try {
    const { prompt } = await req.json();

    if (!prompt || prompt.trim() === "") {
      return Response.json({ error: "Prompt is required" }, { status: 400 });
    }

    const encodedPrompt = encodeURIComponent(prompt);
    const width = 1024;
    const height = 1024;
    const seed = Math.floor(Math.random() * 1000000);

    // Pollinations free image generation - no API key needed
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&seed=${seed}&nologo=true&model=flux`;

    return Response.json({ imageUrl, prompt });
  } catch (error) {
    console.error("Image generation error:", error);
    return Response.json(
      { error: "Something went wrong while generating the image" },
      { status: 500 }
    );
  }
}
