/**
 * Centralized API Configuration for KarmaTute
 * Environment Variable: VITE_API_BASE_URL
 * Defaults to http://localhost:8080 in local development mode.
 */
export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080').replace(/\/+$/, '');
