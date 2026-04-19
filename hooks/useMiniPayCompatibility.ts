"use client";

import { useEffect, useState } from "react";

export const useMiniPayCompatibility = () => {
  const [isMiniPay, setIsMiniPay] = useState(false);

  useEffect(() => {
    let retry = 0;

    const detect = () => {
      const eth = (window as any).ethereum;

      if (eth?.isMiniPay) {
        setIsMiniPay(true);
      } else if (retry < 10) {
        retry++;
        setTimeout(detect, 200);
      }
    };

    detect();
  }, []);

  return isMiniPay;
};


//ID: 200520524