"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface RegistrationData {
  businessName: string;
  businessAddress: string;
  email: string;
  password: string; // In real app, avoid storing plain text if possible, but for this flow we just pass it
  sessionId?: string;
  challengeType?: string;
  challengeMetadata?: any;
}

interface RegistrationContextType {
  data: RegistrationData;
  updateData: (newData: Partial<RegistrationData>) => void;
  step: number;
  setStep: (step: number) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
}

const RegistrationContext = createContext<RegistrationContextType | undefined>(
  undefined,
);

export function RegistrationProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<RegistrationData>({
    businessName: "",
    businessAddress: "",
    email: "",
    password: "",
  });
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateData = (newData: Partial<RegistrationData>) => {
    setData((prev) => ({ ...prev, ...newData }));
  };

  return (
    <RegistrationContext.Provider
      value={{
        data,
        updateData,
        step,
        setStep,
        isLoading,
        setIsLoading,
        error,
        setError,
      }}
    >
      {children}
    </RegistrationContext.Provider>
  );
}

export function useRegistration() {
  const context = useContext(RegistrationContext);
  if (context === undefined) {
    throw new Error(
      "useRegistration must be used within a RegistrationProvider",
    );
  }
  return context;
}
