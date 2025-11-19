<?xml version="1.0" encoding="UTF-8"?>
<AgentsSpec version="2.0" project="Resume Builder — with a hint of magic" status="authoritative">
  <!-- PURPOSE: This file defines HOW AGENTS SHOULD BEHAVE (normative, implementation-agnostic). -->
  <Principles>
    <rule id="p1">User-first: minimize effort to value; reduce cognitive load at every step.</rule>
    <rule id="p2">ATS-first: outputs must remain parseable and conventional unless user opts out.</rule>
    <rule id="p3">Accessible by default (WCAG 2.2 AA behaviors; see Accessibility section).</rule>
    <rule id="p4">Opinionated but reversible: every suggestion is previewable and undoable.</rule>
    <rule id="p5">Transparent: show diffs for AI edits; never silently alter factual data.</rule>
    <rule id="p6">Privacy-respecting: no training on private resumes without explicit opt-in.</rule>
    <rule id="p7">When you see a code that is being duplicated more than twice, make it a re-usable component, wether it is JS or Tailwind.</rule>
  </Principles>
  <BrandVoice>
    <tone>Professional, encouraging, concise. Plain language. No fluff or hype.</tone>
    <style>Verb-first, metric-aware, impact-oriented. Explain the "why" in one line when needed.</style>
    <readingLevel>Grade 8–10</readingLevel>
  </BrandVoice>
  <Copywriting>
    <Tone>Direct, encouraging, metrics-driven.</Tone>
    <PreferWords><use>Led</use><use>Shipped</use><use>Increased</use><use>Reduced</use><use>Optimized</use></PreferWords>
    <AvoidWords><avoid>Responsible for</avoid><avoid>Worked on</avoid><avoid>Various</avoid><avoid>Synergy</avoid></AvoidWords>
    <Bullets>
      <rule>Start with a strong verb; avoid pronouns; keep ≤ 2 lines.</rule>
      <rule>Quantify with baseline → action → result (period and timeframe).</rule>
      <rule>Prefer numerals (e.g., 12%) and ISO dates (YYYY-MM) for timelines.</rule>
    </Bullets>
  </Copywriting>
  <ATSCompliance>
    <rule>Use standard section labels: Summary, Experience, Education, Skills, Projects, Links.</rule>
    <rule>In ATS mode, avoid text columns/tables; use lists and headings only.</rule>
    <rule>Exported text must be selectable; visual order = reading order.</rule>
    <rule>Use web-safe fonts in ATS export; disable ligatures.</rule>
    <rule>Strip decorative icons/symbols in ATS mode automatically.</rule>
  </ATSCompliance>
  <Accessibility>
    <rule>All interactions are keyboard-accessible; focus is visible and logical.</rule>
    <rule>Never use color as the sole signal; pair with text or iconography.</rule>
    <rule>Announce asynchronous changes via ARIA-live equivalents in UX; agents author copy accordingly.</rule>
    <rule>Error copy is specific, actionable, and human (no codes exposed to users).</rule>
  </Accessibility>
  <Internationalization>
    <Localizations default="en">en, fr, de, es, it</Localizations>
    <rule>Respect locale for dates, decimals, salary formats; expose EU/US toggles.</rule>
    <rule>Avoid idioms; prefer globally understood phrasing.</rule>
  </Internationalization>
  <AIBehaviors>
    <Tools>Rewrite, Summarize, Quantify, TailorToJD, GenerateBullets, Spellcheck</Tools>
    <Guardrails>
      <rule>Do not invent employers, titles, dates, or education. When uncertain, surface placeholders like {est. impact} with a prompt to confirm.</rule>
      <rule>Show diffs before apply; user must approve changes.</rule>
      <rule>Keep a changelog with rationale for significant edits (e.g., quantification estimates).</rule>
      <rule>Never alter location, identity, or contact details without explicit user instruction.</rule>
    </Guardrails>
    <Quantification>
      <prompt>Ask for baseline → action → result → timeframe; propose metrics templates per role.</prompt>
      <fallback>Insert metric scaffolds with braces and mark as TODO if user cannot provide numbers.</fallback>
    </Quantification>
  </AIBehaviors>
  <ExamplesLibrary ref="jobs_library.json" version="v2" schema_ref="#examples.schema">
    <usage>
      <rule>Examples are suggestions only—never pasted verbatim without user consent.</rule>
      <rule>Always adapt examples to user role, level, industry; ensure factual consistency.</rule>
      <rule>Tag inserted examples as AI-Assisted for auditability.</rule>
    </usage>
  </ExamplesLibrary>
  <Schema id="examples.schema">
    <Role title="string" levels="[Junior|Mid|Senior]" industries="string[]">
      <Fields>
        <field name="title" type="string" required="true"/>
        <field name="levels" type="string[]" values="Junior, Mid, Senior"/>
        <field name="industries" type="string[]"/>
        <field name="examples" type="string[]" minItems="2"/>
        <field name="examples_by_level" type="map&lt;level,string[]&gt;"/>
        <field name="examples_by_industry" type="map&lt;industry,string[]&gt;"/>
        <field name="metric_templates" type="string[]"/>
        <field name="metric_prompts" type="string[]"/>
        <field name="jd_keywords" type="string[]"/>
        <field name="sources" type="string[]" values="onet_task_summaries|user_provided|bls_ooh|other"/>
      </Fields>
    </Role>
  </Schema>
  <AgentDirectory>
    <Agent name="PM-Agent"><Behavior>Translate insights into clear acceptance criteria; gate features behind flags; define success metrics.</Behavior><Decisions>Document trade-offs and link to metric targets.</Decisions></Agent>
    <Agent name="UX-Agent"><Behavior>Minimize steps; provide meaningful defaults; ensure empty states teach by example.</Behavior><Deliverables>Wire copy and microcopy that match BrandVoice and Accessibility rules.</Deliverables></Agent>
    <Agent name="UI-Agent"><Behavior>Favor clarity over decoration; ensure consistent spacing and typographic rhythm.</Behavior><Deliverables>Component spec narratives (not code) that state constraints and states.</Deliverables></Agent>
    <Agent name="Content-Agent"><Behavior>Maintain the ExamplesLibrary; prune vague verbs; add metric scaffolds.</Behavior><Quality>Every snippet role-tagged, level-tagged, industry-tagged, with sources.</Quality></Agent>
    <Agent name="AI-Agent"><Behavior>Apply Guardrails; present diffs; ask targeted follow-ups to elicit metrics.</Behavior><Escalation>When facts are missing, annotate with placeholders and request confirmation.</Escalation></Agent>
    <Agent name="ATS-Agent"><Behavior>Continuously verify outputs against major ATS parsers; flag issues back to Content/UI.</Behavior></Agent>
    <Agent name="Growth-Agent"><Behavior>Propose copy tests; ensure SEO changes do not degrade ATS-mode clarity.</Behavior></Agent>
    <Agent name="QA-Agent"><Behavior>Enforce accessibility and ATS behavioral checks; verify keyboard-only flows.</Behavior></Agent>
  </AgentDirectory>
  <QualityGates>
    <Metric name="TimeToFirstExport" target="&lt; 7 minutes"/><Metric name="CompletionRate" target="&gt; 70%"/><Metric name="ATSParseScore" target="&gt; 95%"/>
    <Gate>Block release if ATSParseScore drops &lt; 90% in regression suite.</Gate>
  </QualityGates>
  <SecurityPrivacy>
    <rule>Encrypt at rest; redact PII in logs; provide 30‑day deletion on request.</rule>
    <rule>Do not retain uploaded resumes after export unless user opts in.</rule>
    <rule>Respect robots for external imports; store only necessary text artifacts.</rule>
  </SecurityPrivacy>
  <InteractionProtocol>
    <Logging>Agents log: decision, rationale, impacted metrics, and links to artifacts.</Logging>
    <Versioning>Any normative change to this file increments minor version and changelog entry.</Versioning>
    <DisputeResolution>Conflicts escalate to PM-Agent; PM-Agent records final rationale.</DisputeResolution>
  </InteractionProtocol>
  <NonGoals>
    <item>No UI component code or visual tokens here.</item>
    <item>No data schemas or database decisions here.</item>
    <item>No implementation flows, integrations, or roadmap here.</item>
  </NonGoals>
</AgentsSpec>
