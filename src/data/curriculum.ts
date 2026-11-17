import type { Topic } from '../types/index.ts';

export const STARTER_CURRICULUM: Topic[] = [
  // ================= STAGE A: DAYS 1 - 10 (Foundation & Self-Expression) =================
  {
    id: 'topic-day-1',
    dayNumber: 1,
    stage: 'stage-a',
    stageTitle: 'Stage A: Foundation & Self-Expression',
    title: 'Introducing Yourself Beyond Your Name',
    objective: 'Establish a credible, human, and professional self-introduction that highlights your domain focus and current pursuit rather than just titles.',
    difficulty: 'Comfort',
    cognitiveMode: 'Expressive',
    categoryTag: 'Personal',
    suggestedCompletionMinutes: 8,
    context: 'Meeting new peers, starting a team onboarding session, or introducing yourself at an industry meetup.',
    instructions: 'Deliver a 3 to 4 sentence introduction (speak or write) that introduces who you are, what problems you care about solving, and what you are building or learning right now.',
    guidelines: {
      type: 'GAIN',
      title: 'The G.A.I.N. Self-Introduction Framework',
      objective: 'Frame who you are with clarity and immediate relevance.',
      whyItMatters: 'Most introductions get lost in lists of job titles or generic pleasantries. Highlighting what you care about gives people a memorable hook.',
      steps: [
        { label: 'G - Greet', instruction: 'Warm, natural opening without excessive fanfare.', example: '"Hi everyone, good morning."' },
        { label: 'A - Acknowledge', instruction: 'State who you are and your functional domain.', example: '"I’m Sarah, a product designer focused on accessible tooling."' },
        { label: 'I - Insight', instruction: 'Share what you are actively solving or excited about.', example: '"Recently, I’ve been researching how non-technical founders design their first workflows."' },
        { label: 'N - Navigate', instruction: 'Close with an open invitation to connect.', example: '"I’m excited to learn from this group’s operational experiences today."' }
      ],
      illustrativeExample: 'Hello team. I’m Alex, an engineer working on backend infrastructure. Over the past year, I’ve been streamlining API latency and reliability. I’m looking forward to collaborating with everyone on the upcoming release.',
      commonMistakeToAvoid: 'Listing 5 past companies or giving your entire resume instead of focusing on what is relevant today.'
    },
    extensionQuestion: 'If you had only 15 seconds in an elevator with a mentor you admire, what one sentence would define your core craft?',
    suggestedDrill: {
      targetSkill: 'Single-Sentence Impact',
      reason: 'Long-winded introductions dilute your primary message.',
      instruction: 'Distill your entire introduction into exactly one compound sentence (under 28 words).',
      completionCriteria: 'Clear domain identity, active problem focus, no filler words.',
      placeholder: 'I am a [role] dedicated to [specific problem], currently building [current project]...'
    }
  },
  {
    id: 'topic-day-2',
    dayNumber: 2,
    stage: 'stage-a',
    stageTitle: 'Stage A: Foundation & Self-Expression',
    title: 'Describing a Meaningful Habit',
    objective: "Articulate the mechanical 'why' behind a daily routine and illustrate its compounding effect on your clarity or performance.",
    difficulty: 'Comfort',
    cognitiveMode: 'Reflective',
    categoryTag: 'Personal',
    suggestedCompletionMinutes: 10,
    context: 'Conversations with peers, team 1-on-1s, or personal discipline documentation.',
    instructions: 'Choose one habit you practice daily or weekly. Explain what it is, the friction you overcame to maintain it, and the concrete difference it makes in your work or mental clarity.',
    guidelines: {
      type: 'STANDARD',
      title: 'Context → Action → Compounding Outcome',
      objective: 'Explain habits through behavioral evidence rather than vague motivation.',
      whyItMatters: 'Habits sound cliché unless anchored in specific operational routines and measurable peace of mind.',
      steps: [
        { label: 'Opener', instruction: 'Name the specific habit and when it occurs.', example: '"Every morning before opening Slack, I spend 20 minutes writing in a physical notebook."' },
        { label: 'Context', instruction: 'Explain the past problem this routine solved.', example: '"Earlier, I felt reactive, jumping straight into incoming messages."' },
        { label: 'Insight', instruction: 'Describe the tangible mental shift.', example: '"Writing by hand forces me to decide my top priority before other people request my time."' },
        { label: 'Closure', instruction: 'Summarise the personal takeaway.', example: '"It has taught me that mental calm is a deliberate system, not an accident."' }
      ],
      illustrativeExample: 'Every evening at 6 PM, I write a 3-bullet summary of what was resolved and what remains open. Before doing this, unfinished tasks lingered in my head through the evening. Taking five minutes to close out the day mentally frees my evenings and makes the next morning immediate.',
      commonMistakeToAvoid: 'Speaking broadly about "staying disciplined" without naming the concrete trigger and action.'
    },
    extensionQuestion: 'What triggers this habit, and how do you recover if you miss a single day?',
    suggestedDrill: {
      targetSkill: 'Cause-and-Effect Articulation',
      reason: 'Connect personal actions directly to observable outcomes.',
      instruction: 'Write two sentences: Sentence 1 describes the trigger; Sentence 2 describes the exact compound benefit.',
      completionCriteria: 'Must explicitly include the words "When" and "As a result".'
    }
  },
  {
    id: 'topic-day-3',
    dayNumber: 3,
    stage: 'stage-a',
    stageTitle: 'Stage A: Foundation & Self-Expression',
    title: 'Explaining a Personal Value',
    objective: 'Demonstrate how a core principle governs your decision-making when trade-offs arise.',
    difficulty: 'Comfort',
    cognitiveMode: 'Analytical',
    categoryTag: 'Personal',
    suggestedCompletionMinutes: 10,
    context: 'Leadership interviews, company culture discussions, or team alignment meetings.',
    instructions: 'Pick one guiding principle (e.g., radical clarity, resourcefulness over resources, intellectual honesty). Explain a real scenario where choosing this value cost you something or required genuine discipline.',
    guidelines: {
      type: 'GAIN',
      title: 'The Principle-in-Action Matrix',
      objective: 'Ground abstract philosophy in real decision trade-offs.',
      whyItMatters: 'Values that cost nothing are just slogans. A value is proven when you sacrifice speed or comfort to uphold it.',
      steps: [
        { label: 'G - Greet / Frame', instruction: 'State the guiding value simply.', example: '"For me, resourcefulness over resources is the anchor of how I build."' },
        { label: 'A - Acknowledge Trade-off', instruction: 'Acknowledge when this value was tested.', example: '"When our team had zero budget for external SaaS tools last quarter..."' },
        { label: 'I - Insight', instruction: 'Explain what action you took and why it aligned with the value.', example: '"Instead of stalling, we leveraged open-source scripts and built our own baseline prototype."' },
        { label: 'N - Navigate', instruction: 'Reflect on how this shapes your long-term confidence.', example: '"It reinforced that momentum depends on ingenuity, not external funding."' }
      ],
      illustrativeExample: 'One principle I live by is intellectual honesty. In a previous project, we were close to launch when I noticed our query architecture degraded under concurrent loads. Even though it delayed our target date by a week, I flagged the bottleneck immediately. Fixing it upfront protected our users and solidified trust across the team.',
      commonMistakeToAvoid: 'Choosing an empty buzzword without explaining the actual friction or trade-off involved.'
    },
    extensionQuestion: 'When has this value come into conflict with someone else’s differing priority?',
    suggestedDrill: {
      targetSkill: 'Trade-off Articulation',
      reason: 'Values are tested by what you willingly give up.',
      instruction: 'Formulate a sentence using the structure: "I chose [Action X] over [Action Y] because [Core Value]."',
      completionCriteria: 'Clear contrast between two viable paths with explicit reasoning.'
    }
  },
  {
    id: 'topic-day-4',
    dayNumber: 4,
    stage: 'stage-a',
    stageTitle: 'Stage A: Foundation & Self-Expression',
    title: 'Describing a Recent Experience',
    objective: 'Narrate a chronological sequence of events concisely while highlighting the single pivotal moment.',
    difficulty: 'Comfort',
    cognitiveMode: 'Expressive',
    categoryTag: 'Personal',
    suggestedCompletionMinutes: 10,
    context: 'Informal updates, standups, or networking storytelling.',
    instructions: 'Recall an event from the past fortnight (a challenge at work, a breakthrough, or an unexpected encounter). Narrate the setup, the twist or surprise, and your takeaway.',
    guidelines: {
      type: 'STANDARD',
      title: 'Narrative Arc: Situation → Turning Point → Realisation',
      objective: 'Keep narrative tight, avoiding irrelevant digressions.',
      whyItMatters: 'Listeners lose interest when speakers get trapped in unnecessary backstory.',
      steps: [
        { label: 'Opener', instruction: 'Establish the setting and your initial objective in one sentence.' },
        { label: 'Context', instruction: 'State the friction or surprising occurrence.' },
        { label: 'Insight', instruction: 'Identify the exact turning point where you adapted.' },
        { label: 'Closure', instruction: 'End on the durable takeaway.' }
      ],
      illustrativeExample: 'Last Tuesday, our payment gateway failed silently right during a live product demo. Instead of pretending it was a minor glitch, I paused screen-sharing, acknowledged the system error to the audience, and walked them through our backup API mock. The client praised our transparency and signed off on the test flight anyway.',
      commonMistakeToAvoid: 'Spending half the response describing the time of day, weather, or unimportant background details.'
    },
    suggestedDrill: {
      targetSkill: 'Pacing and Focus',
      reason: 'Eliminate narrative dragging.',
      instruction: 'Summarise the turning point in under 15 words.',
      completionCriteria: 'Direct action verb, zero filler adjectives.'
    }
  },
  {
    id: 'topic-day-5',
    dayNumber: 5,
    stage: 'stage-a',
    stageTitle: 'Stage A: Foundation & Self-Expression',
    title: 'Explaining a Decision',
    objective: 'Explain the rationale behind a deliberate choice, contrasting the path taken against the rejected alternative.',
    difficulty: 'Comfort',
    cognitiveMode: 'Analytical',
    categoryTag: 'Professional',
    suggestedCompletionMinutes: 10,
    context: 'Technical design reviews, product architecture decisions, or career changes.',
    instructions: 'Describe a significant decision you made recently. Clarify the alternatives available, why you selected your chosen route, and how you evaluate that choice now.',
    guidelines: {
      type: 'GAIN',
      title: 'Decision Logic Blueprint',
      objective: 'Justify choices through deliberate reasoning rather than chance.',
      whyItMatters: 'Decisions without clear criteria appear erratic to collaborators.',
      steps: [
        { label: 'G - Greet / Context', instruction: 'State the decision to be made.' },
        { label: 'A - Acknowledge Options', instruction: 'List the 2 primary paths considered.' },
        { label: 'I - Insight & Criterion', instruction: 'State the determining criterion.' },
        { label: 'N - Navigate Outcome', instruction: 'State what this decision unlocked.' }
      ],
      illustrativeExample: 'We had to decide between building a custom authentication service or integrating an established provider. While custom gave us total control, the provider allowed us to ship three weeks sooner and guaranteed security compliance. We chose the provider to preserve engineering focus on our core value proposition.',
      commonMistakeToAvoid: 'Failing to mention what the rejected alternative offered.'
    },
    suggestedDrill: {
      targetSkill: 'Comparative Framing',
      reason: 'Demonstrates objective critical thinking.',
      instruction: 'Write one sentence contrasting the primary advantage of Option A against Option B.',
      completionCriteria: 'Balanced comparison with an explicit weighing word (e.g., "While X offered..., Y provided...").'
    }
  },
  {
    id: 'topic-day-6',
    dayNumber: 6,
    stage: 'stage-a',
    stageTitle: 'Stage A: Foundation & Self-Expression',
    title: 'Describing a Personal Strength',
    objective: 'Express an authentic capability with humility and behavioral proof rather than boastful claims.',
    difficulty: 'Comfort',
    cognitiveMode: 'Reflective',
    categoryTag: 'Personal',
    suggestedCompletionMinutes: 8,
    context: 'Interviews, performance reviews, or mentoring conversations.',
    instructions: 'Identify one core strength (e.g., synthesizing complex topics, keeping calm in emergencies, systematic documentation). Back it up with a tangible example.',
    guidelines: {
      type: 'STANDARD',
      title: 'Capability + Evidence Pattern',
      objective: 'Let your results prove your capability.',
      whyItMatters: 'Stating "I am a great communicator" persuades no one. Showing how you clarified an ambiguous spec does.',
      steps: [
        { label: 'Opener', instruction: 'Name the specific skill plainly.' },
        { label: 'Context', instruction: 'Describe the typical situation where this skill shines.' },
        { label: 'Insight', instruction: 'Provide one concrete instance where it resolved a bottleneck.' },
        { label: 'Closure', instruction: 'Acknowledge how you continue sharpening it.' }
      ],
      illustrativeExample: 'My greatest strength is distilling dense technical requirements into clean documentation. During our database migration, teammates were confused by the schema changes. I authored a two-page visual guide with before-and-after examples that eliminated cross-team confusion.',
      commonMistakeToAvoid: 'Claiming perfection or presenting a generic list of adjectives.'
    },
    suggestedDrill: {
      targetSkill: 'Humility and Proof',
      reason: 'Avoid vanity or sounding defensive.',
      instruction: 'Express your strength without using any of these words: "expert", "best", "perfect", "genius", "natural".',
      completionCriteria: 'Clear competence supported by concrete actions.'
    }
  },
  {
    id: 'topic-day-7',
    dayNumber: 7,
    stage: 'stage-a',
    stageTitle: 'Stage A: Foundation & Self-Expression',
    title: 'Expressing a Preference with Reasons',
    objective: 'Defend a subjective opinion or workflow preference with logical, pragmatic arguments.',
    difficulty: 'Comfort',
    cognitiveMode: 'Analytical',
    categoryTag: 'Personal',
    suggestedCompletionMinutes: 8,
    context: 'Tool selection debates, working style agreements, or code review standards.',
    instructions: 'Choose a tool, working style, or methodology you prefer (e.g., asynchronous communication vs meetings, command line vs GUI). Explain two concrete reasons for your choice.',
    guidelines: {
      type: 'GAIN',
      title: 'Pragmatic Stance Framework',
      objective: 'Separate personal taste from functional utility.',
      whyItMatters: 'Preferences carry weight when backed by productivity or clarity outcomes.',
      steps: [
        { label: 'G - Greet / Subject', instruction: 'State the preference clearly.' },
        { label: 'A - Acknowledge Other Side', instruction: 'Show you understand why others prefer the alternative.' },
        { label: 'I - Insight (Reasons)', instruction: 'Give two practical reasons for your stance.' },
        { label: 'N - Navigate Summary', instruction: 'Reiterate the ultimate payoff.' }
      ],
      illustrativeExample: 'I strongly prefer asynchronous written documentation over exploratory meetings. While calls feel fast, written memos force the author to structure their thoughts and create a permanent, searchable record for distributed teammates across timezones.',
      commonMistakeToAvoid: 'Dismissing the opposing view as foolish or invalid.'
    },
    suggestedDrill: {
      targetSkill: 'Steel-manning',
      reason: 'Strengthens your argument by acknowledging the opposing view first.',
      instruction: 'Start your response with: "Although [Alternative] has the benefit of..., I prefer [Choice] because..."',
      completionCriteria: 'Fair acknowledgement of the opposing benefit followed by your specific rationale.'
    }
  },
  {
    id: 'topic-day-8',
    dayNumber: 8,
    stage: 'stage-a',
    stageTitle: 'Stage A: Foundation & Self-Expression',
    title: 'Explaining a Challenge',
    objective: 'Frame an ongoing difficulty constructively, focusing on the diagnostic breakdown rather than complaint.',
    difficulty: 'Comfort',
    cognitiveMode: 'Reflective',
    categoryTag: 'Personal',
    suggestedCompletionMinutes: 10,
    context: '1-on-1 check-ins with managers or accountability partner discussions.',
    instructions: 'Describe a hurdle you are currently facing (a complex concept, time constraints, or communication barrier). State the nature of the obstacle and your current hypothesis for overcoming it.',
    guidelines: {
      type: 'STANDARD',
      title: 'Problem Framing Architecture',
      objective: 'Shift from emotional frustration to systematic troubleshooting.',
      whyItMatters: 'People are eager to help when you articulate the root cause rather than just venting.',
      steps: [
        { label: 'Opener', instruction: 'Define the challenge objectively.' },
        { label: 'Context', instruction: 'What factors make it tricky or non-trivial?' },
        { label: 'Insight', instruction: 'What experiments or strategies have you tested so far?' },
        { label: 'Closure', instruction: 'What is the immediate next step or specific help needed?' }
      ],
      illustrativeExample: 'I am finding it challenging to balance feature delivery with automated test coverage. Because our scope expanded mid-sprint, testing felt squeezed. To resolve this, I have started writing the core test assertions first before tackling the feature logic.',
      commonMistakeToAvoid: 'Venting about external circumstances without demonstrating agency.'
    },
    suggestedDrill: {
      targetSkill: 'Constructive Problem Definition',
      reason: 'Prevents sounding helpless.',
      instruction: 'State the obstacle in one sentence, then state your next hypothesis in one sentence.',
      completionCriteria: 'Zero blame, 100% operational focus.'
    }
  },
  {
    id: 'topic-day-9',
    dayNumber: 9,
    stage: 'stage-a',
    stageTitle: 'Stage A: Foundation & Self-Expression',
    title: 'Describing Something You Learned',
    objective: 'Extract the durable lesson from a recent study or realization and make it digestible for someone else.',
    difficulty: 'Comfort',
    cognitiveMode: 'Expressive',
    categoryTag: 'Personal',
    suggestedCompletionMinutes: 10,
    context: 'Team knowledge sharing, tech talks, or public learning logs.',
    instructions: 'Share an insight you uncovered recently. Explain what your previous assumption was, what new information changed your mind, and how you will apply it.',
    guidelines: {
      type: 'GAIN',
      title: 'The Shift in Perspective Method',
      objective: 'Teach an insight through contrast between before and after.',
      whyItMatters: 'The best way to show true mastery of an idea is to explain the exact misconception it cleared up.',
      steps: [
        { label: 'G - Greet / Hook', instruction: 'Introduce the core topic.' },
        { label: 'A - Acknowledge Old Assumption', instruction: 'What did you used to believe?' },
        { label: 'I - Insight of Discovery', instruction: 'What was the breakthrough or correct principle?' },
        { label: 'N - Navigate Application', instruction: 'How will you use this going forward?' }
      ],
      illustrativeExample: 'I recently learned how SQLite transactions operate in WAL mode. I used to assume SQLite was only for tiny toy projects. Discovering that WAL mode allows concurrent readers alongside a writer completely changed my view - it is now my primary database choice for rapid prototypes.',
      commonMistakeToAvoid: 'Quoting definitions without explaining your personal understanding.'
    },
    suggestedDrill: {
      targetSkill: 'Before vs After Contrast',
      reason: 'Highlights the cognitive shift.',
      instruction: 'Use the phrase: "I used to think that..., but now I realize..."',
      completionCriteria: 'Clear contrast in mental model.'
    }
  },
  {
    id: 'topic-day-10',
    dayNumber: 10,
    stage: 'stage-a',
    stageTitle: 'Stage A: Foundation & Self-Expression',
    title: 'Summarising Your Current Priorities',
    objective: 'Distill multiple commitments into a crisp, prioritized 3-point briefing.',
    difficulty: 'Comfort',
    cognitiveMode: 'Analytical',
    categoryTag: 'Personal',
    suggestedCompletionMinutes: 8,
    context: 'Weekly kickoff meetings, executive check-ins, or founder journal.',
    instructions: 'Outline your top three focal points for the coming week. Explain which one is non-negotiable and why.',
    guidelines: {
      type: 'STANDARD',
      title: 'Ranked Priority Briefing',
      objective: 'Demonstrate disciplined focus by clarifying what comes first.',
      whyItMatters: 'When everything is priority number one, nothing gets completed.',
      steps: [
        { label: 'Opener', instruction: 'Give the overarching weekly objective.' },
        { label: 'Context', instruction: 'List the 3 focused items in descending importance.' },
        { label: 'Insight', instruction: 'Identify the single blocker or prerequisite for item 1.' },
        { label: 'Closure', instruction: 'Confirm the criteria for a successful week.' }
      ],
      illustrativeExample: 'My focus this week is threefold: first, shipping the onboarding revision; second, completing user feedback interviews; and third, updating the technical documentation. The onboarding revision is non-negotiable because our beta testers arrive on Friday.',
      commonMistakeToAvoid: 'Listing ten tasks without ranking or clarifying what takes precedence.'
    },
    suggestedDrill: {
      targetSkill: 'Priority Ranking',
      reason: 'Prevents scope creep in communication.',
      instruction: 'Formulate your three priorities using exactly 40 words or less.',
      completionCriteria: 'Contains numbers 1, 2, and 3 with clear nouns.'
    }
  },

  // ================= STAGE B: DAYS 11 - 20 (Observation & Interpersonal) =================
  {
    id: 'topic-day-11',
    dayNumber: 11,
    stage: 'stage-b',
    stageTitle: 'Stage B: Observation & Interpersonal Communication',
    title: 'Describing a Meaningful Observation',
    objective: 'Report on an observed human interaction or work pattern without inserting premature judgment or biases.',
    difficulty: 'Challenge',
    cognitiveMode: 'Reflective',
    categoryTag: 'Interpersonal',
    suggestedCompletionMinutes: 10,
    context: 'Post-mortems, user research synthesis, or organizational reflections.',
    instructions: 'Describe something you noticed recently in a team, product, or conversation. Distinguish factual observations from your interpretations.',
    guidelines: {
      type: 'STANDARD',
      title: 'Observation vs Inference Split',
      objective: 'Practice objective reporting before jumping to conclusions.',
      whyItMatters: 'Conflating facts with assumptions leads to defensive reactions and flawed analysis.',
      steps: [
        { label: 'Opener', instruction: 'Set the observed scene without emotional adjectives.' },
        { label: 'Context', instruction: 'Detail the concrete events or words that took place.' },
        { label: 'Insight', instruction: 'Offer your analytical interpretation as a testable hypothesis.' },
        { label: 'Closure', instruction: 'Suggest a healthy question or takeaway from the observation.' }
      ],
      illustrativeExample: 'During yesterday’s planning session, our team spent 40 minutes discussing button colors, but only 5 minutes reviewing database schemas. I observed that people naturally gravitate toward visual debates because they are easy to visualize, whereas technical architecture requires deep mental parsing.',
      commonMistakeToAvoid: 'Saying "the team was careless" instead of noting the exact time allocation.'
    },
    suggestedDrill: {
      targetSkill: 'Fact-Interpretation Separation',
      reason: 'Builds analytical rigor.',
      instruction: 'Write Sentence 1 as pure camera footage (facts only); Write Sentence 2 as your interpretation.',
      completionCriteria: 'Zero judgment in Sentence 1; clear deductive reasoning in Sentence 2.'
    }
  },
  {
    id: 'topic-day-12',
    dayNumber: 12,
    stage: 'stage-b',
    stageTitle: 'Stage B: Observation & Interpersonal Communication',
    title: 'Expressing Gratitude with Specific Reasons',
    objective: 'Thank a colleague, mentor, or contributor by highlighting the exact action they took and its ripple effect.',
    difficulty: 'Challenge',
    cognitiveMode: 'Expressive',
    categoryTag: 'Interpersonal',
    suggestedCompletionMinutes: 8,
    context: 'Team shout-outs, private thank-you notes, or mentor check-ins.',
    instructions: 'Acknowledge someone who helped you recently. Avoid generic praise like "thanks for being awesome" - point to the specific behavior and how it relieved pressure or unlocked progress for you.',
    guidelines: {
      type: 'GAIN',
      title: 'The Specific Gratitude Formula',
      objective: 'Make appreciation authentic, memorable, and motivating.',
      whyItMatters: 'Generic compliments feel transactional. Specific praise reinforces great collaboration.',
      steps: [
        { label: 'G - Greet', instruction: 'Address the individual warmly and directly.' },
        { label: 'A - Acknowledge Effort', instruction: 'Cite the exact action, document, or assistance provided.' },
        { label: 'I - Insight / Impact', instruction: 'Explain the direct positive consequence on your work.' },
        { label: 'N - Navigate Warmly', instruction: 'Reaffirm mutual trust or offer reciprocal support.' }
      ],
      illustrativeExample: 'Hi Priya, I wanted to thank you for stepping in to review my pull request yesterday evening. Your suggestion to index the query table cut our execution time in half and allowed us to hit our release window without stress.',
      commonMistakeToAvoid: 'Using generic compliments without specifying the exact contribution.'
    },
    suggestedDrill: {
      targetSkill: 'High-Fidelity Appreciation',
      reason: 'Deepens professional bonds.',
      instruction: 'Write a 3-sentence thank-you note that specifies the time, the exact deed, and the measurable relief.',
      completionCriteria: 'Zero empty fluff phrases (e.g. "you are rockstar").'
    }
  },
  {
    id: 'topic-day-13',
    dayNumber: 13,
    stage: 'stage-b',
    stageTitle: 'Stage B: Observation & Interpersonal Communication',
    title: 'Explaining a Mistake and What Changed',
    objective: 'Take accountability for an error with complete ownership, zero excuses, and a clear prevention safeguard.',
    difficulty: 'Challenge',
    cognitiveMode: 'Reflective',
    categoryTag: 'Professional',
    suggestedCompletionMinutes: 12,
    context: 'Incident post-mortems, stakeholder explanations, or performance reviews.',
    instructions: 'Describe an error you made. Own the failure directly, explain the root gap in process or thinking, and present the systemic fix you implemented.',
    guidelines: {
      type: 'STANDARD',
      title: 'Ownership → Root Cause → Systemic Safeguard',
      objective: 'Convert a mistake into a trust-building milestone.',
      whyItMatters: 'Leaders respect professionals who take radical responsibility and build guardrails against repeat failures.',
      steps: [
        { label: 'Opener', instruction: 'State the error directly without hedging or dodging.' },
        { label: 'Context', instruction: 'Explain what went wrong in your process without blaming others.' },
        { label: 'Insight', instruction: 'What was the underlying blind spot?' },
        { label: 'Closure', instruction: 'Detail the concrete checklist or test added to prevent recurrence.' }
      ],
      illustrativeExample: 'In our release on Monday, I deployed a database migration script without taking a staging snapshot first. As a result, the deployment was delayed by an hour. The root issue was rushing through manual terminal commands. I have now written an automated pre-flight script that halts deployments if a snapshot is missing.',
      commonMistakeToAvoid: 'Blaming colleagues, bad luck, or unexpected interruptions.'
    },
    suggestedDrill: {
      targetSkill: 'Radical Ownership Phrasing',
      reason: 'Builds unshakeable credibility.',
      instruction: 'Start your sentence with "The responsibility was entirely mine: [Explain error]..."',
      completionCriteria: 'No passive voice ("mistakes were made"); direct active voice.'
    }
  },
  {
    id: 'topic-day-14',
    dayNumber: 14,
    stage: 'stage-b',
    stageTitle: 'Stage B: Observation & Interpersonal Communication',
    title: 'Responding to Constructive Feedback',
    objective: 'Acknowledge critical input gracefully, validate the observer’s perspective, and articulate your actionable adjustment.',
    difficulty: 'Challenge',
    cognitiveMode: 'Analytical',
    categoryTag: 'Interpersonal',
    suggestedCompletionMinutes: 10,
    context: 'Performance discussions, design critiques, or code review comments.',
    instructions: 'Recall a piece of challenging feedback you received. Deliver a response (speak or write) that shows you listened deeply, understood their intent, and established your follow-up action.',
    guidelines: {
      type: 'GAIN',
      title: 'Receptive Feedback Response Arc',
      objective: 'Eliminate defensive impulse and show intellectual maturity.',
      whyItMatters: 'How you handle criticism dictates how quickly you grow and how safely others can guide you.',
      steps: [
        { label: 'G - Greet / Thank', instruction: 'Acknowledge the feedback and the courage/time it took to share.' },
        { label: 'A - Acknowledge Essence', instruction: 'Paraphrase their point in your own words to prove comprehension.' },
        { label: 'I - Insight', instruction: 'Share what you recognize now that you had missed.' },
        { label: 'N - Navigate Next Steps', instruction: 'State the adjustment you are adopting.' }
      ],
      illustrativeExample: 'Thank you for calling that out, David. You are right that my slides assumed everyone was already familiar with the technical terminology. Looking back, that alienated non-technical stakeholders. In the next deck, I will include a brief glossary slide and lead with business outcomes first.',
      commonMistakeToAvoid: 'Defending yourself with "Yes, but..." or offering rationalizations.'
    },
    suggestedDrill: {
      targetSkill: 'Defensiveness Elimination',
      reason: 'Replaces defensiveness with alignment.',
      instruction: 'Rewrite a defensive sentence into a clarifying paraphrase starting with: "What I hear you saying is..."',
      completionCriteria: 'Accurate paraphrase followed by a commitment to adjust.'
    }
  },
  {
    id: 'topic-day-15',
    dayNumber: 15,
    stage: 'stage-b',
    stageTitle: 'Stage B: Observation & Interpersonal Communication',
    title: 'Disagreeing Respectfully',
    objective: 'Challenge a prevailing consensus or proposal by dissecting assumptions with evidence while validating team goodwill.',
    difficulty: 'Challenge',
    cognitiveMode: 'Analytical',
    categoryTag: 'Professional',
    suggestedCompletionMinutes: 12,
    context: 'Architecture discussions, strategy meetings, or roadmapping debates.',
    instructions: 'Express disagreement with a proposed feature, timeline, or decision. Emphasize shared goals while identifying the specific operational risk you foresee.',
    guidelines: {
      type: 'GAIN',
      title: 'Principled Dissent Framework',
      objective: 'Challenge the hypothesis without attacking the person.',
      whyItMatters: 'Healthy teams thrive when dissent is clear, constructive, and respectful.',
      steps: [
        { label: 'G - Greet / Reaffirm Goal', instruction: 'Anchor to the common objective you both share.' },
        { label: 'A - Acknowledge Their Logic', instruction: 'Demonstrate why their proposed route is understandable.' },
        { label: 'I - Insight (The Divergence)', instruction: 'Introduce the data or risk that suggests an alternative.' },
        { label: 'N - Navigate Collaboration', instruction: 'Propose a quick test or joint review.' }
      ],
      illustrativeExample: 'I completely share your goal of launching before the end of the quarter. However, skipping integration testing on the billing pipeline introduces a high risk of transaction drops for our first users. Could we instead trim the secondary reporting dashboard so we protect the launch date while keeping transactions bulletproof?',
      commonMistakeToAvoid: 'Using confrontational language like "That will never work" or "That is a bad idea".'
    },
    suggestedDrill: {
      targetSkill: 'Collaborative Dissent',
      reason: 'Prevents adversarial debates.',
      instruction: 'Use the framework: "I agree with our goal of [Shared Goal], but I am concerned that [Specific Risk] might occur because [Evidence]."',
      completionCriteria: 'Clear risk articulation anchored in shared success.'
    }
  },
  {
    id: 'topic-day-16',
    dayNumber: 16,
    stage: 'stage-b',
    stageTitle: 'Stage B: Observation & Interpersonal Communication',
    title: 'Asking a Useful Follow-Up Question',
    objective: 'Formulate an incisive inquiry that pierces through ambiguity and guides the speaker toward actionable clarity.',
    difficulty: 'Challenge',
    cognitiveMode: 'Analytical',
    categoryTag: 'Interpersonal',
    suggestedCompletionMinutes: 8,
    context: 'Client discovery calls, team briefings, or requirement gathering.',
    instructions: 'You are presented with a vague directive (e.g., "Make the onboarding smoother"). Formulate a thoughtful response and two pointed follow-up questions that pinpoint the exact constraint.',
    guidelines: {
      type: 'STANDARD',
      title: 'Contextual Probe Method',
      objective: 'Ask questions that unlock specifics without sounding interrogation-like.',
      whyItMatters: 'Vague instructions lead to wasted engineering cycles. Sharp questions reveal actual criteria.',
      steps: [
        { label: 'Opener', instruction: 'Affirm the broader intent.' },
        { label: 'Context', instruction: 'Highlight where ambiguity creates competing interpretations.' },
        { label: 'Insight (Questions)', instruction: 'Pose two open-ended questions targeting metrics or user journey.' },
        { label: 'Closure', instruction: 'State what knowing these answers will allow you to deliver.' }
      ],
      illustrativeExample: 'I agree that improving onboarding retention is crucial. To ensure our design targets the biggest friction point: where in the current funnel are users dropping off most frequently, and what single behavior defines an activated user for this milestone?',
      commonMistakeToAvoid: 'Asking closed yes/no questions that fail to uncover underlying context.'
    },
    suggestedDrill: {
      targetSkill: 'Incisive Inquiry',
      reason: 'Turns confusion into clear deliverables.',
      instruction: 'Formulate two consecutive questions starting with "What specific..." and "How will we measure..."',
      completionCriteria: 'Both questions must elicit measurable criteria.'
    }
  },
  {
    id: 'topic-day-17',
    dayNumber: 17,
    stage: 'stage-b',
    stageTitle: 'Stage B: Observation & Interpersonal Communication',
    title: 'Explaining a Problem to Another Person',
    objective: 'Communicate an operational or emotional roadblock so clearly that the other person can understand without guessing.',
    difficulty: 'Challenge',
    cognitiveMode: 'Expressive',
    categoryTag: 'Interpersonal',
    suggestedCompletionMinutes: 10,
    context: 'Cross-functional bug reports, team escalation, or collaboration syncs.',
    instructions: 'Explain an issue you encountered to someone from a different background (e.g., explaining a technical glitch to customer support, or explaining design constraints to an engineer).',
    guidelines: {
      type: 'GAIN',
      title: 'The Cross-Domain Translation Method',
      objective: 'Remove jargon and focus on user impact and operational symptoms.',
      whyItMatters: 'Jargon alienates collaborators and causes misaligned urgency.',
      steps: [
        { label: 'G - Greet & Context', instruction: 'Frame the feature or workflow affected.' },
        { label: 'A - Acknowledge What Happens', instruction: 'Describe the symptom in plain everyday language.' },
        { label: 'I - Insight (Why It Matters)', instruction: 'Clarify how this hurts the user or the team right now.' },
        { label: 'N - Navigate Next Step', instruction: 'Suggest what immediate action or temporary workaround exists.' }
      ],
      illustrativeExample: 'Hi Marcus, when customers click the checkout button on mobile browsers, the screen hangs for 6 seconds without a loading spinner. Many assume the page is broken and tap repeatedly, triggering duplicate payment requests. We need to disable the button on first tap and show a spinner while the payment clears.',
      commonMistakeToAvoid: 'Dumping technical stack traces without explaining what the human user experiences.'
    },
    suggestedDrill: {
      targetSkill: 'Jargon Elimination',
      reason: 'Ensures universal clarity.',
      instruction: 'Explain a technical issue without using any acronyms or programming keywords.',
      completionCriteria: 'Plain language that an 8th grader could easily comprehend.'
    }
  },
  {
    id: 'topic-day-18',
    dayNumber: 18,
    stage: 'stage-b',
    stageTitle: 'Stage B: Observation & Interpersonal Communication',
    title: 'Describing a Difficult Conversation',
    objective: 'Reflect on a high-stakes conversation, evaluating how emotion influenced clarity and where composure held.',
    difficulty: 'Challenge',
    cognitiveMode: 'Reflective',
    categoryTag: 'Interpersonal',
    suggestedCompletionMinutes: 12,
    context: 'Founder debriefs, team dynamics review, or personal journaling.',
    instructions: 'Recall a conversation where tension or stakes were elevated. Analyze how the interaction began, what emotional undertones were present, and how you managed to keep dialogue productive.',
    guidelines: {
      type: 'STANDARD',
      title: 'Tension Deconstruction Method',
      objective: 'Examine communication dynamics under stress.',
      whyItMatters: 'Mastery of conversation comes from studying how pressure warps our word choice.',
      steps: [
        { label: 'Opener', instruction: 'State the premise and what made the stakes high.' },
        { label: 'Context', instruction: 'Describe the moment tension escalated.' },
        { label: 'Insight', instruction: 'What deliberate adjustment did you make to prevent escalation?' },
        { label: 'Closure', instruction: 'What did this teach you about emotional regulation?' }
      ],
      illustrativeExample: 'Last month, I had to inform a freelance partner that their code quality did not meet our production benchmark. It was uncomfortable because we have a friendly rapport. I focused strictly on the automated test suite results rather than subjective critique, which kept the conversation professional and focused on solution steps.',
      commonMistakeToAvoid: 'Demonizing the other party or painting yourself as entirely blameless.'
    },
    suggestedDrill: {
      targetSkill: 'Emotional Decoupling',
      reason: 'Keeps focus on substance over personal friction.',
      instruction: 'Summarise the core point of tension in one calm sentence without emotional adjectives.',
      completionCriteria: 'Objective statement of diverging expectations.'
    }
  },
  {
    id: 'topic-day-19',
    dayNumber: 19,
    stage: 'stage-b',
    stageTitle: 'Stage B: Observation & Interpersonal Communication',
    title: 'Giving a Clear Explanation to a Beginner',
    objective: 'Translate a complex concept into an intuitive explanation using a simple, relatable real-world analogy.',
    difficulty: 'Challenge',
    cognitiveMode: 'Expressive',
    categoryTag: 'Interpersonal',
    suggestedCompletionMinutes: 10,
    context: 'Mentoring juniors, writing documentation, or customer onboarding.',
    instructions: 'Choose a concept you know well (e.g., APIs, compound interest, version control, or modular design). Teach it to someone who has never heard of it before.',
    guidelines: {
      type: 'GAIN',
      title: 'The Analogy Scaffolding Formula',
      objective: 'Build understanding on top of existing familiar concepts.',
      whyItMatters: 'True expertise is evidenced by the ability to explain complex ideas simply.',
      steps: [
        { label: 'G - Greet / Subject', instruction: 'Introduce the concept without intimidating words.' },
        { label: 'A - Acknowledge Familiar World', instruction: 'Anchor to a familiar everyday object or routine.' },
        { label: 'I - Insight (The Analogy Bridge)', instruction: 'Map the parts of your subject to parts of the analogy.' },
        { label: 'N - Navigate Takeaway', instruction: 'State why understanding this empowers the learner.' }
      ],
      illustrativeExample: 'Think of an API like a waiter in a restaurant. You are at the table looking at the menu. The kitchen has the ingredients and prepares the meal. You do not go into the kitchen yourself; you give your order to the waiter, who takes it to the kitchen and brings back your food. An API does the exact same thing between your phone app and a server.',
      commonMistakeToAvoid: 'Using an analogy that is more complicated than the concept itself.'
    },
    suggestedDrill: {
      targetSkill: 'Analogy Precision',
      reason: 'Reinforces intuitive teaching.',
      instruction: 'Complete the sentence: "[Concept] is essentially like [Familiar Thing] because both [Shared Mechanism]."',
      completionCriteria: 'Clear 1:1 mapping between concept and metaphor.'
    }
  },
  {
    id: 'topic-day-20',
    dayNumber: 20,
    stage: 'stage-b',
    stageTitle: 'Stage B: Observation & Interpersonal Communication',
    title: 'Summarising Another Person’s Point Fairly',
    objective: 'Capture an opposing or complex viewpoint so accurately that the original speaker would say, "Yes, that is exactly what I mean."',
    difficulty: 'Challenge',
    cognitiveMode: 'Analytical',
    categoryTag: 'Interpersonal',
    suggestedCompletionMinutes: 10,
    context: 'Mediation, debate synthesis, or cross-functional alignment.',
    instructions: 'Pick an argument you personally disagree with. Summarize the logic and good-faith motivation behind it without mockery or straw-manning.',
    guidelines: {
      type: 'STANDARD',
      title: 'The Steel-Man Synthesis Protocol',
      objective: 'Listen deeply enough to understand an idea from the inside.',
      whyItMatters: 'You cannot influence someone whose position you have not accurately understood.',
      steps: [
        { label: 'Opener', instruction: 'Name the position without sarcasm.' },
        { label: 'Context', instruction: 'Explain the core concern or priority driving that view.' },
        { label: 'Insight', instruction: 'Present their strongest piece of supporting evidence.' },
        { label: 'Closure', instruction: 'Confirm the shared concern that unites both perspectives.' }
      ],
      illustrativeExample: 'Advocates of strict in-office attendance argue that impromptu conversations and spontaneous hallway problem-solving accelerate trust and creative sparks that scheduled Zoom calls cannot duplicate. They believe that physical proximity protects company culture, especially for junior hires onboarding for the first time.',
      commonMistakeToAvoid: 'Sneaking in dismissive phrases like "they mistakenly think" or "their naive claim".'
    },
    suggestedDrill: {
      targetSkill: 'Unbiased Representation',
      reason: 'Eliminates confirmation bias in discourse.',
      instruction: 'Summarise an opposing view in 30 words without using the words "wrong", "flawed", or "unrealistic".',
      completionCriteria: 'Fair, respectful, and logically coherent representation.'
    }
  },

  // ================= STAGE C: DAYS 21 - 30 (Professional & Influence) =================
  {
    id: 'topic-day-21',
    dayNumber: 21,
    stage: 'stage-c',
    stageTitle: 'Stage C: Professional Expression & Influence',
    title: 'Explaining What Makes a Leader Effective',
    objective: 'Define leadership through observable behavioral patterns and cultural architecture rather than charismatic flair.',
    difficulty: 'Command',
    cognitiveMode: 'Reflective',
    categoryTag: 'Leadership',
    suggestedCompletionMinutes: 12,
    context: 'Leadership interviews, company all-hands, or mentorship essays.',
    instructions: 'Articulate your philosophy of effective leadership. Focus on what a genuine leader does during crises and how they cultivate psychological safety and high performance.',
    guidelines: {
      type: 'GAIN',
      title: 'The Leadership Architecture Model',
      objective: 'Ground leadership in tangible operational actions.',
      whyItMatters: 'Leadership is often described in fluffy platitudes. True leadership is demonstrated in systems and clarity.',
      steps: [
        { label: 'G - Greet / Thesis', instruction: 'State your definition of leadership.' },
        { label: 'A - Acknowledge Pressures', instruction: 'What forces test a leader’s resolve?' },
        { label: 'I - Insight', instruction: 'Describe the core discipline or habit that distinguishes great leaders.' },
        { label: 'N - Navigate Culture', instruction: 'How does this compound across an entire team?' }
      ],
      illustrativeExample: 'Effective leadership is not about having all the answers; it is about creating structural clarity so others can do their best work without fear. A true leader absorbs uncertainty during crises, clarifies priorities, and gives total credit to the team when milestones are reached.',
      commonMistakeToAvoid: 'Equating leadership with status, charisma, or command-and-control power.'
    },
    suggestedDrill: {
      targetSkill: 'High-Impact Thesis Statement',
      reason: 'Sets the intellectual tone of your argument.',
      instruction: 'Define leadership in one sentence starting with: "True leadership is demonstrated when..."',
      completionCriteria: 'Clear focus on impact on others rather than personal authority.'
    }
  },
  {
    id: 'topic-day-22',
    dayNumber: 22,
    stage: 'stage-c',
    stageTitle: 'Stage C: Professional Expression & Influence',
    title: 'Communicating a Work-Related Problem',
    objective: 'Escalate an operational issue with clarity: state the problem, the business impact, and two viable solutions.',
    difficulty: 'Command',
    cognitiveMode: 'Analytical',
    categoryTag: 'Professional',
    suggestedCompletionMinutes: 10,
    context: 'Manager escalation, incident alerting, or stakeholder alerts.',
    instructions: 'Draft an urgent but calm message alerting a lead or manager to an operational problem. Never bring a problem without proposing pathways forward.',
    guidelines: {
      type: 'STANDARD',
      title: 'Situation → Impact → Proposed Options',
      objective: 'Escalate like an owner rather than a bystander.',
      whyItMatters: 'Executives appreciate escalations that minimize cognitive load and provide actionable choices.',
      steps: [
        { label: 'Opener', instruction: 'Clear, calm headline of the current state.' },
        { label: 'Context', instruction: 'Quantified impact on users, deadline, or budget.' },
        { label: 'Insight (Options)', instruction: 'Option A (faster) vs Option B (more thorough).' },
        { label: 'Closure', instruction: 'Your explicit recommendation and request for confirmation.' }
      ],
      illustrativeExample: 'Heads up: our cloud hosting bill exceeded projected costs by 35% this week due to unindexed search queries. To address this, Option A is to immediately enable cache headers, which will drop traffic load by 40% within 2 hours. Option B is to rewrite the search endpoint, which will take 2 days but permanently solve indexing. I recommend we deploy Option A today, then schedule Option B for next sprint.',
      commonMistakeToAvoid: 'Panicking or asking "What should we do?" without proposing options.'
    },
    suggestedDrill: {
      targetSkill: 'Solution-Oriented Escalation',
      reason: 'Separates reactive complainers from strategic problem solvers.',
      instruction: 'Structure a problem alert using exactly 3 bullet points: 1. Observation, 2. Financial/Time Impact, 3. Proposed Fix.',
      completionCriteria: 'Objective numbers and immediate next step.'
    }
  },
  {
    id: 'topic-day-23',
    dayNumber: 23,
    stage: 'stage-c',
    stageTitle: 'Stage C: Professional Expression & Influence',
    title: 'Giving a Concise Project Update',
    objective: 'Provide a structured, executive-level progress update using the 3Ps: Progress, Problems, Plans.',
    difficulty: 'Command',
    cognitiveMode: 'Analytical',
    categoryTag: 'Professional',
    suggestedCompletionMinutes: 8,
    context: 'Weekly status reports, board updates, or client standups.',
    instructions: 'Deliver a 60-second status update (speak or write) on a project you are handling. Focus strictly on completed milestones, active blockers, and the next deliverable date.',
    guidelines: {
      type: 'GAIN',
      title: 'The 3P Executive Update Format',
      objective: 'Eliminate fluff and highlight business momentum.',
      whyItMatters: 'Leadership scans updates in 10 seconds; your structure must surface the bottom line immediately.',
      steps: [
        { label: 'G - Greet & Milestone', instruction: 'One line confirming the current milestone.' },
        { label: 'A - Acknowledge Completed', instruction: 'Top 2 items shipped this sprint.' },
        { label: 'I - Insight on Blockers', instruction: 'Single bottleneck and who owns the fix.' },
        { label: 'N - Navigate Next Delivery', instruction: 'Target date and deliverables for next review.' }
      ],
      illustrativeExample: 'Weekly Update - Authentication Sprint: We are on track for beta launch on Oct 30. Completed: Google and Magic Link auth integration tested; user profile database migrations complete. Blocker: Waiting on Apple Developer account verification (tracked with IT). Next Plan: Complete security audit by Wednesday.',
      commonMistakeToAvoid: 'Writing a daily diary of tasks instead of high-level milestone achievements.'
    },
    suggestedDrill: {
      targetSkill: '3P Compression',
      reason: 'Respects busy executive bandwidth.',
      instruction: 'Fit Progress, Problem, and Plan into under 45 total words.',
      completionCriteria: 'Clear labels: Progress, Blocker, Next Step.'
    }
  },
  {
    id: 'topic-day-24',
    dayNumber: 24,
    stage: 'stage-c',
    stageTitle: 'Stage C: Professional Expression & Influence',
    title: 'Making a Recommendation with Reasons',
    objective: 'Convince stakeholders to adopt a specific tool, workflow, or architectural change by leading with the return on investment.',
    difficulty: 'Command',
    cognitiveMode: 'Analytical',
    categoryTag: 'Professional',
    suggestedCompletionMinutes: 10,
    context: 'Proposal memos, budget requests, or process improvement pitches.',
    instructions: 'Recommend a specific change in your workplace or workflow. State the proposed action upfront, followed by three concise, evidence-backed arguments.',
    guidelines: {
      type: 'STANDARD',
      title: 'The BLUF (Bottom Line Up Front) Memo',
      objective: 'State your conclusion first, then deliver supporting pillars.',
      whyItMatters: 'Burying your recommendation at the end exhausts busy decision-makers.',
      steps: [
        { label: 'Opener (BLUF)', instruction: 'Direct statement of what action to approve.' },
        { label: 'Context', instruction: 'The inefficiency or cost of continuing status quo.' },
        { label: 'Insight (Evidence)', instruction: 'Three bulleted reasons highlighting ROI, speed, or quality.' },
        { label: 'Closure', instruction: 'The minimal risk trial or pilot period requested.' }
      ],
      illustrativeExample: 'I recommend we transition our internal documentation from Google Docs to a unified Notion workspace starting next month. Currently, knowledge is fragmented across 12 different folders, costing new hires an estimated 4 hours a week just searching for specs. Notion gives us unified search, permission controls, and nested templates. I propose a two-week pilot with the design team before company rollout.',
      commonMistakeToAvoid: 'Writing a long narrative before telling people what you are asking them to approve.'
    },
    suggestedDrill: {
      targetSkill: 'Bottom Line Up Front',
      reason: 'Sharpens business persuasion.',
      instruction: 'Write the opening sentence so that if the reader stopped there, they would know the exact proposal and cost.',
      completionCriteria: 'Action verb + specific target + timeline.'
    }
  },
  {
    id: 'topic-day-25',
    dayNumber: 25,
    stage: 'stage-c',
    stageTitle: 'Stage C: Professional Expression & Influence',
    title: 'Explaining a Decision Under Constraints',
    objective: 'Articulate how you navigated tight trade-offs when resources, time, or information were severely limited.',
    difficulty: 'Command',
    cognitiveMode: 'Analytical',
    categoryTag: 'Professional',
    suggestedCompletionMinutes: 12,
    context: 'System design interviews, post-mortems, or startup founder reflections.',
    instructions: 'Describe a decision made under imperfect conditions (insufficient data, tight budget, or tight deadline). Explain what heuristics guided your triage.',
    guidelines: {
      type: 'GAIN',
      title: 'The Triage Decision Matrix',
      objective: 'Explain disciplined trade-offs under pressure.',
      whyItMatters: 'Anyone can build when time and money are unlimited. Great thinkers shine under strict constraints.',
      steps: [
        { label: 'G - Context', instruction: 'Define the constraint clearly (e.g., 48 hours to launch).' },
        { label: 'A - Acknowledge What Was Sacrificed', instruction: 'What nice-to-have features did you willingly cut?' },
        { label: 'I - Insight (The Guiding Anchor)', instruction: 'What single core value or metric did you preserve at all costs?' },
        { label: 'N - Navigate Vindication', instruction: 'How did this choice validate itself in hindsight?' }
      ],
      illustrativeExample: 'With only two days left before our investor demo and our dashboard failing to load historical charts, I decided to scrap the interactive charting library and replace it with static daily summary cards. We sacrificed exploratory drill-downs to guarantee sub-second page loads. The investors praised the speed and clarity of the summary cards, validating our triage.',
      commonMistakeToAvoid: 'Pretending there was no sacrifice or downside to the chosen path.'
    },
    suggestedDrill: {
      targetSkill: 'Triage Articulation',
      reason: 'Clarifies prioritization under stress.',
      instruction: 'Use the phrase: "Under the constraint of [Constraint], we chose to prioritize [Critical Item] at the intentional expense of [Non-Critical Item]."',
      completionCriteria: 'Clear contrast showing conscious sacrifice.'
    }
  },
  {
    id: 'topic-day-26',
    dayNumber: 26,
    stage: 'stage-c',
    stageTitle: 'Stage C: Professional Expression & Influence',
    title: 'Handling a Disagreement Professionally',
    objective: 'De-escalate an ideological or technical impasse with a colleague and find a shared path forward.',
    difficulty: 'Command',
    cognitiveMode: 'Reflective',
    categoryTag: 'Interpersonal',
    suggestedCompletionMinutes: 10,
    context: 'Architecture review disputes, stakeholder friction, or co-founder alignment.',
    instructions: 'Describe how you resolved or would navigate a deadlocked dispute with a peer. Focus on de-personalizing the friction and using data or time-boxed pilots to break the stalemate.',
    guidelines: {
      type: 'STANDARD',
      title: 'Disagreement Resolution Framework',
      objective: 'Turn ideological conflict into empirical experimentation.',
      whyItMatters: 'Arguments persist when people argue philosophies. Progress happens when people test hypotheses.',
      steps: [
        { label: 'Opener', instruction: 'Acknowledge the deadlock without frustration.' },
        { label: 'Context', instruction: 'Identify the underlying fear or concern of the other party.' },
        { label: 'Insight', instruction: 'Propose an empirical test or time-boxed trial to measure reality.' },
        { label: 'Closure', instruction: 'Commit to disagree and commit once data is collected.' }
      ],
      illustrativeExample: 'My colleague and I were deadlocked over whether to build our mobile app with Flutter or native Swift. Instead of continuing subjective debates, we agreed to build a 2-day prototype of our most complex interactive screen in both stacks. The benchmark showed Flutter met our 60fps standard in half the development time, giving us an objective consensus.',
      commonMistakeToAvoid: 'Relying on senior hierarchy or brute force to win an argument.'
    },
    suggestedDrill: {
      targetSkill: 'Empirical De-escalation',
      reason: 'Removes ego from professional disputes.',
      instruction: 'Draft a compromise proposal starting with: "Rather than debate the theory further, can we run a one-week trial where we measure..."',
      completionCriteria: 'Specific measurable metric and defined timeline.'
    }
  },
  {
    id: 'topic-day-27',
    dayNumber: 27,
    stage: 'stage-c',
    stageTitle: 'Stage C: Professional Expression & Influence',
    title: 'Describing a Negotiation',
    objective: 'Frame a negotiation not as warfare, but as collaborative problem solving to find a mutually advantageous equilibrium.',
    difficulty: 'Command',
    cognitiveMode: 'Analytical',
    categoryTag: 'Leadership',
    suggestedCompletionMinutes: 12,
    context: 'Contract terms, compensation reviews, or scope negotiations.',
    instructions: 'Describe a scenario where you negotiated terms, scope, or timeline. Clarify what each side needed and the creative compromise that satisfied both parties.',
    guidelines: {
      type: 'GAIN',
      title: 'The Mutual Value Negotiation Arc',
      objective: 'Negotiate interests, not stubborn positions.',
      whyItMatters: 'Zero-sum negotiations leave bitterness. Value-creation negotiations build long-term alliances.',
      steps: [
        { label: 'G - Context', instruction: 'Frame the initial conflicting positions.' },
        { label: 'A - Acknowledge Real Priorities', instruction: 'What was the true underlying need for each party?' },
        { label: 'I - Insight (The Creative Trade)', instruction: 'What variable was traded (e.g. time for scope, equity for salary)?' },
        { label: 'N - Navigate Win-Win', instruction: 'Confirm the durable partnership outcome.' }
      ],
      illustrativeExample: 'A client wanted an enterprise analytics dashboard delivered in three weeks for half our standard fee. Rather than rejecting them outright, we discovered their true priority was having numbers ready for their upcoming board meeting. We agreed to build a streamlined executive dashboard covering their core four metrics within their budget, deferring the automated PDF export to a second milestone.',
      commonMistakeToAvoid: 'Viewing negotiation as forcing the other side to surrender.'
    },
    suggestedDrill: {
      targetSkill: 'Variable Unbundling',
      reason: 'Finds tradeable currency other than money or stubborn deadlines.',
      instruction: 'State the trade in one sentence: "While they could not budge on [Constraint A], they were flexible on [Variable B], which allowed us to [Result]."',
      completionCriteria: 'Clear identification of a tradeable variable.'
    }
  },
  {
    id: 'topic-day-28',
    dayNumber: 28,
    stage: 'stage-c',
    stageTitle: 'Stage C: Professional Expression & Influence',
    title: 'Telling a Concise, Relevant Story',
    objective: 'Share an anecdote that illustrates a business or philosophical lesson in under 90 seconds.',
    difficulty: 'Command',
    cognitiveMode: 'Expressive',
    categoryTag: 'Leadership',
    suggestedCompletionMinutes: 10,
    context: 'Keynotes, investor meetings, team onboarding, or podcast interviews.',
    instructions: 'Tell a real story from your experience that proves a broader point. Ensure every sentence builds tension toward the punchline/lesson.',
    guidelines: {
      type: 'STANDARD',
      title: 'The Hook → Tension → Lesson Story Arc',
      objective: 'Engage emotionally while keeping business relevance sharp.',
      whyItMatters: 'People forget metrics and specs, but they remember stories that embody a clear principle.',
      steps: [
        { label: 'Opener (Hook)', instruction: 'One line establishing high stakes or an unusual premise.' },
        { label: 'Context', instruction: 'The complication that threatened the outcome.' },
        { label: 'Insight', instruction: 'The pivotal moment of courage or realization.' },
        { label: 'Closure', instruction: 'How this story defines your standard today.' }
      ],
      illustrativeExample: 'On our first product launch, we spent five months building twenty complex features in stealth mode. On launch day, only three users registered, and none of them touched 18 of the features. That painful silence taught me more than any business degree: never build in the dark. Build the smallest possible thing in public and let real users guide your roadmap.',
      commonMistakeToAvoid: 'Meandering into irrelevant character details or setting backstories.'
    },
    suggestedDrill: {
      targetSkill: 'Story Compression',
      reason: 'Prevents storytelling from feeling self-indulgent.',
      instruction: 'Tell your entire story in exactly three sentences: 1. Setup, 2. Conflict, 3. Moral.',
      completionCriteria: 'Complete three-act structure within 60 words.'
    }
  },
  {
    id: 'topic-day-29',
    dayNumber: 29,
    stage: 'stage-c',
    stageTitle: 'Stage C: Professional Expression & Influence',
    title: 'Pitching an Idea in a Structured Way',
    objective: 'Present a new initiative, product, or solution using a tight 4-step pitch structure that inspires action.',
    difficulty: 'Command',
    cognitiveMode: 'Expressive',
    categoryTag: 'Leadership',
    suggestedCompletionMinutes: 12,
    context: 'Venture pitches, hackathon presentations, or internal innovation proposals.',
    instructions: 'Pitch an idea you believe in. Articulate the acute pain in the status quo, your elegant mechanism, the unfair advantage, and the immediate call to action.',
    guidelines: {
      type: 'GAIN',
      title: 'The High-Stakes Elevator Pitch',
      objective: 'Generate irresistible excitement and curiosity in under two minutes.',
      whyItMatters: 'Great ideas die without a crisp, compelling pitch that makes the vision obvious.',
      steps: [
        { label: 'G - The Hook & Problem', instruction: 'Identify the widespread, unsolved friction.' },
        { label: 'A - Acknowledge Failed Solutions', instruction: 'Why existing tools or habits fail to solve it.' },
        { label: 'I - The Insight & Innovation', instruction: 'Explain your secret sauce or mechanism.' },
        { label: 'N - Navigate to Action', instruction: 'The tangible next milestone you are inviting them to join.' }
      ],
      illustrativeExample: 'Every day, ambitious professionals struggle to turn their knowledge into clear spoken influence. Existing courses give you passive video lectures, while public speaking clubs are intimidating and lack daily cadence. ResolvAI is a private daily practice operating system where you spend 10 minutes practicing structured prompts with instant AI rubric feedback. We are opening our first cohort of 50 beta learners today.',
      commonMistakeToAvoid: 'Getting bogged down in technical architecture instead of the customer transformation.'
    },
    suggestedDrill: {
      targetSkill: 'The 30-Second Hook',
      reason: 'Captures attention immediately.',
      instruction: 'Formulate the opening two sentences: 1. Who is suffering and why; 2. What your product does to solve it.',
      completionCriteria: 'Clear customer identity + clear solution verb.'
    }
  },
  {
    id: 'topic-day-30',
    dayNumber: 30,
    stage: 'stage-c',
    stageTitle: 'Stage C: Professional Expression & Influence',
    title: 'Reviewing Personal Progress and Setting a Next Goal',
    objective: 'Synthesize 30 days of deliberate practice, measuring your evolution in articulation and committing to the next horizon.',
    difficulty: 'Command',
    cognitiveMode: 'Reflective',
    categoryTag: 'Leadership',
    suggestedCompletionMinutes: 15,
    context: 'Milestone retrospective, personal founder manifesto, or cohort graduation.',
    instructions: 'Look back across the journey from Day 1 to Day 30. Compare your initial hesitation with your current structural fluency. Declare your next communication standard.',
    guidelines: {
      type: 'GAIN',
      title: 'The Transformation Retrospective',
      objective: 'Lock in progress and transform discipline into durable identity.',
      whyItMatters: 'Reflection turns raw repetition into permanent cognitive wiring.',
      steps: [
        { label: 'G - Greet & Milestone', instruction: 'Celebrate reaching Day 30 of consistent practice.' },
        { label: 'A - Acknowledge Evolution', instruction: 'Contrast your Day 1 baseline against your current clarity.' },
        { label: 'I - The Core Insight', instruction: 'What was the single most transformative shift in how you organize thought?' },
        { label: 'N - Navigate to the Horizon', instruction: 'What is your standard for communication moving forward?' }
      ],
      illustrativeExample: 'Completing these 30 days of daily practice has fundamentally altered how I engage with ideas. On Day 1, my thoughts were tangled and I relied on rambling sentences to find my point. Today, I naturally organize my words around context, insight, and clear next steps before speaking. Communication is no longer something I fear - it is a craft I continue to refine daily.',
      commonMistakeToAvoid: 'Treating Day 30 as a finish line rather than the beginning of lifelong practice.'
    },
    extensionQuestion: 'Which guideline framework (G.A.I.N. or Opener-Context-Insight-Closure) has become second nature to you in spontaneous conversations?',
    suggestedDrill: {
      targetSkill: 'Personal Manifesto Statement',
      reason: 'Anchors identity transformation.',
      instruction: 'Write a single sentence summarizing your personal commitment to disciplined communication for the coming year.',
      completionCriteria: 'Inspirational, direct, personal declaration.'
    }
  }
];
