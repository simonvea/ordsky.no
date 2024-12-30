import React, { createContext, useContext, useEffect, useState } from 'react';

interface VisitStats {
  firstVisit: number;
  visitCount: number;
  lastSeen: number;
  cloudCreatedCount: number;
}

interface CallToActionContextValue {
  stats: VisitStats;
  incrementCloudCount: () => void;
}

const STORAGE_KEY = 'visitStats';

const CallToActionContext = createContext<CallToActionContextValue | undefined>(
  undefined
);

export function CallToActionProvider({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  const [stats, setStats] = useState<VisitStats>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);

    const now = Date.now();
    return {
      firstVisit: now,
      visitCount: 0,
      lastSeen: 0,
      cloudCreatedCount: 0,
    };
  });

  useEffect(() => {
    setStats((prev) => ({
      ...prev,
      visitCount: prev.visitCount + 1,
    }));
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  }, [stats]);

  const incrementCloudCount = (): void => {
    setStats((prev) => ({
      ...prev,
      cloudCreatedCount: prev.cloudCreatedCount + 1,
    }));
  };

  return (
    <CallToActionContext.Provider value={{ stats, incrementCloudCount }}>
      {children}
    </CallToActionContext.Provider>
  );
}

export function useCallToActionContext(): CallToActionContextValue {
  const context = useContext(CallToActionContext);
  if (!context) {
    throw new Error(
      'useCallToActionContext must be used within CallToActionProvider'
    );
  }
  return context;
}
