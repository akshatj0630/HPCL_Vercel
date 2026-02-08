export function validateCompanyProfile(company) {
  const required = ['canonical_name', 'total_signals'];
  const missing = required.filter(field => !company[field]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required fields: ${missing.join(', ')}`);
  }
  
  return true;
}

export function validateLead(lead) {
  const required = ['lead_id', 'company_name', 'lead_score'];
  const missing = required.filter(field => !lead[field]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required fields: ${missing.join(', ')}`);
  }
  
  // Validate score range
  if (lead.lead_score < 0 || lead.lead_score > 100) {
    throw new Error('Lead score must be between 0-100');
  }
  
  return true;
}

export function validateSummary(summary) {
  const required = ['total_leads', 'total_companies'];
  const missing = required.filter(field => !summary[field]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required fields: ${missing.join(', ')}`);
  }
  
  return true;
}
