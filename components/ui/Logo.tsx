import React from "react";
import { cn } from "@/utils";

interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className }) => {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <img src="/logo.svg" alt="Synthnet" />
    </div>
  );
};
