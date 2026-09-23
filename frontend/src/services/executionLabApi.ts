export interface Assessment {
    id: number;
    title: string;
    description: string;
    level: string;
}

export interface AssessmentAttempt {
    id: number;
    state: string;
    score?: number;
}

export interface SubmitMCQRequest {
    answers: Record<number, string>;
}

export interface SubmitOCRRequest {
    simulatedExtractedText: string;
    simulatedConfidence: number;
}

import { API_BASE_URL } from './apiConfig';

const API_BASE = `${API_BASE_URL}/api/execution-lab`;

export async function fetchAssessments(): Promise<Assessment[]> {
    const res = await fetch(`${API_BASE}/assessments`);
    if (!res.ok) throw new Error('Failed to fetch assessments');
    return res.json();
}

export async function startAttempt(userId: number, assessmentId: number): Promise<AssessmentAttempt> {
    const res = await fetch(`${API_BASE}/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, assessmentId })
    });
    if (!res.ok) throw new Error('Failed to start attempt');
    return res.json();
}

export async function submitMCQ(attemptId: number, request: SubmitMCQRequest): Promise<AssessmentAttempt> {
    const res = await fetch(`${API_BASE}/${attemptId}/submit-mcq`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
    });
    if (!res.ok) throw new Error('Failed to submit MCQ');
    return res.json();
}

export async function submitOCR(attemptId: number, request: SubmitOCRRequest): Promise<AssessmentAttempt> {
    const res = await fetch(`${API_BASE}/${attemptId}/submit-ocr`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
    });
    if (!res.ok) throw new Error('Failed to submit OCR');
    return res.json();
}
