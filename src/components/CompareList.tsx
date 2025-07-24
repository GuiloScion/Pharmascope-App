import React from 'react';
import type { DrugInfo } from './DrugDetailsCard';

interface CompareListProps {
  drugs: DrugInfo[];
  onRemove: (index: number) => void;
}

const CompareList: React.FC<CompareListProps> = ({ drugs, onRemove }) => {
  return (
    <div className="w-full max-w-md space-y-2">
      <h3 className="font-bold text-lg mb-2">Comparison List</h3>
      {drugs.length === 0 && <div className="text-gray-500">No drugs saved.</div>}
      {drugs.map((drug, idx) => (
        <details key={idx} className="bg-gray-100 dark:bg-gray-800 rounded p-2">
          <summary className="cursor-pointer font-semibold flex justify-between items-center">
            {drug.brandName || drug.iupacName || 'Drug'}
            <button onClick={() => onRemove(idx)} className="ml-2 text-red-500 hover:underline">Remove</button>
          </summary>
          <ul className="text-xs mt-2 space-y-1">
            {drug.iupacName && <li><b>IUPAC:</b> {drug.iupacName}</li>}
            {drug.formula && <li><b>Formula:</b> {drug.formula}</li>}
            {drug.weight && <li><b>Molecular Weight:</b> {drug.weight}</li>}
            {drug.description && <li><b>Description:</b> {drug.description}</li>}
            {drug.drugClass && <li><b>Class:</b> {drug.drugClass}</li>}
            {drug.indications && <li><b>Indications:</b> {drug.indications}</li>}
            {drug.sideEffects && <li><b>Side Effects:</b> {drug.sideEffects}</li>}
          </ul>
        </details>
      ))}
    </div>
  );
};

export default CompareList;