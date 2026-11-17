const key = process.env.NVIDIA_API_KEY;
const base = process.env.NVIDIA_BASE_URL || "https://integrate.api.nvidia.com/v1";

if (!key) {
  console.log("NVIDIA_API_KEY not found. Check your .env file.");
  process.exit(1);
}

const models = [
  "openai/gpt-oss-20b",
  "nvidia/nemotron-nano-3-30b-a3b",
  "nvidia/nemotron-3.5-lightning-30b-a3b",
  "nvidia/nemotron-3-super-120b-a12b",
  "nvidia/nemotron-3.5-bolt-e4b",
  "nv-mistralai/mistral-nemo-12b-instruct",
  "google/gemma-3-12b-it",
  "google/gemma-3-4b-it",
  "microsoft/phi-3.5-moe-instruct",
  "ibm/granite-3.0-8b-instruct",
  "minimaxai/minimax-m3.1-flash",
  "moonshotai/kimi-k2.6",
  "meta/llama-3.2-90b-vision-instruct",
  "nvidia/llama-3.1-nemotron-ultra-253b-v1",
];

const prompt =
  'Reply with JSON only, no other text. Keys: "strength", "improvement", "question" (all strings). ' +
  'Give feedback on this speech sample: "Hello everyone, I am Sajid. Basically I like building things, and actually I am learning to speak clearly."';

async function testModel(model) {
  const start = Date.now();
  try {
    const res = await fetch(`${base}/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        max_tokens: 800,
      }),
      signal: AbortSignal.timeout(30000),
    });
    const secs = ((Date.now() - start) / 1000).toFixed(1);
    if (!res.ok) return `${model} -> FAILED status ${res.status} (${secs}s)`;
    const data = await res.json();
    const text = data.choices?.[0]?.message?.content ?? "";
    let validJson = false;
    try {
      JSON.parse(text.replace(/```json|```/g, "").trim());
      validJson = true;
    } catch {}
    return `${model} -> OK in ${secs}s | valid JSON: ${validJson} | reply length: ${text.length}\n   preview: ${text.slice(0, 120).replace(/\n/g, " ")}`;
  } catch (e) {
    const secs = ((Date.now() - start) / 1000).toFixed(1);
    return `${model} -> ERROR ${e.name} after ${secs}s`;
  }
}

const results = await Promise.all(models.map(testModel));
results.forEach((r) => console.log(r));
