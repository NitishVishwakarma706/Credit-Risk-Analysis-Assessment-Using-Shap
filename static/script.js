// Change this if your frontend and API are hosted on different origins/services.
const API_BASE_URL = "";

const form = document.getElementById("predict-form");
const submitBtn = document.getElementById("submit-btn");
const btnLabel = submitBtn.querySelector(".btn-label");
const spinner = submitBtn.querySelector(".spinner");
const errorMsg = document.getElementById("error-msg");
const resetBtn = document.getElementById("reset-btn");

const resultCard = document.getElementById("result-card");
const gauge = document.getElementById("gauge");
const gaugeValue = document.getElementById("gauge-value");
const resultBadge = document.getElementById("result-badge");
const resultTitle = document.getElementById("result-title");
const resultDesc = document.getElementById("result-desc");
const thresholdValue = document.getElementById("threshold-value");
const probValue = document.getElementById("prob-value");

const incomeInput = document.getElementById("person_income");
const amntInput = document.getElementById("loan_amnt");
const percentInput = document.getElementById("loan_percent_income");
const autoTag = document.getElementById("auto-tag");

let percentManuallyEdited = false;

// --- Auto-calculate loan_percent_income unless the user edits it manually ---
function recalcPercentIncome() {
  if (percentManuallyEdited) return;
  const income = parseFloat(incomeInput.value);
  const amnt = parseFloat(amntInput.value);
  if (income > 0 && amnt >= 0) {
    percentInput.value = (amnt / income).toFixed(2);
    autoTag.classList.remove("hidden");
  }
}

incomeInput.addEventListener("input", recalcPercentIncome);
amntInput.addEventListener("input", recalcPercentIncome);
percentInput.addEventListener("input", () => {
  percentManuallyEdited = true;
  autoTag.classList.add("hidden");
});

// --- Helpers ---
function setLoading(isLoading) {
  submitBtn.disabled = isLoading;
  spinner.hidden = !isLoading;
  btnLabel.textContent = isLoading ? "Analyzing..." : "Predict Risk";
}

function showError(message) {
  errorMsg.textContent = message;
  errorMsg.hidden = false;
}

function hideError() {
  errorMsg.hidden = true;
  errorMsg.textContent = "";
}

function animateNumber(el, from, to, duration = 900) {
  const start = performance.now();
  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = from + (to - from) * eased;
    el.textContent = `${current.toFixed(1)}%`;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function renderResult(data) {
  const probabilityPct = data.default_probability * 100;
  const thresholdPct = data.threshold * 100;
  const isHighRisk = data.default_prediction === 1;

  resultCard.hidden = false;
  requestAnimationFrame(() => {
    gauge.style.setProperty("--gauge-color", isHighRisk ? "var(--danger)" : "var(--success)");
    gauge.style.setProperty("--percentage", probabilityPct.toFixed(1));
  });

  animateNumber(gaugeValue, 0, probabilityPct);

  resultBadge.textContent = isHighRisk ? "High Risk" : "Low Risk";
  resultBadge.className = `badge ${isHighRisk ? "high" : "low"}`;

  resultTitle.textContent = isHighRisk
    ? "Likely to default"
    : "Unlikely to default";
  resultDesc.textContent = isHighRisk
    ? "The model estimates a probability of default above the decision threshold for this applicant."
    : "The model estimates a probability of default below the decision threshold for this applicant.";

  thresholdValue.textContent = `${thresholdPct.toFixed(1)}%`;
  probValue.textContent = `${probabilityPct.toFixed(2)}%`;

  resultCard.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function collectPayload() {
  return {
    person_age: parseInt(document.getElementById("person_age").value, 10),
    person_income: parseFloat(incomeInput.value),
    person_home_ownership: document.getElementById("person_home_ownership").value,
    person_emp_length: parseFloat(document.getElementById("person_emp_length").value),
    loan_intent: document.getElementById("loan_intent").value,
    loan_grade: document.getElementById("loan_grade").value,
    loan_amnt: parseFloat(amntInput.value),
    loan_int_rate: parseFloat(document.getElementById("loan_int_rate").value),
    loan_percent_income: parseFloat(percentInput.value),
    cb_person_default_on_file: document.getElementById("cb_person_default_on_file").value,
    cb_person_cred_hist_length: parseInt(document.getElementById("cb_person_cred_hist_length").value, 10),
  };
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  hideError();

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  setLoading(true);
  try {
    const response = await fetch(`${API_BASE_URL}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(collectPayload()),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(errText || `Request failed with status ${response.status}`);
    }

    const data = await response.json();
    renderResult(data);
  } catch (err) {
    console.error(err);
    showError("Something went wrong while getting a prediction. Please check your inputs and try again.");
  } finally {
    setLoading(false);
  }
});

resetBtn.addEventListener("click", () => {
  form.reset();
  hideError();
  percentManuallyEdited = false;
  autoTag.classList.add("hidden");
  resultCard.hidden = true;
});