(() => {
  const $ = (id) => document.getElementById(id);

  const body = document.body;

  const toggleAi = $("toggleAi");
  const tryBtn = $("tryBtn");
  const aiState = $("aiState");

  const heroTitle = $("heroTitle");
  const heroSubtitle = $("heroSubtitle");
  const afterTitle = $("afterTitle");
  const afterSub = $("afterSub");

  const addReviewBtn = $("addReviewBtn");
  const toast = $("toast");
  const toastTitle = $("toastTitle");
  const toastBody = $("toastBody");
  const toastClose = $("toastClose");

  const aiPct = $("aiPct");
  const aiBarFill = $("aiBarFill");
  const aiProgress = $("aiProgress");

  const genBuzz = $("genBuzz");
  const copyBuzz = $("copyBuzz");
  const buzzOut = $("buzzOut");

  const planButtons = Array.from(document.querySelectorAll("[data-plan]"));
  const howEmojis = Array.from(document.querySelectorAll(".howEmoji"));

  let aiOn = false;
  let toastTimer = null;
  let progressTimer = null;
  let progressValue = 0;

  const reviews = [
    "“We raised prices 38% in a week. Nobody asked what changed. We told them ‘AI.’ They nodded.”",
    "“Our roadmap was 6 months of boring features. Now it’s 12 months of ‘agents.’ Investors clapped.”",
    "“Support tickets went up 12%. We rebranded them as ‘training data’ and called it a win.”",
    "“I added AI to our roadmap and got promoted to ‘Head of Strategy.’ I still don’t know what we build.”",
    "“We didn’t change the product. We changed the adjective. The churn stayed the same, but the valuation improved.”"
  ];

  const buzzwords = {
    adjective: ["agentic", "enterprise-grade", "production-ready", "proprietary", "multimodal", "real-time"],
    noun: ["orchestration", "workflow engine", "intelligence layer", "copilot", "reasoning mesh", "observability fabric"],
    verb: ["leverages", "orchestrates", "harmonizes", "activates", "unlocks", "supercharges"],
    thing: ["RAG", "MCP servers", "vector databases", "tool calling", "guardrails", "evals"],
    promise: ["measurable ROI", "faster time-to-value", "reduced operational drag", "higher conversion", "lower churn (spiritually)", "stakeholder alignment"]
  };

  const templates = [
    ({adjective, noun, verb, thing, promise}) =>
      `We’re shipping an ${adjective} AI ${noun} that ${verb} ${thing} to deliver ${promise}.`,
    ({adjective, noun, verb, thing, promise}) =>
      `Our ${adjective} architecture combines ${thing} with an AI ${noun}, so teams can claim ${promise} immediately.`,
    ({adjective, noun, verb, thing, promise}) =>
      `By integrating ${thing} and an ${adjective} AI ${noun}, we ${verb} the full lifecycle from prompt to pipeline—driving ${promise}.`,
    ({adjective, noun, verb, thing, promise}) =>
      `This release introduces ${thing}-powered, ${adjective} agents inside our AI ${noun} to unlock ${promise} (no behavior changes required).`
  ];

  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  function makeSentence() {
    const ctx = {
      adjective: pick(buzzwords.adjective),
      noun: pick(buzzwords.noun),
      verb: pick(buzzwords.verb),
      thing: pick(buzzwords.thing),
      promise: pick(buzzwords.promise)
    };
    const tpl = templates[Math.floor(Math.random() * templates.length)];
    return tpl(ctx);
  }

  function showToast(title, bodyText) {
    if (!toast || !toastTitle || !toastBody) return;
    toastTitle.textContent = title;
    toastBody.textContent = bodyText;
    toast.classList.add("show");
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 4500);
  }

  function setProgress(val) {
    progressValue = Math.max(0, Math.min(99, val)); // never 100
    if (aiPct) aiPct.textContent = String(Math.round(progressValue));
    if (aiBarFill) aiBarFill.style.width = `${progressValue}%`;
    const bar = aiProgress?.querySelector('.aiBar');
    if (bar) bar.setAttribute('aria-valuenow', String(Math.round(progressValue)));
  }

  function stopProgressLoop() {
    if (progressTimer) {
      clearInterval(progressTimer);
      progressTimer = null;
    }
  }

  function startProgressLoop() {
    stopProgressLoop();
    setProgress(0);

    let phase = 0;
    progressTimer = setInterval(() => {
      if (!aiOn) return;

      if (phase === 0) {
        setProgress(progressValue + 7);
        if (progressValue >= 80) phase = 1;
      } else if (phase === 1) {
        setProgress(progressValue + 2);
        if (progressValue >= 95) phase = 2;
      } else {
        const jitter = (Math.random() * 2) - 1; // -1..1
        const target = 96 + jitter;
        setProgress(target);
      }
    }, 380);
  }

  function updateHowEmojis() {
    howEmojis.forEach((el) => {
      const off = el.getAttribute("data-off") || "";
      const on = el.getAttribute("data-on") || off;
      el.textContent = aiOn ? on : off;
    });
  }

  function applyAiState(showToastNow = false) {
    body.dataset.ai = aiOn ? "on" : "off";
    if (toggleAi) toggleAi.setAttribute("aria-pressed", String(aiOn));
    if (aiState) aiState.textContent = aiOn ? "ON" : "OFF";

    if (aiOn) {
      if (heroTitle) heroTitle.textContent = "AI-Powered Product Intelligence Platform";
      if (heroSubtitle) heroSubtitle.textContent = "Leveraging proprietary models and agentic workflows (in spirit).";
      if (afterTitle) afterTitle.textContent = "AI-Powered Product Intelligence Platform";
      if (afterSub) afterSub.textContent = "Leveraging proprietary models and agentic workflows.";
      if (showToastNow) showToast("AI Enabled", "We are now adding AI somewhere around here.");
      startProgressLoop();
    } else {
      if (heroTitle) heroTitle.textContent = "Product Management Software";
      if (heroSubtitle) heroSubtitle.textContent = "Simple. Predictable. Honest. (Gross.)";
      if (afterTitle) afterTitle.textContent = "AI-Powered Product Intelligence Platform";
      if (afterSub) afterSub.textContent = "Leveraging proprietary models and agentic workflows.";
      if (showToastNow) showToast("AI Disabled", "AI removed. Marketing remains fully operational.");
      stopProgressLoop();
      setProgress(0);
    }

    updateHowEmojis();
  }

  function toggle() {
    aiOn = !aiOn;
    applyAiState(true);
  }

  if (toggleAi) toggleAi.addEventListener("click", toggle);
  if (tryBtn) tryBtn.addEventListener("click", toggle);

  if (addReviewBtn) {
    addReviewBtn.addEventListener("click", () => {
      const r = reviews[Math.floor(Math.random() * reviews.length)];
      showToast("New review generated", r);
    });
  }

  if (genBuzz && buzzOut) {
    genBuzz.addEventListener("click", () => {
      const s = makeSentence();
      buzzOut.textContent = s;
      showToast("Verbiage generated", "Copy, paste, close deal. Repeat.");
    });
  }

  if (copyBuzz && buzzOut) {
    copyBuzz.addEventListener("click", async () => {
      const text = buzzOut.textContent || "";
      try {
        await navigator.clipboard.writeText(text);
        showToast("Copied", "Now say it like you believe it.");
      } catch {
        // Fallback
        const ta = document.createElement("textarea");
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        ta.remove();
        showToast("Copied-ish", "Clipboard is a suggestion, like AI.");
      }
    });
  }

  planButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const plan = btn.getAttribute("data-plan") || "Plan";
      showToast("Plan selected", `You selected ${plan}. A sales rep will contact you within 3–5 business buzzwords.`);
    });
  });

  if (toastClose) toastClose.addEventListener("click", () => toast && toast.classList.remove("show"));

  applyAiState(false);
})();