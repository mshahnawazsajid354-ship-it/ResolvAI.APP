const key = process.env.NVIDIA_API_KEY;
const base = process.env.NVIDIA_BASE_URL || "https://integrate.api.nvidia.com/v1";

if (!key) {
  console.log("NVIDIA_API_KEY not found. Check your .env file.");
  process.exit(1);
}

const models = [
  "nvidia/llama-3.1-nemotron-70b-instruct",
  "google/gemma-4-31b-it",
  "mistralai/mistral-large-2-instruct",
  "deepseek-ai/deepseek-v4.1-flash",
  "z-ai/glm-5.3-flash",
];

const prompt =
  'Reply with JSON only, no other text. Keys: "strength", "improvement", "question" (all strings). ' +
  'Give feedback on this speech sample: "Hello everyone, I am Sajid. Basically I like building things, and actually I am learning to speak clearly."';

for (const model of models) {
  const start = Date.now();
  try {
    const res = await fetch(`${base}/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        max_tokens: 400,
      }),
      signal: AbortSignal.timeout(40000),
    });
    const secs = ((Date.now() - start) / 1000).toFixed(1);
    if (!res.ok) {
      console.log(`${model} -> FAILED status ${res.status} (${secs}s)`);
      continue;
    }
    const data = await res.json();
    const text = data.choices?.[0]?.message?.content ?? "";
    let validJson = false;
    try {
      JSON.parse(text.replace(/```json|```/g, "").trim());
      validJson = true;
    } catch {}
    console.log(`${model} -> OK in ${secs}s | valid JSON: ${validJson}`);
    console.log("   preview:", text.slice(0, 150).replace(/\n/g, " "));
  } catch (e) {
    const secs = ((Date.now() - start) / 1000).toFixed(1);
    console.log(`${model} -> ERROR ${e.name} after ${secs}s`);
  }
}
