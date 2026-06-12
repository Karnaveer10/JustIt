import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { HeroSection } from "./src/components/HeroSection.jsx";
import { HowItWorksSection } from "./src/components/HowItWorksSection.jsx";
import { PredictionForm } from "./src/components/PredictionForm.jsx";
import { ResultsSection } from "./src/components/ResultsSection.jsx";
import { API_BASE_URL, FALLBACK_STATES } from "./src/justiceiq/constants.js";
import { fetchJson, getQuarter, inferTypeFromDescription } from "./src/justiceiq/utils.js";

export default function App() {
  const [states, setStates] = useState(FALLBACK_STATES);
  const [districts, setDistricts] = useState([]);
  const [courts, setCourts] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedCourt, setSelectedCourt] = useState("");
  const [caseDescription, setCaseDescription] = useState("");
  const [filingDate, setFilingDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [filingYear, setFilingYear] = useState(new Date().getFullYear());
  const [filingQuarter, setFilingQuarter] = useState(getQuarter(new Date().toISOString().slice(0, 10)));
  const [disputeTypeLabel, setDisputeTypeLabel] = useState("");
  const [prediction, setPrediction] = useState(null);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingCourts, setLoadingCourts] = useState(false);
  const [predicting, setPredicting] = useState(false);
  const [error, setError] = useState("");
  const [courtDropdownOpen, setCourtDropdownOpen] = useState(false);

  const resultsRef = useRef(null);
  const formRef = useRef(null);
  const courtDropdownRef = useRef(null);

  const selectedCourtMeta = useMemo(
    () => courts.find((court) => String(court.court_no) === String(selectedCourt)) || null,
    [courts, selectedCourt]
  );

  const formValues = {
    stateCode: selectedState,
    districtCode: selectedDistrict,
    courtNo: selectedCourt,
    caseDescription,
    filingDate,
    filingYear,
    filingQuarter,
    disputeTypeLabel,
    loadingStates,
    loadingDistricts,
    loadingCourts,
  };

  const loadStates = useCallback(async () => {
    setLoadingStates(true);
    try {
      const data = await fetchJson(`${API_BASE_URL}/states`);
      const apiStates = Array.isArray(data?.states) ? data.states : [];
      if (apiStates.length > 0) {
        const normalized = apiStates
          .map((item) => ({
            code: Number(item.state_code ?? item.code),
            name: item.state_name ?? item.name,
          }))
          .filter((item) => item.code && item.name)
          .sort((a, b) => a.code - b.code);
        setStates(normalized);
      } else {
        setStates(FALLBACK_STATES);
      }
    } catch {
      setStates(FALLBACK_STATES);
    } finally {
      setLoadingStates(false);
    }
  }, []);

  useEffect(() => {
    loadStates();
  }, [loadStates]);

  useEffect(() => {
    function handleOutsideClick(event) {
      if (courtDropdownRef.current && !courtDropdownRef.current.contains(event.target)) {
        setCourtDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  useEffect(() => {
    const numericState = Number(selectedState);
    if (!numericState) {
      setLoadingDistricts(false);
      setLoadingCourts(false);
      setDistricts([]);
      setCourts([]);
      setSelectedDistrict("");
      setSelectedCourt("");
      setCourtDropdownOpen(false);
      return;
    }

    let cancelled = false;
    setLoadingDistricts(true);
    setLoadingCourts(true);
    setDistricts([]);
    setCourts([]);
    setSelectedDistrict("");
    setSelectedCourt("");
    setCourtDropdownOpen(false);

    (async () => {
      try {
        const data = await fetchJson(`${API_BASE_URL}/districts/${numericState}`);
        const nextDistricts = Array.isArray(data?.districts) ? data.districts : [];
        if (!cancelled) {
          setDistricts(
            nextDistricts
              .map((item) => ({
                dist_code: Number(item.dist_code),
                district_name: item.district_name,
              }))
              .filter((item) => item.dist_code && item.district_name)
              .sort((a, b) => a.dist_code - b.dist_code)
          );
        }
      } catch {
        if (!cancelled) setDistricts([]);
      } finally {
        if (!cancelled) setLoadingDistricts(false);
      }
      if (!cancelled) setLoadingCourts(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [selectedState]);

  useEffect(() => {
    const numericState = Number(selectedState);
    const numericDistrict = Number(selectedDistrict);
    if (!numericState || !numericDistrict) {
      setLoadingCourts(false);
      setCourts([]);
      setSelectedCourt("");
      setCourtDropdownOpen(false);
      return;
    }

    let cancelled = false;
    setLoadingCourts(true);
    setCourts([]);
    setSelectedCourt("");
    setCourtDropdownOpen(false);

    (async () => {
      try {
        const data = await fetchJson(`${API_BASE_URL}/courts/${numericState}/${numericDistrict}`);
        const nextCourts = Array.isArray(data?.courts) ? data.courts : [];
        if (!cancelled) {
          setCourts(
            nextCourts
              .map((item) => ({
                court_no: Number(item.court_no),
                court_name: item.court_name,
                court_historical_median_resolution: Number(item.court_historical_median_resolution),
                pending_cases_count: Number(item.pending_cases_count),
              }))
              .filter((item) => item.court_no && item.court_name)
              .sort((a, b) => a.court_no - b.court_no)
          );
        }
      } catch {
        if (!cancelled) setCourts([]);
      } finally {
        if (!cancelled) setLoadingCourts(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [selectedState, selectedDistrict]);

  useEffect(() => {
    if (filingDate) {
      setFilingYear(new Date(`${filingDate}T00:00:00`).getFullYear());
      setFilingQuarter(getQuarter(filingDate));
    }
  }, [filingDate]);

  const handleDescriptionChange = useCallback((value) => {
    setCaseDescription(value);
    setPrediction(null);
    setError("");
    const trimmed = value.trim();
    setDisputeTypeLabel(trimmed ? inferTypeFromDescription(trimmed).label : "");
  }, []);

  const handleDateChange = useCallback((value) => {
    setFilingDate(value);
    setPrediction(null);
    setError("");
  }, []);

  const handleAnalyze = useCallback(async () => {
    if (!selectedState || !selectedDistrict || !selectedCourt || !caseDescription.trim()) {
      return;
    }

    setPredicting(true);
    setError("");
    setPrediction(null);

    try {
      const inferred = inferTypeFromDescription(caseDescription);
      setDisputeTypeLabel(inferred.label);

      // TODO: replace this hardcoded judge lookup with the actual judge-position resolver once it exists.
      const payload = {
        state_code: Number(selectedState),
        dist_code: Number(selectedDistrict),
        court_no: Number(selectedCourt),
        judge_position: "civil judge senior division",
        type_name: inferred.code || 3983,
        filing_year: filingYear,
        filing_quarter: filingQuarter,
      };

      const data = await fetchJson(`${API_BASE_URL}/predict`, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      setPrediction(data);
      requestAnimationFrame(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    } catch {
      setError("Unable to analyze at this time. Please try again.");
    } finally {
      setPredicting(false);
    }
  }, [caseDescription, filingQuarter, filingYear, selectedCourt, selectedDistrict, selectedState]);

  const onStateChange = useCallback((value) => {
    setSelectedState(value);
    setPrediction(null);
    setError("");
  }, []);

  const onDistrictChange = useCallback((value) => {
    setSelectedDistrict(value);
    setPrediction(null);
    setError("");
  }, []);

  const onCourtChange = useCallback((value) => {
    setSelectedCourt(value);
    setPrediction(null);
    setError("");
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(232,115,42,0.06),transparent_20%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.04),transparent_22%)]" />
      <HeroSection onAnalyzeClick={() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })} />
      <HowItWorksSection />
      <div ref={formRef}>
        <PredictionForm
          states={states}
          districts={districts}
          courts={courts}
          values={formValues}
          onStateChange={onStateChange}
          onDistrictChange={onDistrictChange}
          onCourtChange={onCourtChange}
          onDescriptionChange={handleDescriptionChange}
          onDateChange={handleDateChange}
          onAnalyze={handleAnalyze}
          predicting={predicting}
          error={error}
          courtDropdownOpen={courtDropdownOpen}
          setCourtDropdownOpen={setCourtDropdownOpen}
          dropdownRef={courtDropdownRef}
        />
      </div>
      <div ref={resultsRef}>
        <ResultsSection
          result={prediction}
          selectedCourt={selectedCourtMeta}
          courts={courts}
          selectedCourtNo={selectedCourt}
        />
      </div>
      <footer className="border-t border-white/5 px-6 py-10 text-center text-sm text-slate-500 sm:px-8 lg:px-10">
        JusticeIQ helps corporate teams compare jurisdiction speed, delay drivers, and resolution timelines with a
        data-first workflow.
      </footer>
    </div>
  );
}
