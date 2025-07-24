"use client";
import React, { useState } from "react";
import DrugSearchBar from "@/components/DrugSearchBar";
import DrugDetailsCard, { DrugInfo } from "@/components/DrugDetailsCard";
import Molecule3DViewer from "@/components/Molecule3DViewer";
import DrugInteractionPanel from "@/components/DrugInteractionPanel";
import { getDrugInfo, getDrugSDF } from "@/lib/pubchem";
import { getDrugInteraction } from "@/lib/rxnav";

export default function PharmaScopePage() {
  // Drug 1 state
  const [drug1, setDrug1] = useState<DrugInfo | null>(null);
  const [sdf1, setSdf1] = useState<string | null>(null);
  // Drug 2 state
  const [drug2, setDrug2] = useState<DrugInfo | null>(null);
  const [sdf2, setSdf2] = useState<string | null>(null);
  // Interaction
  const [interaction, setInteraction] = useState<any>(null);
  const [interactionLoading, setInteractionLoading] = useState(false);
  const [interactionError, setInteractionError] = useState<string | null>(null);

  // Handlers for Drug 1
  const handleDrug1Search = async (query: string) => {
    setDrug1(null);
    setSdf1(null);
    setInteraction(null);
    setInteractionError(null);
    if (!query) return;
    try {
      const info = await getDrugInfo(query);
      setDrug1(info);
      const sdfData = await getDrugSDF(query);
      setSdf1(sdfData);
    } catch {
      setDrug1(null);
      setSdf1(null);
    }
  };

  // Handlers for Drug 2
  const handleDrug2Search = async (query: string) => {
    setDrug2(null);
    setSdf2(null);
    setInteraction(null);
    setInteractionError(null);
    if (!query) return;
    try {
      const info = await getDrugInfo(query);
      setDrug2(info);
      const sdfData = await getDrugSDF(query);
      setSdf2(sdfData);
    } catch {
      setDrug2(null);
      setSdf2(null);
    }
  };

  // Interaction check
  const handleInteractionCheck = async () => {
    if (!drug1 || !drug2) return;
    setInteractionLoading(true);
    setInteractionError(null);
    setInteraction(null);
    try {
      const result = await getDrugInteraction(
        drug1.brandName || "",
        drug2.brandName || ""
      );
      setInteraction(result);
    } catch (e: any) {
      setInteractionError(e.message || "Error fetching interaction");
    } finally {
      setInteractionLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="bg-blue-800 text-white shadow-lg py-4 px-6 flex items-center justify-center">
        <span className="text-2xl font-bold tracking-tight">
          PharmaScope: Drug Visualizer & Interaction Checker
        </span>
      </header>
      {/* Main Content */}
      <div className="flex-1 flex flex-row min-h-0">
        {/* Left Sidebar */}
        <aside className="w-[320px] bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 p-6 flex flex-col gap-4 shadow-md items-start">
          <h2 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-2">
            Drug 1
          </h2>
          <DrugSearchBar onSearch={handleDrug1Search} />
          <DrugDetailsCard drug={drug1} />
        </aside>
        {/* Center: 3D Viewer */}
        <main className="flex-1 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 p-6">
          <h2 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-4">
            3D Molecule Viewer
          </h2>
          <div className="w-full h-[500px] flex items-center justify-center">
            <Molecule3DViewer sdfData1={sdf1} sdfData2={sdf2} />
          </div>
        </main>
        {/* Right Sidebar */}
        <aside className="w-[320px] bg-white dark:bg-slate-800 border-l border-slate-200 dark:border-slate-700 p-6 flex flex-col gap-4 shadow-md items-start">
          <h2 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-2">
            Drug 2
          </h2>
          <DrugSearchBar onSearch={handleDrug2Search} />
          <DrugDetailsCard drug={drug2} />
          {drug1 && drug2 && (
            <div className="mt-4 w-full">
              <button
                className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold mb-2"
                onClick={handleInteractionCheck}
                disabled={interactionLoading}
              >
                {interactionLoading ? "Checking..." : "Check Interaction"}
              </button>
              <DrugInteractionPanel
                interaction={interaction}
                loading={interactionLoading}
                error={interactionError}
              />
            </div>
          )}
        </aside>
      </div>
      {/* Footer */}
      <footer className="w-full text-center p-4 text-xs text-slate-500 bg-white dark:bg-slate-900 border-t mt-4">
        PharmaScope &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}