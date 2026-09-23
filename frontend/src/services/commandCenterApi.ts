export interface UserContext {
  id: number;
  fullName: string;
  role: string;
  department: string;
  designation: string;
  targetRole: string;
}

export interface CompetencyPulse {
  overallMastery: number;
  verifiedCount: number;
  totalTracked: number;
  resolutionProgress: number;
  pulseStatus: string;
}

export interface PriorityGap {
  competencyId: number;
  competencyName: string;
  domain: string;
  currentLevel: number;
  targetLevel: number;
  gapPercentage: number;
  priority: string;
}

export interface NextBestAction {
  id: number;
  title: string;
  description: string;
  whyThis: string;
  actionType: string;
  estimatedMinutes: number;
  actionRoute: string;
}

export interface RecentEvidence {
  id: number;
  title: string;
  category: string;
  provenance: string;
  confidenceScore: number;
  status: string;
  verifiedDateFormatted: string;
}

export interface ProgressData {
  overallProgressPercent: number;
  completedMilestones: number;
  totalMilestones: number;
  activeStreakDays: number;
}

export type CommandCenterReadState = 'loading' | 'empty' | 'success' | 'partial' | 'error' | 'provider-unavailable';

export interface CommandCenterData {
  state: CommandCenterReadState;
  stateMessage?: string;
  userContext?: UserContext;
  competencyPulse?: CompetencyPulse;
  priorityGap?: PriorityGap;
  nextBestAction?: NextBestAction;
  recentEvidence?: RecentEvidence[];
  progress?: ProgressData;
}

import { API_BASE_URL } from './apiConfig';

export async function fetchCommandCenterData(stateOverride?: string): Promise<CommandCenterData> {
  const queryParam = stateOverride && stateOverride !== 'live' ? '?state=' + encodeURIComponent(stateOverride) : '';
  const endpoints = [
    `${API_BASE_URL}/me/command-center${queryParam}`,
    '/me/command-center' + queryParam,
    '/api/v1/me/command-center' + queryParam,
  ];

  for (const endpoint of endpoints) {
    try {
      const res = await fetch(endpoint, {
        headers: { 'Accept': 'application/json' },
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // try next endpoint
    }
  }

  // Graceful degradation when network/backend service is not reached directly
  return {
    state: 'provider-unavailable',
    stateMessage: 'Backend API connection offline. Please ensure Spring Boot service is active on port 8080.',
  };
}
