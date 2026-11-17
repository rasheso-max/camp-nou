const themeToggle = document.querySelector(".theme-toggle");

themeToggle.addEventListener("click", () => {
  const isLight = document.body.classList.toggle("light-mode");
  themeToggle.setAttribute("aria-pressed", String(isLight));
  themeToggle.setAttribute("aria-label", `Switch to ${isLight ? "dark" : "light"} mode`);
  themeToggle.querySelector("span").textContent = isLight ? "Dark mode" : "Light mode";
});

const featureContent = {
  roof: {
    kicker: "01 / ARCHITECTURE",
    title: "Under one remarkable roof.",
    description: "A sweeping 360° canopy wraps every seat, bringing the crowd together and sheltering fans from the elements.",
    caption: "DESIGNED FOR<br>EVERY MOMENT"
  },
  vip: {
    kicker: "02 / MATCHDAY",
    title: "A new way to experience Barça.",
    description: "A collection of premium hospitality spaces and VIP rings brings fans closer to the action, with comfort and views to match.",
    caption: "CLOSER TO<br>THE ACTION"
  },
  museum: {
    kicker: "03 / CLUB HISTORY",
    title: "The story, brought to life.",
    description: "Discover the club's legendary moments through immersive exhibits, treasured artifacts, and a fresh take on the Barça Museum.",
    caption: "A LEGACY<br>IN EVERY DETAIL"
  },
  pitch: {
    kicker: "04 / PITCH TECHNOLOGY",
    title: "Ready for the beautiful game.",
    description: "An advanced playing surface and carefully designed stadium systems help create the perfect stage for football at its best.",
    caption: "MADE FOR<br>GREAT FOOTBALL"
  }
};

const featureTabs = document.querySelectorAll(".feature-tab");
const featurePanel = document.querySelector("#feature-panel");

featureTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const feature = featureContent[tab.dataset.feature];
    featureTabs.forEach((item) => {
      const isActive = item === tab;
      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-selected", String(isActive));
    });
    featurePanel.setAttribute("aria-labelledby", tab.id);
    document.querySelector("#feature-kicker").textContent = feature.kicker;
    document.querySelector("#feature-title").textContent = feature.title;
    document.querySelector("#feature-description").textContent = feature.description;
    document.querySelector(".feature-art-caption").innerHTML = feature.caption;
  });
});

document.querySelectorAll(".legend-trigger").forEach((button) => {
  button.addEventListener("click", () => {
    const details = document.getElementById(button.getAttribute("aria-controls"));
    const isExpanded = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!isExpanded));
    button.closest(".legend-card").classList.toggle("is-open", !isExpanded);
    button.querySelector(".legend-cta").firstChild.textContent = isExpanded
      ? "Explore his legacy "
      : "Hide achievements ";
    details.hidden = isExpanded;
  });
});

const matchCategory = document.querySelector("#match-category");
const seatingTier = document.querySelector("#seating-tier");
const ticketQuantity = document.querySelector("#ticket-quantity");
const ticketTotal = document.querySelector("#ticket-total");
const summaryDescription = document.querySelector("#summary-description");
const matchNames = { laliga: "La Liga", champions: "Champions League", clasico: "El Clásico" };
const tierNames = { vip: "VIP", grandstand: "Grandstand", goal: "Goal Stand" };
const ticketPrices = {
  laliga: { vip: 350, grandstand: 125, goal: 65 },
  champions: { vip: 500, grandstand: 200, goal: 100 },
  clasico: { vip: 800, grandstand: 400, goal: 180 }
};

function updateTicketEstimate() {
  const quantity = Math.min(10, Math.max(1, Number.parseInt(ticketQuantity.value, 10) || 1));
  const category = matchCategory.value;
  const tier = seatingTier.value;
  const total = ticketPrices[category][tier] * quantity;
  summaryDescription.textContent = `${matchNames[category]} · ${tierNames[tier]} · ${quantity} ${quantity === 1 ? "ticket" : "tickets"}`;
  ticketTotal.textContent = `€${total.toLocaleString("en-IE")}`;
}

matchCategory.addEventListener("change", updateTicketEstimate);
seatingTier.addEventListener("change", updateTicketEstimate);
ticketQuantity.addEventListener("input", updateTicketEstimate);
ticketQuantity.addEventListener("change", () => {
  const quantity = Math.min(10, Math.max(1, Number.parseInt(ticketQuantity.value, 10) || 1));
  ticketQuantity.value = String(quantity);
  updateTicketEstimate();
});

document.querySelectorAll("[data-quantity-change]").forEach((button) => {
  button.addEventListener("click", () => {
    const change = Number(button.dataset.quantityChange);
    const current = Number.parseInt(ticketQuantity.value, 10) || 1;
    ticketQuantity.value = String(Math.min(10, Math.max(1, current + change)));
    updateTicketEstimate();
  });
});

const quizQuestions = [
  {
    question: "When did Camp Nou first open its doors?",
    options: ["1957", "1929", "1974"],
    answer: 0,
    fact: "Camp Nou opened in 1957, becoming Barça's home after Les Corts."
  },
  {
    question: "Which stadium did Camp Nou replace as Barça's home?",
    options: ["Montjuïc Olympic Stadium", "Les Corts", "Estadi de Sarrià"],
    answer: 1,
    fact: "Les Corts was Barça's home before the move to the larger Camp Nou."
  },
  {
    question: "What does the club motto “Més que un club” mean?",
    options: ["More than a club", "Play to win", "Together we score"],
    answer: 0,
    fact: "“Més que un club” means “More than a club” in Catalan."
  }
];

const quizQuestion = document.querySelector("#quiz-question");
const quizQuestionNumber = document.querySelector("#quiz-question-number");
const quizProgress = document.querySelector("#quiz-progress");
const quizOptions = document.querySelector("#quiz-options");
const quizFeedback = document.querySelector("#quiz-feedback");
const quizNext = document.querySelector("#quiz-next");
const quizScore = document.querySelector("#quiz-score");
let currentQuestion = 0;
let score = 0;
let quizComplete = false;

function renderQuizQuestion() {
  quizComplete = false;
  const question = quizQuestions[currentQuestion];
  const number = String(currentQuestion + 1).padStart(2, "0");
  quizQuestionNumber.textContent = `QUESTION ${number}`;
  quizProgress.textContent = `QUESTION ${number} / ${String(quizQuestions.length).padStart(2, "0")}`;
  quizQuestion.textContent = question.question;
  quizFeedback.textContent = "";
  quizNext.hidden = true;
  quizNext.innerHTML = currentQuestion === quizQuestions.length - 1
    ? 'See your result <span aria-hidden="true">→</span>'
    : 'Next question <span aria-hidden="true">→</span>';
  quizOptions.replaceChildren();

  question.options.forEach((option, index) => {
    const button = document.createElement("button");
    const letter = document.createElement("span");
    letter.className = "option-letter";
    letter.textContent = String.fromCharCode(65 + index);
    button.type = "button";
    button.className = "quiz-option";
    button.append(letter, document.createTextNode(option));
    button.addEventListener("click", () => answerQuizQuestion(index));
    quizOptions.append(button);
  });
}

function answerQuizQuestion(selectedIndex) {
  const question = quizQuestions[currentQuestion];
  const options = quizOptions.querySelectorAll(".quiz-option");
  options.forEach((option, index) => {
    option.disabled = true;
    if (index === question.answer) option.classList.add("is-correct");
    if (index === selectedIndex && selectedIndex !== question.answer) option.classList.add("is-wrong");
  });

  if (selectedIndex === question.answer) {
    score += 1;
    quizScore.textContent = String(score);
    quizFeedback.textContent = `That's right! ${question.fact}`;
  } else {
    quizFeedback.textContent = `Not quite. ${question.fact}`;
  }
  quizNext.hidden = false;
}

quizNext.addEventListener("click", () => {
  if (quizComplete) {
    currentQuestion = 0;
    score = 0;
    quizScore.textContent = "0";
    renderQuizQuestion();
    return;
  }

  if (currentQuestion < quizQuestions.length - 1) {
    currentQuestion += 1;
    renderQuizQuestion();
    return;
  }

  quizQuestionNumber.textContent = "FINAL SCORE";
  quizProgress.textContent = "QUIZ COMPLETE";
  quizQuestion.textContent = score === quizQuestions.length
    ? "A true Barça history maker."
    : score > 0 ? "You know your way around Camp Nou." : "Every culer starts somewhere.";
  quizOptions.replaceChildren();
  quizFeedback.textContent = `You scored ${score} out of ${quizQuestions.length}.`;
  quizNext.hidden = false;
  quizNext.textContent = "Play again →";
  quizComplete = true;
});

updateTicketEstimate();
renderQuizQuestion();
