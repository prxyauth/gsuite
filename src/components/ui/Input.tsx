import React, { useState } from "react";
import clsx from "clsx";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, onFocus, onBlur, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(!!props.value);

    // Update hasValue when prop changes
    React.useEffect(() => {
      setHasValue(!!props.value);
    }, [props.value]);

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      setHasValue(!!e.target.value);
      onBlur?.(e);
    };

    return (
      <div className={clsx("relative mb-6", className)}>
        <input
          ref={ref}
          className={clsx(
            "block px-3.5 pb-2.5 pt-4 w-full text-[16px] text-[#1f1f1f] bg-transparent rounded-[4px] border border-1 appearance-none focus:outline-none focus:ring-0 peer",
            error
              ? "border-[#b3261e] focus:border-[#b3261e] caret-[#b3261e]"
              : "border-[#747775] focus:border-[#0b57d0] caret-[#0b57d0]",
            "h-[56px]",
          )}
          placeholder=" "
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
        <label
          className={clsx(
            "absolute text-[16px] duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-1 leading-tight peer-focus:px-1 peer-focus:text-[#0b57d0] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-2.5",
            error
              ? "text-[#b3261e]"
              : isFocused
                ? "text-[#0b57d0]"
                : "text-[#444746]",
            isFocused || hasValue ? "-translate-y-4 scale-75 top-2" : "",
          )}
        >
          {label}
        </label>
        {error && (
          <div className="flex items-center mt-1 ml-4">
            <svg
              aria-hidden="true"
              fill="currentColor"
              focusable="false"
              width="16px"
              height="16px"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              className="text-[#b3261e] mr-2"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"></path>
            </svg>
            <span className="text-xs text-[#b3261e]">{error}</span>
          </div>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
