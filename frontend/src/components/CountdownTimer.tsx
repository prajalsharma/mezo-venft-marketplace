"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Clock, AlertCircle } from "lucide-react";

interface CountdownTimerProps {
  lockEnd: bigint | number;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

function calculateTimeRemaining(lockEnd: number): TimeRemaining {
  // lockEnd === 0 means adapter data hasn't loaded yet.
  // Return a large sentinel so the UI shows "loading" rather than "expired".
  if (lockEnd === 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, total: -1 };
  }
  const now = Math.floor(Date.now() / 1000);
  const total = Math.max(0, lockEnd - now);

  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
    total,
  };
}

export function CountdownTimer({ lockEnd }: CountdownTimerProps) {
  const [time, setTime] = useState<TimeRemaining>(() =>
    calculateTimeRemaining(Number(lockEnd))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(calculateTimeRemaining(Number(lockEnd)));
    }, 1000);

    return () => clearInterval(interval);
  }, [lockEnd]);

  // total === -1 means lockEnd hasn't loaded from the contract yet
  if (time.total === -1) return <span className="text-mezo-muted text-[10px]">—</span>;

  const isExpired = time.total === 0;
  const isCritical = time.days === 0;

  if (isExpired) return <span className="text-mezo-danger font-black uppercase text-[10px]">Expired</span>;

  return (
    <div className="flex items-center gap-1.5 tabular-nums">
      <Clock className={`w-3 h-3 ${isCritical ? 'text-mezo-danger animate-pulse' : 'text-mezo-muted'}`} />
      <span className={`text-sm font-bold ${isCritical ? 'text-mezo-danger' : 'text-white'}`}>
        {time.days > 0 ? `${time.days}d ${time.hours}h` : `${time.hours}h ${time.minutes}m`}
      </span>
    </div>
  );
}

export function CountdownCompact({ lockEnd }: { lockEnd: bigint | number }) {
  const [time, setTime] = useState<TimeRemaining>(() =>
    calculateTimeRemaining(Number(lockEnd))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(calculateTimeRemaining(Number(lockEnd)));
    }, 1000);

    return () => clearInterval(interval);
  }, [lockEnd]);

  // total === -1 means lockEnd hasn't loaded from the contract yet
  if (time.total === -1) return <span className="text-mezo-muted text-sm">—</span>;

  const isExpired = time.total === 0;
  const isCritical = time.days === 0;

  if (isExpired) return <span className="text-mezo-danger font-black uppercase text-[10px] tracking-widest">Expired</span>;

  return (
    <span className={`text-sm font-bold tabular-nums ${isCritical ? 'text-mezo-danger' : 'text-white'}`}>
      {time.days > 0 ? `${time.days}d ${time.hours}h` : `${time.hours}h ${time.minutes}m`}
    </span>
  );
}
