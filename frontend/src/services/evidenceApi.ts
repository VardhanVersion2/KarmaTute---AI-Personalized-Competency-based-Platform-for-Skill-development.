import { type EvidenceType } from '../types/competency';

export interface EvidenceRecord {
  id?: number;
  userId: number;
  competencyId: number;
  type: EvidenceType;
  source: string;
  sourceRef?: string;
  score: number;
  normalizedScore: number;
  confidence: number;
  provenance: string;
  reviewStatus?: string;
  timestamp?: string;
  engineVersion?: string;
  ruleVersion?: string;
}

export interface CompetencySnapshot {
  id: number;
  competencyId: number;
  current: number;
  target: number;
  gap: number;
  confidence: number;
  evidenceIds: string;
  engineVersion: string;
  ruleVersion: string;
  timestamp: string;
}

import { API_BASE_URL } from './apiConfig';

const API = `${API_BASE_URL}/api/evidence`;

async function api<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', ...options?.headers },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`API error ${res.status}: ${text}`);
  }
  return res.json();
}

export async function submitEvidence(record: EvidenceRecord): Promise<EvidenceRecord> {
  return api<EvidenceRecord>(API, { method: 'POST', body: JSON.stringify(record) });
}

export async function getUserEvidence(userId: number): Promise<EvidenceRecord[]> {
  return api<EvidenceRecord[]>(`${API}/user/${userId}`);
}

export async function getCompetencySnapshots(userId: number): Promise<CompetencySnapshot[]> {
  return api<CompetencySnapshot[]>(`${API}/competency-snapshot/user/${userId}`);
}

export async function getCompetencyHistory(userId: number, competencyId: number): Promise<CompetencySnapshot[]> {
  return api<CompetencySnapshot[]>(`${API}/competency-snapshot/user/${userId}/competency/${competencyId}`);
}
