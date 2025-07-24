export async function getDrugInteraction(drug1: string, drug2: string) {
  const url = `https://rxnav.nlm.nih.gov/REST/interaction/list.json?names=${encodeURIComponent(drug1)}+${encodeURIComponent(drug2)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Interaction API error');
  const data = await res.json();
  // Parse interaction data
  const interactionPair = data?.fullInteractionTypeGroup?.[0]?.fullInteractionType?.[0]?.interactionPair?.[0];
  if (!interactionPair) return { description: "No known interaction.", severity: "none" };
  return {
    description: interactionPair.description,
    severity: interactionPair.severity,
    explanation: interactionPair.clinicalEffect || '',
  };
}