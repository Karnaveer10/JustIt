from urllib import response

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import joblib
import pandas as pd
import numpy as np
import requests
import json
import re
from fastapi import HTTPException
# ── Load models once at startup ───────────────────────────
import os
from dotenv import load_dotenv
# Base directory — works both locally and in Docker
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv()

# Models
m1 = joblib.load(os.path.join(BASE_DIR, 'models', 'stage1_binary.pkl'))
m2 = joblib.load(os.path.join(BASE_DIR, 'models', 'stage2_medium_long.pkl'))
le_y1 = joblib.load(os.path.join(BASE_DIR, 'models', 'le_stage1.pkl'))
le_y2 = joblib.load(os.path.join(BASE_DIR, 'models', 'le_stage2.pkl'))
encoders = joblib.load(os.path.join(BASE_DIR, 'models', 'feature_encoders.pkl'))
explainer = joblib.load(os.path.join(BASE_DIR, 'models', 'shap_explainer.pkl'))
state_map = joblib.load(os.path.join(BASE_DIR, 'models', 'state_map.pkl'))
type_map = joblib.load(os.path.join(BASE_DIR, 'models', 'type_map.pkl'))

# Lookups
court_lookup = pd.read_csv(os.path.join(BASE_DIR, 'data', 'lookups', 'court_lookup.csv'))
court_lookup = court_lookup.set_index(['state_code', 'dist_code', 'court_no'])
court_key = pd.read_csv(os.path.join(BASE_DIR, 'data', 'lookups', 'court_key.csv'))

GLOBAL_MEDIAN = 293.0
GLOBAL_PENDING = 16039.0

app = FastAPI(title="JusticeIQ", 
              description="Predict commercial dispute resolution timelines")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080",
        "http://127.0.0.1:8080",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://justice-iq-predictor.vercel.app", # Your main clean link
        "https://justice-iq-predictor-git-main-karnaveer10s-projects.vercel.app", # The preview link throwing the error
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

FEATURE_COLS = [
    'state_code', 'dist_code', 'court_no',
    'judge_position', 'type_name',
    'filing_year', 'filing_quarter',
    'court_historical_median_resolution', 'pending_cases_count'
]
class ClassificationInput(BaseModel):
    description: str
# ── Request schema — only what user knows ─────────────────
class CaseInput(BaseModel):
    state_code: int
    dist_code: int
    court_no: int
    judge_position: str
    type_name: float
    filing_year: int
    filing_quarter: int
def classify_case(description: str):
    allowed_types = type_clean[
        type_clean["is_commercial"] == True
    ][["type_name", "type_canonical"]]

    caseTypesListContext = (
        allowed_types
        .apply(
            lambda r: f'ID: {r["type_name"]} | Label: "{r["type_canonical"]}"',
            axis=1
        )
        .tolist()
    )
    caseTypesListContext = "\n".join(caseTypesListContext)

    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        raise Exception("OPENROUTER_API_KEY missing")

    response = requests.post(
        "https://openrouter.ai/api/v1/chat/completions",
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}",
        },
        json={
            "model": "openai/gpt-oss-20b:free",
            "temperature": 0,
            "messages": [
                {
                    "role": "system",
                    "content": f"""You are an automated legal intake classification worker.

Your objective is to classify a plain-English dispute into EXACTLY ONE allowed case type.

Available System Categories:
{caseTypesListContext}

CLASSIFICATION RULES:

1. Select exactly ONE code from the list.
2. Match the PRIMARY legal dispute — not the remedy.
3. Prefer specific legal categories over broad categories.
4. Use broad categories only if no narrower category exists.
5. If multiple disputes appear, choose the dominant legal issue.

Examples:
- Bounced cheque → cheque dishonour / negotiable instruments
- Trademark misuse → trademark / intellectual property
- Tenant refusing to vacate → tenancy / eviction
- Unpaid invoice → money suit

OUTPUT RULES:
- Return RAW JSON only
- No markdown
- No extra text

Output schema:
{{
"code": 3983,
"label": "money suit",
"reasoning": "Short explanation of why this category was selected."
}}"""
                },
                {
                    "role": "user",
                    "content": f'Classify this dispute:"{description}"\nReturn the closest allowed legal category.'
                }
            ]
        },
        timeout=30
    )

   

    if response.status_code != 200:
        raise HTTPException(status_code=500, detail=response.text)

    result = response.json()
    content = result["choices"][0]["message"]["content"]
    content = re.sub(r"^```json|```$", "", content.strip(), flags=re.MULTILINE).strip()
    parsed = json.loads(content)

    matched = allowed_types[allowed_types["type_name"] == int(parsed["code"])]

    if matched.empty:
        raise HTTPException(400, "Invalid case type")

    return {
        "code": int(parsed["code"]),
        "label": str(matched.iloc[0]["type_canonical"]),
        "reasoning": parsed["reasoning"]
    }
# ── Court lookup ──────────────────────────────────────────
def get_court_stats(state_code: int, dist_code: int, court_no: int):
    try:
        row = court_lookup.loc[(state_code, dist_code, court_no)]
        return float(row['court_historical_median_resolution']), float(row['pending_cases_count'])
    except KeyError:
        return GLOBAL_MEDIAN, GLOBAL_PENDING

# ── Feature encoding ──────────────────────────────────────
def encode_input(case: CaseInput) -> pd.DataFrame:
    hist_median, pending = get_court_stats(
        case.state_code, case.dist_code, case.court_no
    )
    row = {
        'state_code': case.state_code,
        'dist_code': case.dist_code,
        'court_no': case.court_no,
        'judge_position': case.judge_position,
        'type_name': case.type_name,
        'filing_year': case.filing_year,
        'filing_quarter': case.filing_quarter,
        'court_historical_median_resolution': hist_median,
        'pending_cases_count': pending
    }
    df = pd.DataFrame([row])
    cat_cols = ['state_code', 'dist_code', 'court_no', 'judge_position', 'type_name']
    for col in cat_cols:
        try:
            df[col] = encoders[col].transform(df[col].astype(str))
        except ValueError:
            df[col] = 0
    return df[FEATURE_COLS]

# ── SHAP explanation ──────────────────────────────────────
def get_explanation(X_encoded: pd.DataFrame) -> list:
    shap_values = explainer.shap_values(X_encoded)
    sv = shap_values[0]
    feature_impacts = sorted(
        zip(FEATURE_COLS, sv, X_encoded.values[0]),
        key=lambda x: abs(x[1]),
        reverse=True
    )
    explanations = []
    for feat, shap_val, feat_val in feature_impacts[:3]:
        direction = "increases delay risk" if shap_val > 0 else "reduces delay risk"
        explanations.append({
            "feature": feat,
            "impact": round(float(shap_val), 3),
            "direction": direction
        })
    return explanations

# ── Health check ──────────────────────────────────────────
@app.get("/")
def root():
    return {"status": "JusticeIQ API is running", "version": "1.0.0"}

# ── Predict endpoint ──────────────────────────────────────
@app.post("/predict")
def predict(case: CaseInput):
    X = encode_input(case)

    # Stage 1
    s1_pred = m1.predict(X)[0]
    s1_proba = m1.predict_proba(X)[0]
    s1_label = le_y1.classes_[s1_pred]
    s1_conf = float(s1_proba[s1_pred])

    # Stage 2 if slow
    if s1_label == '1_over_6months':
        s2_pred = m2.predict(X)[0]
        s2_proba = m2.predict_proba(X)[0]
        s2_label = le_y2.classes_[s2_pred]
        s2_conf = float(s2_proba[s2_pred])
        final_prediction = s2_label
        final_confidence = round(s1_conf * s2_conf * 100, 1)
    else:
        final_prediction = s1_label
        final_confidence = round(s1_conf * 100, 1)

    explanations = get_explanation(X)

    return {
        "prediction": final_prediction,
        "confidence": final_confidence,
        "explanation": explanations,
        "court_stats": {
            "historical_median_days": get_court_stats(
                case.state_code, case.dist_code, case.court_no)[0],
            "pending_cases": get_court_stats(
                case.state_code, case.dist_code, case.court_no)[1]
        },
        "model_version": "1.0.0"
    }
    
# Add this to src/api.py
@app.get("/courts/{state_code}/{dist_code}")
def get_courts(state_code: int, dist_code: int):
    # Get court names from court_key
    filtered = court_key[
        (court_key['state_code'] == state_code) & 
        (court_key['dist_code'] == dist_code)
    ][['court_no', 'court_name']].drop_duplicates()

    if filtered.empty:
        return {"state_code": state_code, "dist_code": dist_code, "courts": []}

    # Merge with performance stats from court_lookup
    try:
        stats = court_lookup.loc[(state_code, dist_code)].reset_index()
    except KeyError:
        stats = pd.DataFrame(columns=['court_no', 
                                      'court_historical_median_resolution', 
                                      'pending_cases_count'])

    result = filtered.merge(stats, on='court_no', how='left')
    result['court_historical_median_resolution'] = result[
        'court_historical_median_resolution'].fillna(GLOBAL_MEDIAN)
    result['pending_cases_count'] = result[
        'pending_cases_count'].fillna(GLOBAL_PENDING)

    return {
        "state_code": state_code,
        "dist_code": dist_code,
        "courts": result[['court_no', 'court_name',
                          'court_historical_median_resolution',
                          'pending_cases_count']].to_dict(orient='records')
    }

@app.get("/districts/{state_code}")
def get_districts(state_code: int):
    filtered = court_key[court_key['state_code'] == state_code][
        ['dist_code', 'district_name']
    ].drop_duplicates()
    return {"districts": filtered.to_dict(orient='records')}

@app.get("/states")
def get_states():
    filtered = court_key[['state_code', 'state_name']].drop_duplicates()
    return {"states": filtered.to_dict(orient='records')}
type_clean = pd.read_csv(os.path.join(BASE_DIR, 'data', 'lookups', 'type_clean.csv'))

@app.get("/case-types")
def get_case_types():
    commercial_types = type_clean[type_clean['is_commercial'] == True]
    return {
        "case_types": commercial_types[['type_name', 'type_canonical']].to_dict(orient='records')
    }
import traceback
from fastapi import HTTPException

@app.post("/classify")
def classify(input: ClassificationInput):
    try:
        return classify_case(input.description)

    except Exception as e:
        traceback.print_exc()

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )