import re

with open('/home/mario/EngelCurvesResearch/app/page.tsx', 'r') as f:
    content = f.read()

import_stmt = "import { initialLibraryReports } from '../data/companyReports';\n"
if "initialLibraryReports" not in content:
    content = content.replace(
        "import { globalFoodElasticity, indiaScenarios } from '../data/globalAnalysis';",
        "import { globalFoodElasticity, indiaScenarios } from '../data/globalAnalysis';\nimport { initialLibraryReports } from '../data/companyReports';"
    )

newPending = """        {activeTab === 'library' && (
          <div className="py-12 text-center text-obs-muted border border-dashed border-obs-border rounded-lg bg-obs-bg/30">
            Module [library] is pending initialization.
          </div>
        )}"""

libraryTabContent = """
        {activeTab === 'library' && (
          <section className="animate-in fade-in duration-500">
            <h2 className="text-xl font-semibold mb-4">Research Library</h2>
            <p className="text-obs-muted text-sm mb-8 leading-relaxed">
              Archived Deep Research pipelines for individual equities within the Engel Curves macro thesis.
            </p>

            <Callout title="Persistence Note">
              <p>These reports are pre-computed results from our local agent swarms (company-research-deep pipeline). In a fully live environment, they represent the output saved to localStorage after a successful 7-stage SSE pipeline.</p>
              <div className="mt-2">
                <EvidenceLabel type="OBS" /> SEC Filings / Earnings
                <EvidenceLabel type="INF" /> GORILLA Execution Scoring
              </div>
            </Callout>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              {initialLibraryReports.map((report) => (
                <div key={report.id} className="border border-obs-border rounded p-5 hover:border-obs-fg transition-colors bg-white">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{report.ticker}</h3>
                      <span className="text-xs text-obs-muted">{report.name} &middot; {report.country}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold font-mono">{report.gorillaScore}</div>
                      <div className="text-[10px] uppercase tracking-wider text-obs-muted font-bold">{report.gorillaVerdict}</div>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed text-obs-fg mt-4 mb-4">
                    {report.thesis}
                  </p>
                  <div className="text-xs text-obs-muted pt-4 border-t border-obs-border/50">
                    Generated: {report.date}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
"""

updatedContent = content.replace(newPending, libraryTabContent)

with open('/home/mario/EngelCurvesResearch/app/page.tsx', 'w') as f:
    f.write(updatedContent)

