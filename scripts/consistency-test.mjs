// scripts/consistency-test.mjs
// Runs the same transcript 3 times in Coaching (light) and 3 times in Direct critique (hard)
// at temperature 0.2 to evaluate scoring variance across dimensions.
// Note: Never logs or reads any API keys or secrets.

const endpoint = "http://localhost:3000/api/evaluate";

const standardTranscript =
  "Hello everyone, I am Sajid, a junior software engineer. Basically I am here to share my progress on our system integration and core metrics. Over the past week, actually we resolved several latency bottlenecks and improved our database indexing. Moving forward, my primary focus will be on hardening our API endpoints and reducing response times across our services. I look forward to collaborating with everyone on next steps and getting your constructive feedback.";

const basePayload = {
  transcript: standardTranscript,
  dayNumber: 1,
  topic: "Introducing Yourself Beyond Your Name",
  goal: "improve-professional",
  guidelines: [
    "Greet warmly and establish role domain",
    "Acknowledge recent initiative or resolved bottleneck",
    "Share concrete insight or measurable metric",
    "Navigate out with an open collaboration prompt"
  ]
};

async function runSingleEvaluation(mode, runNum) {
  const modeLabel = mode === "light" ? "Coaching" : "Direct critique";
  console.log(`Executing ${modeLabel} - Run ${runNum}...`);
  const start = Date.now();

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Origin": "http://localhost:3000"
      },
      body: JSON.stringify({
        ...basePayload,
        mode
      })
    });

    const elapsed = ((Date.now() - start) / 1000).toFixed(2);
    const json = await res.json().catch(() => null);

    if (!res.ok || !json?.success) {
      console.log(`  -> FAILED HTTP ${res.status}: ${json?.error || "Unknown error"}`);
      return {
        mode: modeLabel,
        run: runNum,
        status: res.status,
        overall: "ERR",
        clarity: "ERR",
        structure: "ERR",
        specificity: "ERR",
        language: "ERR",
        time: elapsed
      };
    }

    const dims = json.evaluation.dimensions;
    console.log(`  -> OK in ${elapsed}s | Overall: ${json.evaluation.overallScore} | C:${dims.clarity.score} S:${dims.structureAndFlow.score} Sp:${dims.specificity.score} L:${dims.languageEffectiveness.score}`);

    return {
      mode: modeLabel,
      run: runNum,
      status: 200,
      overall: json.evaluation.overallScore,
      clarity: dims.clarity.score,
      structure: dims.structureAndFlow.score,
      specificity: dims.specificity.score,
      language: dims.languageEffectiveness.score,
      time: elapsed,
      model: json.model_used
    };
  } catch (err) {
    const elapsed = ((Date.now() - start) / 1000).toFixed(2);
    console.log(`  -> NETWORK ERROR: ${err.message}`);
    return {
      mode: modeLabel,
      run: runNum,
      status: "ERR",
      overall: "ERR",
      clarity: "ERR",
      structure: "ERR",
      specificity: "ERR",
      language: "ERR",
      time: elapsed
    };
  }
}

async function main() {
  console.log("==============================================================");
  console.log(" CONSISTENCY TEST: 3x Coaching (light) & 3x Direct critique (hard)");
  console.log("==============================================================");

  const results = [];

  // Run 3 times in Coaching (light)
  for (let i = 1; i <= 3; i++) {
    const res = await runSingleEvaluation("light", i);
    results.push(res);
    await new Promise((r) => setTimeout(r, 2000));
  }

  // Run 3 times in Direct critique (hard)
  for (let i = 1; i <= 3; i++) {
    const res = await runSingleEvaluation("hard", i);
    results.push(res);
    if (i < 3) await new Promise((r) => setTimeout(r, 2000));
  }

  console.log("\n==============================================================");
  console.log(" RAW JSON SUMMARY:");
  console.log(JSON.stringify(results, null, 2));
}

main();
