import React, { createContext, useContext, useState } from 'react';

export type PageId =
  | 'command-center'
  | 'skill-intelligence'
  | 'execution-lab'
  | 'growth-proof'
  | 'admin'
  | 'data-chamber'; // Added Data Chamber

export type UserRole = 'ROLE_LEARNER' | 'ROLE_ADMIN' | 'ROLE_INSTRUCTOR';

export interface UserProfile {
  designation: string;
  department: string;
  responsibilities: string;
  challenges: string;
  topics: string;
  learningModality: string;
  hasUploadedEvidence: boolean;
}

interface AppContextType {
  currentPage: PageId;
  setCurrentPage: (page: PageId) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  isAdmin: boolean;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
  hasCompletedOnboarding: boolean;
  setHasCompletedOnboarding: (val: boolean) => void;
  userProfile: UserProfile | null;
  setUserProfile: (profile: UserProfile | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const PAGE_PATHS: Record<PageId, string> = {
  'command-center': '/',
  'skill-intelligence': '/skill-intelligence',
  'execution-lab': '/execution-lab',
  'growth-proof': '/growth-proof',
  admin: '/admin',
  'data-chamber': '/data-chamber',
};

function pageFromPathname(pathname: string): PageId {
  const entry = Object.entries(PAGE_PATHS).find(([, path]) => path === pathname);
  return (entry?.[0] as PageId | undefined) ?? 'command-center';
}

export function AppContextProvider({ children }: { children: React.ReactNode }) {
  const [currentPage, setCurrentPageState] = useState<PageId>(() => pageFromPathname(window.location.pathname));
  const [userRole, setUserRole] = useState<UserRole>('ROLE_LEARNER');
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  // Use localStorage to persist auth state temporarily for demo
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('karmatute_auth') === 'true';
  });

  const [hasCompletedOnboarding, setHasCompletedOnboardingState] = useState<boolean>(() => {
    return localStorage.getItem('karmatute_onboarding') === 'true';
  });

  const [userProfileState, setUserProfileState] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('karmatute_profile');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return null;
  });

  const setHasCompletedOnboarding = (val: boolean) => {
    localStorage.setItem('karmatute_onboarding', val ? 'true' : 'false');
    setHasCompletedOnboardingState(val);
  };

  const setUserProfile = (profile: UserProfile | null) => {
    if (profile) {
      localStorage.setItem('karmatute_profile', JSON.stringify(profile));
    } else {
      localStorage.removeItem('karmatute_profile');
    }
    setUserProfileState(profile);
  };

  const isAdmin = userRole === 'ROLE_ADMIN';

  const setCurrentPage = (page: PageId) => {
    setCurrentPageState(page);
    const nextPath = PAGE_PATHS[page];
    if (window.location.pathname !== nextPath) {
      window.history.pushState({ page }, '', nextPath);
    }
  };

  React.useEffect(() => {
    const handlePopState = () => setCurrentPageState(pageFromPathname(window.location.pathname));
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <AppContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        userRole,
        setUserRole,
        isAdmin,
        soundEnabled,
        setSoundEnabled,
        isAuthenticated,
        setIsAuthenticated: (val: boolean) => {
          localStorage.setItem('karmatute_auth', val ? 'true' : 'false');
          setIsAuthenticated(val);
        },
        hasCompletedOnboarding,
        setHasCompletedOnboarding,
        userProfile: userProfileState,
        setUserProfile,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppContextProvider');
  }
  return context;
}
