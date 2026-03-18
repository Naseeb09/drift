"use client"

import { useState, useEffect, type MutableRefObject } from "react"
import { X, Volume2 } from "lucide-react"
import { type Realm, realms } from "./drift-experience"

interface SoundscapeMixerProps {
  realm: Realm
  onClose: () => void
  accentColor: string
  audioRef: MutableRefObject<HTMLAudioElement | null>
  isAudioEnabled: boolean
}

export function SoundscapeMixer({ realm, onClose, accentColor, audioRef, isAudioEnabled }: SoundscapeMixerProps) {
  const [volume, setVolume] = useState(40)
  const [bassBoost, setBassBoost] = useState(50)
  const [reverb, setReverb] = useState(30)
  const config = realms[realm]

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100
    }
  }, [volume, audioRef])

  const sliders = [
    { id: "volume", name: "Volume", value: volume, setValue: setVolume, icon: "◯" },
    { id: "bass", name: "Bass", value: bassBoost, setValue: setBassBoost, icon: "◆" },
    { id: "reverb", name: "Reverb", value: reverb, setValue: setReverb, icon: "◈" },
  ]

  return (
    <div className="fixed top-24 right-6 md:right-8 z-50 w-72 animate-drift-in">
      <div className="p-6 rounded-2xl bg-card/60 backdrop-blur-2xl border border-border/30">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-xs tracking-[0.2em] uppercase text-muted-foreground">{config.soundscape}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-card/80 transition-colors"
            aria-label="Close mixer"
          >
            <X className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        </div>

        {/* Audio status */}
        <div className="mb-6 p-3 rounded-xl bg-card/40 border border-border/20">
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${isAudioEnabled ? "animate-pulse" : ""}`}
              style={{ backgroundColor: isAudioEnabled ? accentColor : "#71717a" }}
            />
            <span className="text-xs text-muted-foreground">
              {isAudioEnabled ? "Playing" : "Press M to enable sound"}
            </span>
          </div>
        </div>

        <div className="space-y-5">
          {sliders.map((slider) => (
            <div key={slider.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span style={{ color: accentColor }}>{slider.icon}</span>
                  <span className="text-xs text-muted-foreground">{slider.name}</span>
                </div>
                <span className="text-[10px] text-muted-foreground/60 tabular-nums">{slider.value}%</span>
              </div>
              <div className="relative h-1.5 bg-card/80 rounded-full overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 rounded-full transition-all duration-300"
                  style={{
                    width: `${slider.value}%`,
                    backgroundColor: accentColor,
                  }}
                />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={slider.value}
                  onChange={(e) => slider.setValue(Number(e.target.value))}
                  className="absolute inset-0 w-full opacity-0 cursor-pointer"
                  aria-label={`${slider.name} level`}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Visualizer bars */}
        {isAudioEnabled && (
          <div className="mt-6 pt-4 border-t border-border/20">
            <div className="flex items-end justify-center gap-1 h-8">
              {[...Array(16)].map((_, i) => (
                <div
                  key={i}
                  className="w-1.5 rounded-full transition-all duration-150"
                  style={{
                    height: `${Math.random() * 100}%`,
                    backgroundColor: accentColor,
                    opacity: 0.6,
                    animationDelay: `${i * 50}ms`,
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
