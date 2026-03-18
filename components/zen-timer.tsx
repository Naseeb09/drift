"use client"

import { useState, useEffect, useRef } from "react"
import { X, Play, Pause, RotateCcw } from "lucide-react"

interface ZenTimerProps {
  onClose: () => void
  accentColor: string
}

const presets = [
  { label: "2m", seconds: 120 },
  { label: "5m", seconds: 300 },
  { label: "10m", seconds: 600 },
  { label: "20m", seconds: 1200 },
  { label: "30m", seconds: 1800 },
]

export function ZenTimer({ onClose, accentColor }: ZenTimerProps) {
  const [duration, setDuration] = useState(300)
  const [remaining, setRemaining] = useState(300)
  const [isRunning, setIsRunning] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isRunning && remaining > 0) {
      intervalRef.current = setInterval(() => {
        setRemaining((prev) => {
          if (prev <= 1) {
            setIsRunning(false)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isRunning, remaining])

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
  }

  const progress = duration > 0 ? ((duration - remaining) / duration) * 100 : 0

  const selectPreset = (seconds: number) => {
    setDuration(seconds)
    setRemaining(seconds)
    setIsRunning(false)
  }

  const reset = () => {
    setRemaining(duration)
    setIsRunning(false)
  }

  return (
    <div className="fixed top-24 right-6 md:right-8 z-50 w-80 animate-drift-in">
      <div
        className="p-8 rounded-3xl bg-card/40 backdrop-blur-3xl border border-border/20"
        style={{
          boxShadow: `0 0 80px ${accentColor}08, inset 0 0 60px ${accentColor}03`,
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: isRunning ? accentColor : "#52525b" }}
            />
            <h3 className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground/60">
              {isRunning ? "Running" : "Timer"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-card/60 transition-colors"
            aria-label="Close timer"
          >
            <X className="w-3.5 h-3.5 text-muted-foreground/50" />
          </button>
        </div>

        {/* Timer display with circular progress */}
        <div className="relative flex items-center justify-center mb-8">
          {/* Progress ring */}
          <svg className="absolute w-48 h-48 -rotate-90" viewBox="0 0 100 100">
            {/* Background ring */}
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              className="text-border/20"
            />
            {/* Progress ring */}
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke={accentColor}
              strokeWidth="1"
              strokeLinecap="round"
              strokeDasharray={`${progress * 2.89} 289`}
              className="transition-all duration-1000"
              style={{ opacity: 0.6 }}
            />
          </svg>

          {/* Time display */}
          <div
            className="text-5xl font-extralight tracking-wider transition-colors duration-500"
            style={{ color: accentColor, opacity: 0.9 }}
          >
            {formatTime(remaining)}
          </div>
        </div>

        {/* Presets */}
        <div className="flex gap-2 mb-8">
          {presets.map((preset) => (
            <button
              key={preset.seconds}
              onClick={() => selectPreset(preset.seconds)}
              className={`flex-1 py-2.5 text-[9px] tracking-[0.15em] uppercase rounded-xl transition-all duration-300 ${
                duration === preset.seconds
                  ? "text-foreground"
                  : "text-muted-foreground/40 hover:text-muted-foreground/60"
              }`}
              style={{
                backgroundColor: duration === preset.seconds ? `${accentColor}15` : "transparent",
                border: `1px solid ${duration === preset.seconds ? `${accentColor}30` : "transparent"}`,
              }}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={reset}
            className="p-3 rounded-full border border-border/20 hover:border-border/40 transition-all duration-300"
            aria-label="Reset timer"
          >
            <RotateCcw className="w-4 h-4 text-muted-foreground/50" />
          </button>
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="p-5 rounded-full transition-all duration-500"
            style={{
              backgroundColor: accentColor,
              boxShadow: isRunning ? `0 0 40px ${accentColor}40` : "none",
            }}
            aria-label={isRunning ? "Pause" : "Play"}
          >
            {isRunning ? (
              <Pause className="w-5 h-5 text-background" />
            ) : (
              <Play className="w-5 h-5 text-background ml-0.5" />
            )}
          </button>
          <div className="w-10" /> {/* Spacer for visual balance */}
        </div>
      </div>
    </div>
  )
}
