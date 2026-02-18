"use client";

import React from "react";
import {
  RegistrationProvider,
  useRegistration,
} from "../components/registration/RegistrationContext";
import RegistrationLayout from "../components/registration/RegistrationLayout";
import Step1BusinessName from "../components/registration/Step1BusinessName";
import Step2BusinessAddress from "../components/registration/Step2BusinessAddress";
import Step3Email from "../components/registration/Step3Email";
import Step4Password from "../components/registration/Step4Password";
import Step5OTP from "../components/registration/Step5OTP";

function RegistrationFlow() {
  const { step } = useRegistration();

  const renderStep = () => {
    switch (step) {
      case 1:
        return <Step1BusinessName />;
      case 2:
        return <Step2BusinessAddress />;
      case 3:
        return <Step3Email />;
      case 4:
        return <Step4Password />;
      case 5:
        return <Step5OTP />;
      default:
        return <Step1BusinessName />;
    }
  };

  return <RegistrationLayout>{renderStep()}</RegistrationLayout>;
}

export default function Home() {
  return (
    <RegistrationProvider>
      <RegistrationFlow />
    </RegistrationProvider>
  );
}
