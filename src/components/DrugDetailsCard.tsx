import React from 'react';

export interface DrugInfo {
  brandName?: string;
  iupacName?: string;
  formula?: string;
  weight?: string;
  description?: string;
  drugClass?: string;
  indications?: string;
  sideEffects?: string;
}

interface DrugDetailsCardProps {
  drug: DrugInfo | null;
}

const DrugDetailsCard: React.FC<DrugDetailsCardProps> = ({ drug }) => {
  if (!drug) return (
    <div className="rounded border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 px-4 py-2 text-center text-slate-400 text-sm">
      Enter a drug name above.
    </div>
  );
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-4 w-full">
      <h2 className="text-xl font-bold mb-2 text-blue-700 dark:text-blue-300">{drug.brandName || 'Drug Details'}</h2>
      <ul className="text-sm space-y-1">
        {drug.iupacName && <li><b>IUPAC:</b> {drug.iupacName}</li>}
        {drug.formula && <li><b>Formula:</b> {drug.formula}</li>}
        {drug.weight && <li><b>Molecular Weight:</b> {drug.weight}</li>}
        {drug.description && <li><b>Description:</b> {drug.description}</li>}
        {drug.drugClass && <li><b>Class:</b> {drug.drugClass}</li>}
        {drug.indications && <li><b>Indications:</b> {drug.indications}</li>}
        {drug.sideEffects && <li><b>Side Effects:</b> {drug.sideEffects}</li>}
      </ul>
    </div>
  );
};

export default DrugDetailsCard;