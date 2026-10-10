/**
 * Domain section content. Source tags: [APP] Explic application landing and
 * source, [README] proposal-stage project README, [AUDIT] voice backend audit,
 * [FIG] voice research figures. Performance figures are intentionally not
 * published here until the final research documents confirm them.
 */

export type Reference = { id: number; text: string };

// Selected key references from the project's proposal documentation [README].
export const references: Reference[] = [
  { id: 1, text: "X. Wang et al., “ASVspoof 2019: A large-scale public database of synthesized, converted and replayed speech,” Computer Speech & Language, vol. 64, 2020." },
  { id: 2, text: "J. Jung et al., “AASIST: Audio Anti-Spoofing Using Integrated Spectro-Temporal Graph Attention Networks,” ICASSP, 2022." },
  { id: 3, text: "H. Tak et al., “End-to-End Anti-Spoofing with RawNet2,” ICASSP, 2021." },
  { id: 4, text: "A. Baevski et al., “wav2vec 2.0: A Framework for Self-Supervised Learning of Speech Representations,” NeurIPS, 2020." },
  { id: 5, text: "S. Chen et al., “WavLM: Large-Scale Self-Supervised Pre-Training for Full Stack Speech Processing,” IEEE JSTSP, 2022." },
  { id: 6, text: "P. Alku, “Glottal Wave Analysis with Pitch Synchronous Iterative Adaptive Inverse Filtering,” Speech Communication, 1992." },
  { id: 7, text: "V. Sanh et al., “DistilBERT, a distilled version of BERT: smaller, faster, cheaper and lighter,” arXiv, 2019." },
  { id: 8, text: "L. Dugan et al., “RAID: A Shared Benchmark for Robust Evaluation of Machine-Generated Text Detectors,” ACL, 2024." },
  { id: 9, text: "A. Creo and S. Pudasaini, “SilverSpeak: Evading AI-Generated Text Detectors Using Homoglyphs,” ACL GenAIDetect Workshop, 2025." },
  { id: 10, text: "W. Liang et al., “GPT Detectors are Biased Against Non-Native English Writers,” Patterns, 2023." },
  { id: 11, text: "M. Sundararajan et al., “Axiomatic Attribution for Deep Networks,” ICML, 2017." },
  { id: 12, text: "S. Abnar and W. Zuidema, “Quantifying Attention Flow in Transformers,” ACL, 2020." },
  { id: 13, text: "S. Lundberg and S.-I. Lee, “A Unified Approach to Interpreting Model Predictions,” NeurIPS, 2017." },
  { id: 14, text: "W. Samek et al., “Evaluating the Visualization of What a Deep Neural Network Has Learned,” IEEE TNNLS, 2017." },
  { id: 15, text: "Zhao et al., “FakeSound2: A Benchmark for Explainable and Generalizable Deepfake Sound Detection,” arXiv, 2025." },
  { id: 16, text: "Mersha et al., “Evaluating the Effectiveness of XAI Techniques for Encoder-Based Language Models,” arXiv, 2025." },
  { id: 17, text: "S. Yao et al., “ReAct: Synergizing Reasoning and Acting in Language Models,” ICLR, 2023." },
];

export const literature = [
  {
    title: "Traditional speech anti-spoofing",
    text: "Early countermeasures paired hand-crafted cepstral front-ends, such as linear-frequency cepstral coefficients (LFCC), with classical statistical back-ends. The ASVspoof challenge series established shared databases and protocols for comparing countermeasures against text-to-speech, voice-conversion, and replay attacks.",
    refs: [1],
  },
  {
    title: "Deep learning for synthetic speech detection",
    text: "Neural detectors learn spoofing cues directly from spectral representations or raw waveforms. End-to-end models such as RawNet2, and graph-attention models such as AASIST that relate spectral and temporal features, became widely used baselines.",
    refs: [2, 3],
  },
  {
    title: "Self-supervised speech representations",
    text: "Models pre-trained on large unlabelled speech corpora, including wav2vec 2.0 and WavLM, give contextual representations that can be fine-tuned for spoof detection, with the aim of capturing cues that transfer to unseen generators. Voice-source (glottal) analysis offers a physiologically motivated, complementary view.",
    refs: [4, 5, 6],
  },
  {
    title: "AI-generated text detection",
    text: "Text detectors range from statistical signals such as perplexity and burstiness to fine-tuned transformer classifiers. Benchmarks such as RAID test robustness across domains, generators, and attacks, while studies report evasion through homoglyph substitution and bias against non-native English writers.",
    refs: [7, 8, 9, 10],
  },
  {
    title: "Explainable AI approaches",
    text: "Integrated gradients, attention rollout, and Shapley-value explanations (SHAP) attribute a prediction to its inputs. Perturbation measures such as AOPC test whether an explanation is faithful to the model rather than merely plausible.",
    refs: [11, 12, 13, 14, 15, 16],
  },
];

export const researchGaps = [
  {
    title: "Generalisation to unseen content",
    text: "Detectors trained on a fixed set of generators may not transfer to newer synthesis methods, recording channels, or real-world conditions. Cross-dataset evaluation is a core motivation, not an afterthought.",
  },
  {
    title: "Complementary detection methods",
    text: "Many systems compress all evidence into one learned embedding. Spectral, spectro-temporal, self-supervised, physiological, semantic, and stylistic cues may capture different artefacts, which motivates combining independent branches.",
  },
  {
    title: "Interpretable decisions",
    text: "A probability alone does not show where an anomaly occurs or what suggests synthetic origin. Explanations also need checking, so that highlighted evidence reflects the model's actual behaviour.",
  },
  {
    title: "Honest uncertainty",
    text: "When detection signals disagree, forcing a confident label hides risk. Reporting conflict explicitly, for example as Mixed Content for text, is part of the research question.",
  },
];

export const researchProblem = {
  context:
    "Synthetic speech and machine-generated text now challenge both human judgement and many automated detectors. Existing detectors often reduce evidence to one opaque score, can degrade on unfamiliar or deliberately modified content, and seldom explain their decisions.",
  statement:
    "How can complementary machine learning approaches classify AI-generated voice and text robustly, including content from unseen generators and manipulated inputs, while giving interpretable, verifiable evidence for each decision?",
};

export const objectives = [
  {
    code: "O1",
    title: "Classify synthetic content",
    text: "Develop classifiers that separate genuine from AI-generated speech and text.",
    explain: false,
  },
  {
    code: "O2",
    title: "Compare complementary models",
    text: "Study spectral, spectro-temporal, self-supervised, and glottal voice branches, and semantic and stylometric text branches, as independent evidence.",
    explain: false,
  },
  {
    code: "O3",
    title: "Study generalisation",
    text: "Evaluate behaviour on datasets, generators, and conditions that differ from training.",
    explain: false,
  },
  {
    code: "O4",
    title: "Explain each classification",
    text: "Produce temporal, acoustic-feature, and word-level explanations, and check them for consistency and faithfulness.",
    explain: true,
  },
  {
    code: "O5",
    title: "Evaluate systematically",
    text: "Use established measures: EER, F1-score, and ROC-AUC for detection; AOPC and IoU for explanations.",
    explain: false,
  },
];

export const pipelineStages = [
  { label: "Input", detail: "A recording or a passage of text" },
  { label: "Preprocessing", detail: "Audio standardisation or text sanitisation" },
  { label: "Detection branches", detail: "Independent models score the input" },
  { label: "Combination", detail: "Branch scores merged into one decision" },
  { label: "Explanation", detail: "Evidence localised and attributed" },
  { label: "Result", detail: "A label with inspectable evidence" },
];

// Research model names [AUDIT]; the Explic application labels them as
// LFCC CNN/TCN, AASIST, SSL Sequence, and Glottal Features [APP].
export const voiceBranches = [
  { name: "CNN-V2", family: "Spectral", appName: "LFCC CNN/TCN" },
  { name: "AASIST-Light-V2", family: "Spectro-temporal graph", appName: "AASIST" },
  { name: "XLS-R + Mamba", family: "Self-supervised", appName: "SSL Sequence" },
  { name: "Glottal analysis", family: "Voice source", appName: "Glottal Features" },
];

export const voiceExplainability = [
  { kind: "Temporal", title: "Attention rollout", detail: "XLS-R attention shows which moments drove the result" },
  { kind: "Acoustic", title: "Surrogate + SHAP", detail: "Auxiliary evidence from physical acoustic features" },
  { kind: "Check", title: "IoU consistency", detail: "Do the two kinds of evidence agree in time?" },
  { kind: "Output", title: "Deterministic report", detail: "Evidence-referenced, reproducible summary" },
];

// Text pipeline as implemented in the Explic application [APP].
export const textBranches = [
  { name: "DeBERTa-v3-large", family: "Semantic", detail: "Meaning, argument structure, and context" },
  { name: "XGBoost", family: "Stylometric", detail: "30 lexical, syntactic, pragmatic, and discourse features" },
];

export const textExplainability = [
  { kind: "Attribution", title: "Attention Rollout", detail: "How attention compounds across layers" },
  { kind: "Attribution", title: "Integrated Gradients", detail: "Prediction attributed back to each token" },
  { kind: "Fusion", title: "Hadamard fusion", detail: "Both signals multiplied element-wise" },
  { kind: "Output", title: "Plain-English explanation", detail: "Noise words filtered, computed locally" },
];

export const methodologyNotes = [
  {
    title: "Audio preprocessing",
    text: "Every recording is decoded to a shared mono 16 kHz signal. Each branch then applies its own windowing, normalisation, and padding, so that every model receives input in the form it was trained on.",
  },
  {
    title: "Score-level fusion",
    text: "Branch spoof probabilities are combined as a convex weighted sum: weights are non-negative and sum to one, so the fused score stays readable as a blend of branch evidence.",
  },
  {
    title: "Voice explainability",
    text: "The explanation layer reads branch internals through hooks and cannot change the prediction. Temporal and acoustic evidence are produced separately, then compared for agreement in time.",
  },
  {
    title: "Text sanitisation",
    text: "Before classification, input is checked against adversarial and formatting manipulation such as zero-width characters and homoglyphs, across ten attack categories tested in the research.",
  },
  {
    title: "Conflict-aware output",
    text: "A conflict score (CSS-v2) measures disagreement between the semantic and stylometric branches. Strong disagreement produces Mixed Content instead of a confident-looking label.",
  },
  {
    title: "Ethical scope",
    text: "Only publicly licensed research datasets are used, no private voice or text data is collected, and the system is built for detection only. It has no synthesis or impersonation function.",
  },
];

export const datasets = [
  { name: "ASVspoof 2019 LA", modality: "Voice" },
  { name: "ASVspoof 2021 LA", modality: "Voice" },
  { name: "WaveFake", modality: "Voice" },
  { name: "PartialSpoof", modality: "Voice" },
  { name: "In-the-Wild", modality: "Voice" },
  { name: "FakeSound2", modality: "Voice XAI" },
  { name: "RAID", modality: "Text" },
  { name: "ai-text-detection-pile", modality: "Text" },
];

export const technologyGroups = [
  { group: "Modelling", items: ["Python", "PyTorch", "Hugging Face Transformers", "scikit-learn", "XGBoost"] },
  { group: "Signal and language", items: ["Librosa", "Parselmouth (Praat)", "NLTK", "spaCy"] },
  { group: "Explainability", items: ["SHAP", "Captum", "Attention rollout", "Integrated gradients"] },
  { group: "System", items: ["FastAPI", "MongoDB", "Next.js", "React", "TypeScript", "REST and MCP interfaces"] },
];
