// scripts/test-day2.mjs
const endpoint = "http://localhost:3000/api/evaluate";

const day2Payload = {
  dayNumber: 2,
  topic: "Describing a Meaningful Habit",
  goal: "improve-professional",
  mode: "hard",
  frameworkType: "STANDARD",
  guidelines: [
    "Opener: Name the specific habit and when it occurs.",
    "Context: Explain the past problem this routine solved.",
    "Insight: Describe the tangible mental shift.",
    "Closure: Summarize the personal takeaway."
  ],
  transcript: "For my habit I used to have exercise regularly I have I used to spend almost two hours on the field playing football and doing some physical exercise then earlier I met with an injury and lost the track from last couple of years I'm still struggling to catch that irregularity but I'm not able to The injury is has been recovered and I'm well but doing it again it is really a biggest task getting back into the track now moving forward what else I do I when I track I am not able to make it regularly but I can say twice a week I do exercises with my body weights add functional exercises with extra weight or without extra weight I am pushing myself just because I know if I can do it earlier I can do it one more time This is a real struggle for me now and I just want to catch it up with almost every regularity and get back into the shape again and I'm doing it now I just paying attention and putting myself through diet and exercise so I can get into shape and lose the extra weight that I have put in those break"
};

async function test() {
  console.log("Sending Day 2 Habit transcript to", endpoint);
  const startTime = Date.now();
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(day2Payload)
  });
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log("HTTP Status:", res.status, `(${elapsed}s)`);
  const data = await res.json();
  console.log("Response Success:", data.success);
  if (data.evaluation) {
    console.log("Overall Score:", data.evaluation.overallScore);
    console.log("GAIN Checklist:", data.evaluation.gain_checklist);
    console.log("Guideline Checks:", JSON.stringify(data.evaluation.guideline_checks, null, 2));
    console.log("Top Strength:", data.evaluation.top_strength || data.evaluation.strongestElement);
    console.log("Top Improvement:", data.evaluation.top_improvement || data.evaluation.mainImprovementPriority);
    console.log("Reflection Question:", data.evaluation.reflection_question);
    console.log("\n--- AI ASSISTED EXAMPLE ---");
    console.log(data.evaluation.aiAssistedExample);
    console.log("Example word count:", data.evaluation.aiAssistedExample?.trim().split(/\s+/).filter(Boolean).length);
  } else {
    console.log("Error / Message:", data);
  }
}

test().catch(console.error);
