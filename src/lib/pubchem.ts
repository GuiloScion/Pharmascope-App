export async function getDrugInfo(drugName: string) {
  // Fetch compound summary from PubChem
  const url = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(drugName)}/JSON`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Drug not found');
  const data = await res.json();
  const compound = data?.PC_Compounds?.[0];
  // Extract fields (brand, IUPAC, formula, weight, description, class, indications, side effects)
  // This is a stub; real extraction would parse the JSON structure
  return {
    brandName: drugName,
    iupacName: compound?.props?.find((p: any) => p.urn?.label === 'IUPAC Name')?.value?.sval || '',
    formula: compound?.props?.find((p: any) => p.urn?.label === 'Molecular Formula')?.value?.sval || '',
    weight: compound?.props?.find((p: any) => p.urn?.label === 'Molecular Weight')?.value?.fval?.toString() || '',
    description: '', // PubChem summary not always available in this endpoint
    drugClass: '',
    indications: '',
    sideEffects: '',
  };
}

export async function getDrugSDF(drugName: string) {
  const url = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(drugName)}/SDF`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('SDF not found');
  return await res.text();
}