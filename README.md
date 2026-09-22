# Credit Risk Analysis & Assessment (with SHAP)

This repository outlines the foundational frameworks and machine learning interpretability methods used to evaluate a borrower’s creditworthiness and quantify expected financial exposure.

---

### 📊 The Core Risk Formula

Lenders calculate **Expected Loss (EL)** using three core metrics:

$$EL = PD \times LGD \times EAD$$

* **Probability of Default (PD):** The % likelihood a borrower defaults within a timeframe.
* **Loss Given Default (LGD):** The % of gross exposure lost if default occurs (after collateral recovery).
* **Exposure at Default (EAD):** The total dollar amount outstanding at the moment of default.

---

### ⚙️ Underwriting Framework: The 5 Cs of Credit

| Component | Focus Area | Key Financial Metrics Checked |
| :--- | :--- | :--- |
| **Character** | Reputation & track record | Credit scores, payment history, legal records |
| **Capacity** | Repayment ability | Debt-to-Income (DTI), cash flows, coverage ratios |
| **Capital** | Net worth / "Skin in the game" | Asset reserves, retained earnings, debt-to-equity |
| **Collateral**| Secondary backup security | Appraised value of real estate, inventory, or equipment |
| **Conditions**| Macroeconomic environment | Industry trends, interest rates, employment climate |

---

### 💡 Explainable AI (XAI) via SHAP

While tree-based models (**XGBoost, LightGBM**) maximize accuracy, regulatory compliance (e.g., FCRA) requires explainable credit decisions. **SHAP (SHapley Additive exPlanations)** converts black-box predictions into legally defensible insights.

#### Global Interpretability
Aggregated SHAP values reveal the top drivers of risk across the entire portfolio:
1. **Payment History:** Delinquencies yield the largest negative impact.
2. **Credit Utilization:** High balances relative to limits exponentially increase predicted risk.
3. **DTI Ratio:** High recurring debt-to-income limits financial breathing room.

#### Local Interpretability (Individual Reasons)
SHAP decomposes a single applicant's risk profile from a baseline average:
* **Base Portfolio Risk:** 5.0% Default Probability
* **Factor 1:** High credit utilization → `+3.5%`
* **Factor 2:** 10-year clean payment history → `-2.0%`
* **Final Output Risk:** **6.5%** 
* *Result:* The underwriter gains exact data points to issue automated adverse action notices.

---

### 🔎 Risk Mitigation Strategies

* **Risk-Based Pricing:** Adjusting interest rates higher for riskier borrowers to offset expected losses.
* **Concentration Caps:** Diversifying portfolios by limiting max exposure to single industries or regions.
* **Stress Testing:** Simulating macroeconomic downturns to ensure capital adequacy.
