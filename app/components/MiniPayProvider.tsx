"use client";

import { ReactNode } from "react";
import { useMiniPayCompatibility } from "@/hooks/useMiniPayCompatibility";

export default function MiniPayProvider({ children }: { children: ReactNode }) {
  const _isMiniPay = useMiniPayCompatibility();

  return <>{children}</>;
}