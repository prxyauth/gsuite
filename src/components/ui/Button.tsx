import React from "react";
import clsx from "clsx";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "text";
  isLoading?: boolean;
}

export const Button = ({
  variant = "primary",
  isLoading,
  className,
  children,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={clsx(
        "relative rounded-[20px] px-6 h-[40px] text-[14px] font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[80px]",
        variant === "primary" &&
          "bg-[#0b57d0] text-white hover:bg-[#0b57d0] hover:shadow-[0_1px_2px_0_rgba(60,64,67,0.3),0_1px_3px_1px_rgba(60,64,67,0.15)] focus:ring-[#0b57d0]",
        variant === "secondary" &&
          "bg-transparent text-[#0b57d0] hover:bg-[#f2f7ff] border border-[#747775] hover:border-transparent focus:ring-[#0b57d0]",
        variant === "text" &&
          "bg-transparent text-[#0b57d0] hover:bg-[#f2f7ff] focus:ring-[#0b57d0]",
        className,
      )}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {children}
    </button>
  );
};
