"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { ParticleCanvas } from "./particle-canvas"
import { RealmSelector } from "./realm-selector"
import { AmbientOrbs } from "./ambient-orbs"
import { ZenTimer } from "./zen-timer"
import { SoundscapeMixer } from "./soundscape-mixer"
import { CustomCursor } from "./custom-cursor"
import { LandingPage } from "./landing-page"
import {
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Eye,
  EyeOff,
  Clock,
  Sliders,
  Moon,
  Sun,
  MousePointer,
} from "lucide-react"

export type Realm =
  | "aurora"
  | "rain"
  | "cosmos"
  | "deep"
  | "ember"
  | "mist"
  | "void"
  | "bloom"
  | "ocean"
  | "firefly"
  | "snow"
  | "nebula"

interface RealmConfig {
  name: string
  tagline: string
  colors: string[]
  particleCount: number
  speed: number
  description: string
  icon: string
  soundscape: string
  audioUrl: string
}

export const realms: Record<Realm, RealmConfig> = {
  aurora: {
    name: "Aurora",
    tagline: "Northern lights dance above",
    colors: ["#22c55e", "#10b981", "#14b8a6", "#06b6d4", "#0ea5e9"],
    particleCount: 150,
    speed: 0.3,
    description: "Watch the ethereal glow of polar lights ripple across the void",
    icon: "✦",
    soundscape: "Arctic Wind",
    audioUrl: "https://cdn.freesound.org/previews/531/531015_10623498-lq.mp3",
  },
  rain: {
    name: "Rain",
    tagline: "Gentle drops on still water",
    colors: ["#64748b", "#94a3b8", "#cbd5e1", "#e2e8f0", "#f1f5f9"],
    particleCount: 300,
    speed: 2,
    description: "Feel the calm of rainfall cascading through darkness",
    icon: "◦",
    soundscape: "Rainfall",
    audioUrl: "https://cdn.freesound.org/previews/346/346170_4502516-lq.mp3",
  },
  cosmos: {
    name: "Cosmos",
    tagline: "Infinite stellar drift",
    colors: ["#f97316", "#fb923c", "#fbbf24", "#fcd34d", "#fef3c7"],
    particleCount: 200,
    speed: 0.15,
    description: "Float among distant stars in the endless expanse",
    icon: "◈",
    soundscape: "Deep Space",
    audioUrl: "https://cdn.freesound.org/previews/560/560378_5674468-lq.mp3",
  },
  deep: {
    name: "Deep",
    tagline: "Beneath the surface",
    colors: ["#6366f1", "#818cf8", "#a78bfa", "#c4b5fd", "#8b5cf6"],
    particleCount: 100,
    speed: 0.2,
    description: "Descend into the tranquil depths of the abyss",
    icon: "◯",
    soundscape: "Underwater",
    audioUrl: "https://cdn.freesound.org/previews/398/398981_1648170-lq.mp3",
  },
  ember: {
    name: "Ember",
    tagline: "Warmth of dying flames",
    colors: ["#ef4444", "#f97316", "#fb923c", "#fbbf24", "#fcd34d"],
    particleCount: 120,
    speed: 0.4,
    description: "Find comfort in the gentle glow of fading firelight",
    icon: "◆",
    soundscape: "Crackling Fire",
    audioUrl: "https://cdn.freesound.org/previews/629/629035_13981355-lq.mp3",
  },
  mist: {
    name: "Mist",
    tagline: "Morning fog ascends",
    colors: ["#e2e8f0", "#cbd5e1", "#94a3b8", "#64748b", "#475569"],
    particleCount: 200,
    speed: 0.1,
    description: "Drift through layers of soft, ethereal haze",
    icon: "○",
    soundscape: "Forest Ambience",
    audioUrl: "https://cdn.freesound.org/previews/587/587560_7465718-lq.mp3",
  },
  void: {
    name: "Void",
    tagline: "Absolute stillness",
    colors: ["#18181b", "#27272a", "#3f3f46", "#52525b", "#71717a"],
    particleCount: 50,
    speed: 0.05,
    description: "Embrace the peace of complete emptiness",
    icon: "●",
    soundscape: "Silence",
    audioUrl: "https://cdn.freesound.org/previews/612/612095_5674468-lq.mp3",
  },
  bloom: {
    name: "Bloom",
    tagline: "Life unfolds gently",
    colors: ["#ec4899", "#f472b6", "#fb7185", "#fda4af", "#fecdd3"],
    particleCount: 140,
    speed: 0.25,
    description: "Witness the delicate dance of petals in wind",
    icon: "❋",
    soundscape: "Spring Garden",
    audioUrl: "https://cdn.freesound.org/previews/529/529700_7037-lq.mp3",
  },
  ocean: {
    name: "Ocean",
    tagline: "Waves upon the shore",
    colors: ["#0284c7", "#0369a1", "#075985", "#0c4a6e", "#164e63"],
    particleCount: 180,
    speed: 0.35,
    description: "Listen to the endless rhythm of the sea",
    icon: "≋",
    soundscape: "Ocean Waves",
    audioUrl: "https://cdn.freesound.org/previews/527/527409_2524386-lq.mp3",
  },
  firefly: {
    name: "Firefly",
    tagline: "Summer night magic",
    colors: ["#facc15", "#fde047", "#fef08a", "#fef9c3", "#84cc16"],
    particleCount: 80,
    speed: 0.18,
    description: "Wander through a field of living lights",
    icon: "✧",
    soundscape: "Night Crickets",
    audioUrl: "https://cdn.freesound.org/previews/531/531952_8386274-lq.mp3",
  },
  snow: {
    name: "Snow",
    tagline: "Silent winter descent",
    colors: ["#f8fafc", "#f1f5f9", "#e2e8f0", "#cbd5e1", "#94a3b8"],
    particleCount: 250,
    speed: 0.6,
    description: "Watch snowflakes drift through peaceful silence",
    icon: "❅",
    soundscape: "Winter Wind",
    audioUrl: "https://cdn.freesound.org/previews/507/507906_6165733-lq.mp3",
  },
  nebula: {
    name: "Nebula",
    tagline: "Cosmic clouds swirl",
    colors: ["#a855f7", "#c084fc", "#e879f9", "#f0abfc", "#f5d0fe"],
    particleCount: 160,
    speed: 0.12,
    description: "Witness the birth of stars in colorful gas clouds",
    icon: "◎",
    soundscape: "Cosmic Hum",
    audioUrl: "https://cdn.freesound.org/previews/560/560378_5674468-lq.mp3",
  },
}

export function DriftExperience() {
  const [currentRealm, setCurrentRealm] = useState<Realm>("aurora")
  const [isAudioEnabled, setIsAudioEnabled] = useState(false)
  const [isEntered, setIsEntered] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 })
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isZenMode, setIsZenMode] = useState(false)
  const [showTimer, setShowTimer] = useState(false)
  const [showMixer, setShowMixer] = useState(false)
  const [timeOfDay, setTimeOfDay] = useState<"day" | "night">("night")
  const [uiOpacity, setUiOpacity] = useState(1)
  const [lastInteraction, setLastInteraction] = useState(Date.now())
  const [cursorVisible, setCursorVisible] = useState(true)
  const [cursorFollowEnabled, setCursorFollowEnabled] = useState(true)
  const [showZenClock, setShowZenClock] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  const audioRef = useRef<HTMLAudioElement | null>(null)

  const realm = realms[currentRealm]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Always clean up existing audio first
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.src = ""
      audioRef.current = null
    }

    // Only create new audio if enabled and entered
    if (isAudioEnabled && isEntered) {
      const audio = new Audio()
      audio.src = realm.audioUrl
      audio.loop = true
      audio.volume = 0.4
      audioRef.current = audio

      // Play with user interaction handling
      const playPromise = audio.play()
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.log("[v0] Audio play failed, waiting for user interaction:", error)
        })
      }
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ""
        audioRef.current = null
      }
    }
  }, [isAudioEnabled, currentRealm, isEntered, realm.audioUrl])

  // Auto-hide UI after 5 seconds of no interaction
  useEffect(() => {
    if (isZenMode) return

    const checkIdle = setInterval(() => {
      const idle = Date.now() - lastInteraction
      if (idle > 5000 && !isZenMode) {
        setUiOpacity(0.2)
      }
    }, 1000)

    return () => clearInterval(checkIdle)
  }, [lastInteraction, isZenMode])

  const handleInteraction = useCallback(() => {
    setLastInteraction(Date.now())
    if (!isZenMode) setUiOpacity(1)
  }, [isZenMode])

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (cursorFollowEnabled) {
        setMousePos({
          x: e.clientX / window.innerWidth,
          y: e.clientY / window.innerHeight,
        })
      }
      handleInteraction()
    },
    [handleInteraction, cursorFollowEnabled],
  )

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("click", handleInteraction)
    window.addEventListener("keydown", handleInteraction)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("click", handleInteraction)
      window.removeEventListener("keydown", handleInteraction)
    }
  }, [handleMouseMove, handleInteraction])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "z" || e.key === "Z") {
        setIsZenMode((prev) => !prev)
      }
      if (e.key === "f" || e.key === "F") {
        toggleFullscreen()
      }
      if (e.key === "m" || e.key === "M") {
        setIsAudioEnabled((prev) => !prev)
      }
      if (e.key === "t" || e.key === "T") {
        if (isZenMode) {
          setShowZenClock((prev) => !prev)
        } else {
          setShowTimer((prev) => !prev)
        }
      }
      if (e.key === "c" || e.key === "C") {
        setCursorVisible((prev) => !prev)
        setCursorFollowEnabled((prev) => !prev)
      }
      if (e.key === "Escape") {
        setIsZenMode(false)
        setShowTimer(false)
        setShowMixer(false)
      }
      // Number keys for quick realm switch
      const realmKeys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "="]
      const realmOrder: Realm[] = [
        "aurora",
        "rain",
        "cosmos",
        "deep",
        "ember",
        "mist",
        "void",
        "bloom",
        "ocean",
        "firefly",
        "snow",
        "nebula",
      ]
      const keyIndex = realmKeys.indexOf(e.key)
      if (keyIndex !== -1 && realmOrder[keyIndex]) {
        setCurrentRealm(realmOrder[keyIndex])
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isZenMode])

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange)
  }, [])

  const formatZenTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
  }

  if (!isEntered) {
    return <LandingPage realm={realm} currentRealm={currentRealm} onEnter={() => setIsEntered(true)} />
  }

  return (
    <div
      className={`fixed inset-0 bg-background overflow-hidden select-none ${cursorVisible ? "cursor-visible" : "cursor-hidden"}`}
      onClick={handleInteraction}
    >
      <CustomCursor visible={cursorVisible} color={realm.colors[0]} />

      {/* Particle system */}
      <ParticleCanvas
        realm={currentRealm}
        mousePos={mousePos}
        timeOfDay={timeOfDay}
        cursorFollowEnabled={cursorFollowEnabled}
      />

      {/* Ambient background orbs */}
      <AmbientOrbs realm={currentRealm} mousePos={mousePos} />

      {/* Grain overlay */}
      <div className="grain" />

      {isZenMode && showZenClock && (
        <div className="fixed top-8 right-8 z-50 animate-drift-in">
          <div
            className="text-6xl font-extralight tracking-wider transition-colors duration-1000"
            style={{
              color: realm.colors[0],
              opacity: 0.4,
              textShadow: `0 0 60px ${realm.colors[0]}30`,
            }}
          >
            {formatZenTime(currentTime)}
          </div>
        </div>
      )}

      {/* UI Layer - fades with zen mode and idle */}
      <div
        className="transition-opacity duration-1000"
        style={{ opacity: isZenMode ? 0 : uiOpacity }}
        onMouseEnter={() => !isZenMode && setUiOpacity(1)}
      >
        {/* Top bar */}
        <header className="fixed top-0 left-0 right-0 z-50 p-6 md:p-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-xl transition-colors duration-700" style={{ color: realm.colors[0] }}>
              {realm.icon}
            </span>
            <span className="text-xs tracking-[0.3em] uppercase text-muted-foreground/60 font-light">Drift</span>
            <span className="text-muted-foreground/20">/</span>
            <span
              className="text-xs tracking-[0.2em] uppercase transition-all duration-700 font-medium"
              style={{ color: realm.colors[0] }}
            >
              {realm.name}
            </span>
          </div>

          <div className="flex items-center gap-1">
            {/* Time of day toggle */}
            <button
              onClick={() => setTimeOfDay((t) => (t === "day" ? "night" : "day"))}
              className="p-3 rounded-full border border-transparent hover:border-border/50 transition-all duration-300"
              aria-label="Toggle time of day"
            >
              {timeOfDay === "night" ? (
                <Moon className="w-4 h-4 text-muted-foreground" />
              ) : (
                <Sun className="w-4 h-4 text-muted-foreground" />
              )}
            </button>

            <button
              onClick={() => {
                setCursorVisible(!cursorVisible)
                setCursorFollowEnabled(!cursorFollowEnabled)
              }}
              className={`p-3 rounded-full border transition-all duration-300 ${
                !cursorVisible ? "border-border/50 bg-card/50" : "border-transparent hover:border-border/50"
              }`}
              aria-label="Toggle cursor and particle attraction"
            >
              <MousePointer className="w-4 h-4 text-muted-foreground" />
            </button>

            {/* Timer */}
            <button
              onClick={() => setShowTimer(!showTimer)}
              className={`p-3 rounded-full border transition-all duration-300 ${
                showTimer ? "border-border/50 bg-card/50" : "border-transparent hover:border-border/50"
              }`}
              aria-label="Toggle timer"
            >
              <Clock className="w-4 h-4 text-muted-foreground" />
            </button>

            {/* Soundscape mixer */}
            <button
              onClick={() => setShowMixer(!showMixer)}
              className={`p-3 rounded-full border transition-all duration-300 ${
                showMixer ? "border-border/50 bg-card/50" : "border-transparent hover:border-border/50"
              }`}
              aria-label="Toggle mixer"
            >
              <Sliders className="w-4 h-4 text-muted-foreground" />
            </button>

            {/* Audio */}
            <button
              onClick={() => setIsAudioEnabled(!isAudioEnabled)}
              className={`p-3 rounded-full border transition-all duration-300 ${
                isAudioEnabled ? "border-border/50 bg-card/50" : "border-transparent hover:border-border/50"
              }`}
              aria-label="Toggle audio"
            >
              {isAudioEnabled ? (
                <Volume2 className="w-4 h-4 text-muted-foreground" />
              ) : (
                <VolumeX className="w-4 h-4 text-muted-foreground" />
              )}
            </button>

            {/* Zen mode */}
            <button
              onClick={() => setIsZenMode(!isZenMode)}
              className={`p-3 rounded-full border transition-all duration-300 ${
                isZenMode ? "border-border/50 bg-card/50" : "border-transparent hover:border-border/50"
              }`}
              aria-label="Toggle zen mode"
            >
              {isZenMode ? (
                <Eye className="w-4 h-4 text-muted-foreground" />
              ) : (
                <EyeOff className="w-4 h-4 text-muted-foreground" />
              )}
            </button>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="p-3 rounded-full border border-transparent hover:border-border/50 transition-all duration-300"
              aria-label="Toggle fullscreen"
            >
              {isFullscreen ? (
                <Minimize className="w-4 h-4 text-muted-foreground" />
              ) : (
                <Maximize className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
          </div>
        </header>

        {/* Center content */}
        <main className="fixed inset-0 flex items-center justify-center pointer-events-none">
          <div
            className="text-center transition-all duration-[2000ms] ease-out"
            style={{
              transform: cursorFollowEnabled
                ? `translate(${(mousePos.x - 0.5) * -30}px, ${(mousePos.y - 0.5) * -30}px)`
                : "none",
            }}
          >
            <h2
              className="text-7xl md:text-8xl lg:text-9xl font-serif tracking-tight mb-4 transition-colors duration-1000"
              style={{ color: realm.colors[0] }}
            >
              {realm.name}
            </h2>
            <p className="text-muted-foreground/60 text-sm md:text-base tracking-[0.2em] font-light uppercase">
              {realm.tagline}
            </p>
          </div>
        </main>

        {/* Timer panel */}
        {showTimer && <ZenTimer onClose={() => setShowTimer(false)} accentColor={realm.colors[0]} />}

        {/* Soundscape mixer panel */}
        {showMixer && (
          <SoundscapeMixer
            realm={currentRealm}
            onClose={() => setShowMixer(false)}
            accentColor={realm.colors[0]}
            audioRef={audioRef}
            isAudioEnabled={isAudioEnabled}
          />
        )}

        {/* Realm selector */}
        <RealmSelector currentRealm={currentRealm} onRealmChange={setCurrentRealm} />

        {/* Keyboard hints */}
        <footer className="fixed bottom-6 md:bottom-8 left-6 md:left-8 z-40">
          <div className="flex items-center gap-4 text-[10px] tracking-[0.15em] uppercase text-muted-foreground/30">
            <span className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 rounded bg-card/50 border border-border/30 font-mono text-[9px]">Z</kbd>
              Zen
            </span>
            <span className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 rounded bg-card/50 border border-border/30 font-mono text-[9px]">C</kbd>
              Cursor
            </span>
            <span className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 rounded bg-card/50 border border-border/30 font-mono text-[9px]">M</kbd>
              Sound
            </span>
            <span className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 rounded bg-card/50 border border-border/30 font-mono text-[9px]">1-0</kbd>
              Realms
            </span>
          </div>
        </footer>

        {/* Particle count and sound indicator */}
        <div className="fixed bottom-6 md:bottom-8 right-6 md:right-8 z-40 flex items-center gap-4">
          {isAudioEnabled && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="w-0.5 bg-current animate-pulse rounded-full"
                    style={{
                      height: `${8 + Math.random() * 8}px`,
                      color: realm.colors[0],
                      animationDelay: `${i * 0.1}s`,
                    }}
                  />
                ))}
              </div>
              <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground/30">
                {realm.soundscape}
              </span>
            </div>
          )}
          <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground/30">
            {realm.particleCount} particles
          </p>
        </div>
      </div>

      {isZenMode && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-drift-in">
          <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground/20">
            Press <kbd className="font-mono">Z</kbd> to exit
            <span className="mx-2 text-muted-foreground/10">•</span>
            <kbd className="font-mono">T</kbd> for clock
          </p>
        </div>
      )}
    </div>
  )
}
