/* ---------- FLASHCARDS ---------- */
// Plain-English answers for each week's learning objectives (index-matched to DATA.weeks[n].objectives).
// These are the actual flashcard "answers" — DATA.weeks[n].objectives is the question, not the answer.
const OBJECTIVE_ANSWERS = {
  1: [
    "AI is the broad goal of building systems that do tasks needing human-like intelligence. Machine Learning (ML) is one way to get there: teaching a system from data instead of hand-coded rules. Deep Learning is ML using layered neural networks. Generative AI produces new content (text, images, code); modern systems commonly use deep learning, but generative methods are not universally a subset of it. LLMs (Large Language Models) are a specific type of generative AI trained on huge amounts of text to understand and generate language.",
    "A neural network is a layered system of simple math units that learns patterns from data. A transformer is the neural network design behind modern LLMs, built around \"attention.\" A token is a chunk of text (often part of a word) the model reads and generates one at a time. A parameter is one of the millions/billions of internal numbers the model learned during training. The context window is the maximum amount of text (in tokens) the model can \"see\" at once when responding.",
    "Training is the expensive, one-time process of teaching the model by adjusting its parameters on massive datasets. Inference is every time you actually use the trained model to generate a response &mdash; fast and comparatively cheap. Hallucination is when a model states something false or made-up with full confidence, because it's predicting plausible text, not looking up verified facts. The key limitation: models don't \"know\" when they're wrong, so outputs always need a human or a system check.",
    "Computational thinking means breaking a problem into smaller pieces (decomposition), ignoring irrelevant detail to focus on what matters (abstraction), writing a step-by-step solution (an algorithm), and being clear about what goes in and what comes out (I/O) &mdash; the same four steps work whether you're planning a grocery trip or building software.",
  ],
  2: [
    "A variable stores a value under a name. Data types describe what kind of value it is &mdash; numbers, text (strings), true/false (booleans). A list holds an ordered collection of items; a dict (dictionary) holds key-value pairs, like a labeled lookup table.",
    "Conditionals (if/else) let code make decisions. Loops (for/while) repeat an action without rewriting it. Functions package a block of code so it can be reused by name. Modules are files of related code you can import into other files, instead of copy-pasting.",
    "Exceptions are Python's way of handling errors gracefully (try/except) instead of crashing. File I/O means reading data from, or writing data to, files on disk. JSON is a simple, universal text format for structuring data (like a dict) that's easy for both humans and programs to read.",
    "Debugging means finding out why code isn't doing what you expect. The simplest method is adding print statements to see what values look like at each step. Logging is a more permanent, organized version of that. A debugger lets you pause code mid-run and inspect exactly what's happening, line by line.",
  ],
  3: [
    "Git tracks every change to your code over time. A branch is a safe, separate copy of the code to try changes without affecting the main version. A commit saves a snapshot of your changes with a message describing them. A PR (Pull Request) is a request to merge your branch's changes back into the main project, usually after review.",
    "A virtual environment is an isolated Python setup for one project, so its installed packages don't clash with another project's. pip is Python's tool for installing those packages. Dependency management means tracking exactly which packages (and versions) your project needs, usually in a file like requirements.txt, so it can be reliably rebuilt elsewhere.",
    "A sane project structure organizes code into clear folders (source code, tests, config) so anyone can find things. Testing means writing code that automatically checks your other code still works correctly. Logging records what a program did while it ran, which is essential for understanding problems after the fact.",
    "Configuration is the set of settings a program needs to run (like a database address). Environment variables store those settings &mdash; especially secrets like API keys &mdash; outside your code, so they're never accidentally shared or committed. Documentation is the written explanation of what your code does and how to use it, for others and for future you.",
  ],
  4: [
    "HTTP is the protocol web browsers and apps use to request and send data; HTTPS is the encrypted, secure version. REST is a common style for designing APIs around simple actions (get, create, update, delete). A JSON payload is the actual structured data sent or received in that request.",
    "An API key is a secret code that proves you're allowed to use a service. A bearer token works similarly &mdash; it's included with each request to prove who you are. Rate limits cap how many requests you can make in a given time, to keep the service fair and stable for everyone.",
    "SQL is the language for querying databases. SELECT chooses which columns of data you want. WHERE filters which rows you want. JOIN combines matching rows from two different tables. GROUP BY buckets rows together to calculate totals or averages per group.",
    "PostgreSQL is a popular, free, production-grade database system. Schema design is the process of deciding what tables you need, what columns each table has, and how tables relate to each other &mdash; done well upfront, it prevents messy, hard-to-query data later.",
  ],
  5: [
    "The transformer is the neural network design nearly all modern LLMs are built on. Its key idea is \"attention\" &mdash; letting the model weigh how much every other word in the input matters when processing each word, instead of reading strictly left to right like older models did.",
    "Tokenization is splitting text into small chunks (tokens) the model actually processes &mdash; often pieces of words, not whole words. The context window is the maximum number of tokens (input + output combined) the model can consider at once; anything beyond that limit gets cut off or forgotten.",
    "Attention lets the model decide which earlier words are most relevant when predicting the next one. Sampling is how the model picks its next word from several likely candidates &mdash; settings like \"temperature\" control whether it plays it safe (predictable) or gets more creative (varied, sometimes riskier).",
    "A good prompt clearly states the task, gives necessary context, and specifies the desired format. Structured output means asking the model to respond in a strict, predictable format (like JSON) instead of free-form text, so your code can reliably use the answer. A tool call is the model requesting that your code run a specific function on its behalf (e.g., \"look up the weather\").",
  ],
  6: [
    "An SDK (Software Development Kit) is the official library a provider gives you to call their model easily from code, instead of building raw web requests yourself. Streaming means the response is sent back piece by piece as it's generated, so users see words appear immediately instead of waiting for the whole answer.",
    "Robust structured output means reliably getting the model's response in the exact format your code expects, every time &mdash; including validating it and handling the rare cases it doesn't. Tool calling lets the model trigger real functions in your app (like a database lookup) as part of answering.",
    "A prompt template is a reusable, fill-in-the-blank prompt structure so you don't rewrite instructions from scratch every time. Multi-turn conversation state means remembering and re-sending prior messages in a chat, so the model has the full context of the conversation, not just the latest message.",
    "Cost and latency (response speed) usually trade off against model quality &mdash; bigger, smarter models cost more and respond slower. Model routing means automatically sending easy requests to a cheaper/faster model and only using the expensive model when the task truly needs it.",
  ],
  7: [
    "An embedding is a list of numbers that represents the meaning of a piece of text. Semantic similarity means comparing those number-lists to find text with a similar meaning &mdash; even if it doesn't share any of the same words.",
    "Chunking is splitting long documents into smaller pieces before turning them into embeddings, since models can only search/compare bite-sized pieces effectively. Metadata is extra labeled information attached to each chunk (like source, date, or section) that helps filter and organize search results later.",
    "A vector index is a data structure built to quickly find the closest-matching embeddings out of millions, without comparing every single one. A vector store is the database that manages storing embeddings and running those searches for you.",
    "Retrieval is fetching the most relevant chunks of information for a question. Filtering narrows the search using metadata (like \"only 2024 documents\"). Reranking takes the retrieved results and re-orders them with a more careful, usually slower check, to push the truly best matches to the top.",
  ],
  8: [
    "Query transformation improves the user's original question before searching. Rewriting cleans up or clarifies a vague question. HyDE has the model first write a hypothetical answer, then searches for real documents similar to that. Decomposition splits one complex question into several simpler ones to search separately.",
    "Hybrid retrieval combines traditional keyword search (great for exact terms, names, codes) with vector/semantic search (great for meaning and paraphrasing), then merges both sets of results &mdash; usually more accurate than either method alone.",
    "Reranking re-scores retrieved results with a more precise, slower model to surface the best ones first. Context compression trims down the retrieved text to only the most relevant sentences, so the final answer-generating model isn't overwhelmed with irrelevant content.",
    "Retrieval evaluation means systematically measuring whether your search is actually finding the right information, not just eyeballing it. Hallucination mitigation is the set of techniques &mdash; like requiring citations, or refusing to answer without retrieved evidence &mdash; that reduce the model making things up.",
  ],
  9: [
    "An agent is a system that pursues a goal by repeatedly observing its situation and taking actions, rather than answering in one single shot. Its state is what it currently knows/remembers. An observation is new information it receives (like a tool's result). An action is a step it takes, often by calling a tool &mdash; an external capability like a search or calculator.",
    "This is the core agent cycle: Think (decide what to do next), Act (do it &mdash; usually by calling a tool), Observe (look at the result), then repeat &mdash; using each new observation to decide the next action, until the goal is reached.",
    "Planning means the agent maps out a sequence of steps toward its goal, instead of reacting one step at a time blindly. Memory lets the agent retain useful information across steps (or even across separate sessions) instead of starting from scratch every time.",
    "Agents add complexity, cost, and unpredictability &mdash; they're overkill for tasks that a single prompt, a simple script, or a fixed workflow can already solve reliably and faster. Use an agent only when the task genuinely requires multiple dynamic steps or decisions you can't fully predict in advance.",
  ],
  10: [
    "Routing sends an incoming request to the right specialized handler (agent, prompt, or tool). Planning breaks a goal into an ordered sequence of steps ahead of time. Reflection has the agent review its own output or progress and self-correct before moving on.",
    "A state machine defines a fixed set of stages a task can be in (e.g., \"started,\" \"waiting for approval,\" \"done\") and the exact rules for moving between them &mdash; making a multi-step process predictable and easy to debug, instead of an open-ended loop.",
    "Retries automatically re-attempt a step that failed (like a flaky API call), instead of giving up immediately. A human-approval checkpoint pauses the workflow and waits for a person to confirm before a risky or important action proceeds.",
    "LangGraph is a framework for building agent workflows as an explicit graph of steps and decision points, rather than a single free-form loop &mdash; making complex, multi-branch agent logic easier to structure, visualize, and debug.",
  ],
  11: [
    "A supervisor-worker pattern has one \"supervisor\" agent break a big task into smaller pieces and delegate each to specialized \"worker\" agents, then combine their results &mdash; similar to how a manager assigns work to a team.",
    "Instead of one agent doing everything, work is split among specialists: a researcher gathers information, a planner decides the steps, a critic reviews and checks the work for mistakes, and a synthesizer combines everything into a final answer.",
    "A handoff is when one agent passes control (and relevant context) to another agent to continue the task. Shared state is the common information (like a running summary or task list) all agents in the system can read and update, so nothing gets lost between handoffs.",
    "Sequential execution runs steps one after another; parallel execution runs independent steps at the same time to save time. Failure handling means deciding what happens when one agent or step fails &mdash; retry it, skip it, or stop the whole workflow &mdash; so one hiccup doesn't silently break everything.",
  ],
  12: [
    "MCP (Model Context Protocol) is a standard way to connect AI models to external capabilities. An MCP client is the AI application; an MCP server exposes tools (actions the model can call), resources (data the model can read), and prompts (reusable instruction templates) to that client.",
    "Context is the information the model has been given access to at any point. Permissions define exactly what an MCP server is allowed to do or share &mdash; which matters a lot, since connecting a model to real tools also means real risk if permissions are too broad.",
    "Because MCP servers can give a model real capabilities (reading files, calling APIs, running commands), basic security means only granting the minimum access needed, validating anything the model requests before running it, and never blindly trusting model-generated input as safe.",
    "This means writing your own MCP server that exposes a specific tool or dataset to an AI client, then making it actually runnable and reachable &mdash; either locally or hosted somewhere &mdash; so a real AI assistant can use it.",
  ],
  13: [
    "FastAPI is a popular Python framework for building web APIs quickly. Pydantic validates that incoming/outgoing data matches the exact shape you expect, catching bad data early. Async Python lets a program handle many requests at once without waiting idly on slow operations like network calls.",
    "PostgreSQL stores your application's persistent data &mdash; things that must not be lost. Redis is a fast in-memory store typically used for temporary data (caching, session info, rate-limit counters) where speed matters more than permanence.",
    "Authentication confirms who a user is; authorization decides what they're allowed to do. Background jobs are tasks (like sending an email or processing a big file) that run separately from the main request, so users aren't stuck waiting for slow work to finish.",
    "Docker packages an app plus everything it needs to run into one portable container, so it behaves the same everywhere. Docker Compose runs multiple related containers (like an app + its database) together with one command. Testing, logging, and config still apply &mdash; production just makes them non-negotiable.",
  ],
  14: [
    "A golden dataset is a trusted set of example inputs and correct expected outputs, used to check whether your AI system still performs well. Regression tests re-run those examples after any change to catch cases where something that used to work has broken. Retrieval/agent evaluation applies this same idea specifically to how well retrieval or an agent's decisions perform.",
    "Prompt injection is when malicious text tricks a model into ignoring its instructions. Excessive agency is giving an AI system more autonomous power than is safe for the task. Data leakage is the model exposing information it shouldn't (private data, other users' data). Tool abuse is a compromised or manipulated agent misusing the tools it has access to.",
    "Structured logging records events in a consistent, searchable format, not just plain text, so problems can be found quickly. Metrics are numeric measurements over time (like response time or error rate) used to monitor system health. Distributed tracing follows a single request as it moves through multiple services, to see exactly where time was spent or something failed.",
    "A threat model is a structured exercise where you list what could go wrong with your AI system (who might attack it, how, and what damage they could do), then decide what defenses actually matter most &mdash; rather than guessing at security after something goes wrong.",
  ],
  15: [
    "Compute is the rented processing power (servers) that runs your application. Storage is where your data and files live in the cloud. IAM (Identity and Access Management) controls exactly who and what is allowed to access which cloud resources &mdash; critical for not accidentally exposing everything to everyone.",
    "CI/CD (Continuous Integration/Continuous Deployment) automatically tests and deploys your code every time you push a change, instead of doing it by hand. GitHub Actions is GitHub's built-in tool for defining exactly what those automatic steps should be.",
    "Deploying with Docker means shipping your packaged container to a real server so it's live and reachable. Secrets are sensitive values (passwords, API keys) that must be stored securely, never hard-coded into the app. Monitoring continuously watches the live system so you find out about problems immediately, not from an angry user.",
    "Scaling means adjusting how much compute power your app has to match real traffic &mdash; more servers when busy, fewer when quiet. Cost management is actively tracking and controlling what all of this actually costs, since cloud resources bill continuously and can add up fast if left unchecked.",
  ],
  16: [
    "This is the culmination objective: build one real, working system that uses an LLM, retrieves real information (RAG), makes autonomous decisions (agents), connects tools via MCP, is evaluated for quality, is checked for security risks, is observable in production, runs in Docker, and is deployed to the cloud &mdash; every earlier week's skill, combined.",
    "This means finishing and submitting every required artifact for your capstone project &mdash; typically the working code, documentation, an architecture diagram, and a demo &mdash; proving the system isn't just built, but complete and presentable.",
    "This is a hands-on exam where you demonstrate your actual skills by solving a real problem under time constraints, rather than just answering questions about concepts.",
    "This means clearly explaining and demonstrating your finished capstone project to others &mdash; what it does, why you built it that way, and what you'd improve &mdash; the same communication skill you'll need in any real engineering job.",
  ],
};
function buildDecks() {
  const decks = {};
  DATA.weeks.forEach(w => {
    decks['Week '+w.week+': '+w.title] = w.objectives.map((o,i)=>({
      id:'obj-'+w.week+'-'+i,
      front:'<span class="qa-kicker">Week '+w.week+' &mdash; '+w.title+'</span>'+o,
      back:(OBJECTIVE_ANSWERS[w.week] && OBJECTIVE_ANSWERS[w.week][i]) || 'See this week\'s lesson content for the full explanation.',
    }));
  });
  Object.keys(DATA.careerQuestions).forEach(cat => {
    decks['Career: '+cat] = DATA.careerQuestions[cat].map((q,i)=>({id:'career-'+cat+'-'+i, front:q, back:'Answer it out loud or in writing (Part 32 explain-back), then check the PDF / your notes. No single canonical answer — the point is retrieval practice.'}));
  });
  return decks;
}
const DECKS = buildDecks();
function renderFlashcards() {
  const c = document.getElementById('content');
  c.appendChild(el(`
    <h1>Flashcard Engine</h1>
    <div class="searchbar"><div style="flex:1; min-width:220px;"><label class="deck-select-label" for="deckSelect">Choose a deck</label><select id="deckSelect"></select></div></div>
    <div class="grid grid-3" id="fcStats"></div>
    <div id="fcBox"></div>
  `));
  const sel = document.getElementById('deckSelect');
  sel.innerHTML = Object.keys(DECKS).map(k=>`<option value="${k}">${k} (${DECKS[k].length})</option>`).join('');
  sel.onchange = () => startDeck(sel.value);
  startDeck(sel.value);
}
let fcIndex = 0, fcShowBack = false, fcDeckName = '';
function cardBox(id) { if (!STATE.flashcards[id]) STATE.flashcards[id] = {box:0}; return STATE.flashcards[id]; }
function startDeck(name) {
  fcDeckName = name; fcIndex = 0; fcShowBack = false;
  drawStats(); drawCard();
}
function drawStats() {
  const deck = DECKS[fcDeckName];
  const counts = {new:0, learning:0, review:0, mastered:0};
  const labels = ['new','learning','review','mastered'];
  deck.forEach(cd => { const b = cardBox(cd.id).box; counts[labels[b]]++; });
  document.getElementById('fcStats').innerHTML = `
    <div class="card stat"><div class="num">${counts.new}</div><div class="label">New</div></div>
    <div class="card stat"><div class="num">${counts.learning}</div><div class="label">Learning</div></div>
    <div class="card stat"><div class="num">${counts.review + counts.mastered}</div><div class="label">Review / Mastered</div></div>
  `;
}
function drawCard() {
  const deck = DECKS[fcDeckName];
  const box = document.getElementById('fcBox');
  if (!deck.length) { box.innerHTML = '<p>No cards.</p>'; return; }
  const cd = deck[fcIndex % deck.length];
  const st = cardBox(cd.id);
  const labels = ['New','Learning','Review','Mastered'];
  const meta = `Card ${(fcIndex%deck.length)+1}/${deck.length} &middot; Status: ${labels[st.box]}`;
  box.innerHTML = `
    <div class="qa-card" id="flashcard">
      <div class="qa-question">${cd.front}</div>
      ${fcShowBack ? `
        <hr class="qa-divider">
        <span class="qa-answer-label">Answer</span>
        <div class="qa-answer">${cd.back}</div>
      ` : ''}
      <span class="hint">${meta}</span>
    </div>
    <div style="text-align:center; margin-top:16px;">
      ${fcShowBack
        ? `<button class="btn" id="fcToggle">Hide Answer</button>`
        : `<button class="btn primary" id="fcToggle">Show Answer</button>`}
      <button class="btn" id="fcNext">Next Card &rarr;</button>
    </div>
    ${fcShowBack ? `
    <div style="text-align:center; margin-top:10px;">
      <button class="btn" id="fcAgain">Again (New)</button>
      <button class="btn" id="fcHard">Hard (Learning)</button>
      <button class="btn" id="fcGood">Good (Review)</button>
      <button class="btn primary" id="fcEasy">Easy (Mastered)</button>
    </div>` : ''}`;
  document.getElementById('fcToggle').onclick = () => { fcShowBack = !fcShowBack; drawCard(); };
  document.getElementById('fcNext').onclick = () => { fcIndex++; fcShowBack=false; drawCard(); };
  if (fcShowBack) {
    const advance = (level) => { st.box = level; save(); fcIndex++; fcShowBack=false; drawStats(); drawCard(); };
    document.getElementById('fcAgain').onclick = () => advance(0);
    document.getElementById('fcHard').onclick = () => advance(1);
    document.getElementById('fcGood').onclick = () => advance(2);
    document.getElementById('fcEasy').onclick = () => advance(3);
  }
}

