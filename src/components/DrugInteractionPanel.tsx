import React from 'react';

interface InteractionData {
  description: string;
  severity: string;
  explanation?: string;
}

interface DrugInteractionPanelProps {
  interaction: InteractionData | null;
  loading: boolean;
  error: string | null;
}

const DrugInteractionPanel: React.FC<DrugInteractionPanelProps> = ({ interaction, loading, error }) => {
  return (
    <div className="w-full bg-white dark:bg-gray-900 rounded-lg shadow p-4 mt-4">
      <h3 className="font-bold text-lg mb-2">Drug Interaction Results</h3>
      {loading && <div className="text-blue-500">Checking interaction...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {!loading && !error && interaction && (
        <div>
          <div><b>Description:</b> {interaction.description}</div>
          <div><b>Severity:</b> {interaction.severity}</div>
          {interaction.explanation && <div><b>Explanation:</b> {interaction.explanation}</div>}
        </div>
      )}
      {!loading && !error && !interaction && (
        <div className="text-gray-500">No known interaction.</div>
      )}
    </div>
  );
};

export default DrugInteractionPanel;