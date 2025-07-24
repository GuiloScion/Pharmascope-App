import React, { useEffect, useRef } from 'react';

interface Molecule3DViewerProps {
  sdfData1: string | null;
  sdfData2?: string | null;
  label1?: string;
  label2?: string;
}

const SingleMolViewer: React.FC<{ sdf: string; color: string; label?: string }> = ({ sdf, color, label }) => {
  const viewerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!viewerRef.current) return;
    // @ts-ignore
    const $3Dmol = require('3dmol');
    viewerRef.current.innerHTML = "";
    const viewer = $3Dmol.createViewer(viewerRef.current, {
      backgroundColor: 'white',
      width: 300,
      height: 300,
    });
    viewer.addModel(sdf, 'sdf');
    viewer.setStyle({}, { stick: { color }, sphere: { scale: 0.3, color } });
    viewer.zoomTo();
    viewer.render();
    viewer.zoom(1.2, 1000);
  }, [sdf, color]);

  return (
    <div className="flex flex-col items-center">
      <div
        ref={viewerRef}
        style={{ width: 300, height: 300, position: "relative" }}
        className="bg-white rounded-lg shadow"
      />
      {label && <div className="mt-2 text-center font-medium text-blue-700">{label}</div>}
    </div>
  );
};

const Molecule3DViewer: React.FC<Molecule3DViewerProps> = ({ sdfData1, sdfData2, label1, label2 }) => {
  if (!sdfData1 && !sdfData2) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center bg-white rounded-lg shadow">
        <div className="text-slate-400 text-center p-8 w-full">
          Enter a drug name to view its molecule.
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-row items-center justify-center gap-12 w-full">
      {sdfData1 && <SingleMolViewer sdf={sdfData1} color="blue" label={label1} />}
      {sdfData2 && <SingleMolViewer sdf={sdfData2} color="red" label={label2} />}
    </div>
  );
};

export default Molecule3DViewer;