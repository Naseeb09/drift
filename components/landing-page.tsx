"use client"

import { useState, useEffect, useRef } from "react"
import { type Realm, realms } from "./drift-experience"

interface LandingPageProps {
  realm: (typeof realms)[Realm]
  currentRealm: Realm
  onEnter: () => void
}

export function LandingPage({ realm, currentRealm, onEnter }: LandingPageProps) {
  const [loaded, setLoaded] = useState(false)
  const [hoveredRealm, setHoveredRealm] = useState<Realm | null>(null)
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 })
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const displayRealm = hoveredRealm ? realms[hoveredRealm] : realm
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

  return (
    <div ref={containerRef} className="fixed inset-0 bg-background flex items-center justify-center overflow-hidden">
      {/* Deep layered background */}
      <div className="absolute inset-0">
        {/* Base gradient layer */}
        <div
          className="absolute inset-0 transition-all duration-[2000ms]"
          style={{
            background: `
              radial-gradient(ellipse 120% 80% at 50% 100%, ${displayRealm.colors[0]}08 0%, transparent 50%),
              radial-gradient(ellipse 80% 60% at 20% 20%, ${displayRealm.colors[1] || displayRealm.colors[0]}05 0%, transparent 40%),
              radial-gradient(ellipse 60% 100% at 90% 50%, ${displayRealm.colors[2] || displayRealm.colors[0]}04 0%, transparent 40%)
            `,
          }}
        />

        {/* Animated glow orbs that follow mouse */}
        <div
          className="absolute w-[800px] h-[800px] rounded-full transition-all duration-[3000ms] ease-out opacity-20"
          style={{
            background: `radial-gradient(circle, ${displayRealm.colors[0]}15 0%, transparent 70%)`,
            left: `calc(${mousePos.x * 100}% - 400px)`,
            top: `calc(${mousePos.y * 100}% - 400px)`,
            filter: "blur(100px)",
          }}
        />
        <div
          className="absolute w-[600px] h-[600px] rounded-full transition-all duration-[4000ms] ease-out opacity-15"
          style={{
            background: `radial-gradient(circle, ${displayRealm.colors[1] || displayRealm.colors[0]}20 0%, transparent 70%)`,
            left: `calc(${(1 - mousePos.x) * 100}% - 300px)`,
            top: `calc(${(1 - mousePos.y) * 100}% - 300px)`,
            filter: "blur(80px)",
          }}
        />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 80 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-float"
            style={{
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              backgroundColor: displayRealm.colors[i % displayRealm.colors.length],
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.3 + 0.05,
              animationDelay: `${Math.random() * 25}s`,
              animationDuration: `${25 + Math.random() * 30}s`,
            }}
          />
        ))}
      </div>

      {/* Main content - centered and compact */}
      <div className="relative z-10 flex flex-col items-center justify-center px-6 w-full max-w-5xl">
        {/* Overline with animated line */}
        <div
          className={`flex items-center gap-4 mb-16 transition-all duration-1000 delay-100 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          <div
            className="h-px w-12 transition-all duration-700"
            style={{ backgroundColor: `${displayRealm.colors[0]}30` }}
          />
          <p className="text-[10px] tracking-[0.5em] uppercase text-muted-foreground/40">Ambient Experience</p>
          <div
            className="h-px w-12 transition-all duration-700"
            style={{ backgroundColor: `${displayRealm.colors[0]}30` }}
          />
        </div>

        {/* Main title - massive and impactful */}
        <div
          className={`relative mb-8 transition-all duration-1000 delay-200 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          {/* Glow behind text */}
          <div
            className="absolute inset-0 blur-3xl opacity-30 transition-all duration-1000"
            style={{
              background: `radial-gradient(ellipse at center, ${displayRealm.colors[0]}40 0%, transparent 70%)`,
              transform: "scale(2)",
            }}
          />
          <h1
            className="relative font-serif text-[clamp(5rem,18vw,14rem)] font-normal tracking-[-0.03em] text-foreground leading-[0.85] text-center"
            style={{
              textShadow: `0 0 200px ${displayRealm.colors[0]}15`,
            }}
          >
            Drift
          </h1>
        </div>

        {/* Tagline */}
        <p
          className={`text-muted-foreground/50 text-base md:text-lg tracking-[0.15em] font-light text-center max-w-lg mb-20 leading-relaxed transition-all duration-1000 delay-300 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          {displayRealm.description}
        </p>

        {/* Realm selector - elegant horizontal strip */}
        <div
          className={`flex flex-col items-center gap-6 mb-20 transition-all duration-1000 delay-400 ${loaded ? "opacity-100" : "opacity-0"}`}
        >
          <p className="text-[9px] tracking-[0.4em] uppercase text-muted-foreground/25">Choose your realm</p>

          <div className="flex items-center gap-3">
            {realmOrder.map((r, index) => {
              const config = realms[r]
              const isHovered = hoveredRealm === r
              return (
                <button
                  key={r}
                  onMouseEnter={() => setHoveredRealm(r)}
                  onMouseLeave={() => setHoveredRealm(null)}
                  className={`group relative flex items-center justify-center transition-all duration-500 ${
                    isHovered ? "scale-125" : "scale-100"
                  }`}
                  style={{
                    animationDelay: `${index * 50}ms`,
                  }}
                  aria-label={config.name}
                >
                  {/* Outer ring on hover */}
                  <div
                    className={`absolute inset-0 rounded-full transition-all duration-500 ${
                      isHovered ? "scale-150 opacity-100" : "scale-100 opacity-0"
                    }`}
                    style={{
                      border: `1px solid ${config.colors[0]}30`,
                    }}
                  />

                  {/* Main circle */}
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500"
                    style={{
                      background: isHovered
                        ? `radial-gradient(circle, ${config.colors[0]}40 0%, ${config.colors[0]}15 100%)`
                        : `radial-gradient(circle, ${config.colors[0]}20 0%, ${config.colors[0]}08 100%)`,
                      boxShadow: isHovered ? `0 0 40px ${config.colors[0]}30` : "none",
                    }}
                  >
                    <span
                      className={`text-sm transition-all duration-500 ${isHovered ? "scale-110" : ""}`}
                      style={{
                        color: config.colors[0],
                        opacity: isHovered ? 1 : 0.6,
                        textShadow: isHovered ? `0 0 20px ${config.colors[0]}` : "none",
                      }}
                    >
                      {config.icon}
                    </span>
                  </div>

                  {/* Tooltip */}
                  <span
                    className={`absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] tracking-[0.2em] uppercase transition-all duration-300 ${
                      isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                    }`}
                    style={{ color: config.colors[0] }}
                  >
                    {config.name}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Enter button - minimal and elegant */}
        <button
          onClick={onEnter}
          className={`group relative px-16 py-5 transition-all duration-1000 delay-500 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          {/* Button border */}
          <div
            className="absolute inset-0 rounded-full transition-all duration-700"
            style={{
              border: `1px solid ${displayRealm.colors[0]}25`,
            }}
          />

          {/* Hover fill */}
          <div
            className="absolute inset-0 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left"
            style={{ backgroundColor: displayRealm.colors[0] }}
          />

          {/* Glow on hover */}
          <div
            className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"
            style={{
              boxShadow: `0 0 60px ${displayRealm.colors[0]}30, 0 0 120px ${displayRealm.colors[0]}15`,
            }}
          />

          <span className="relative z-10 text-[11px] tracking-[0.4em] uppercase text-foreground/70 group-hover:text-background transition-colors duration-500">
            Enter
          </span>
        </button>

        {/* Feature indicators */}
        <div
          className={`mt-24 flex items-center gap-10 transition-all duration-1000 delay-700 ${loaded ? "opacity-100" : "opacity-0"}`}
        >
          {[
            { label: "12 Worlds", icon: "◈" },
            { label: "Soundscapes", icon: "◯" },
            { label: "Zen Mode", icon: "◦" },
          ].map((feature) => (
            <div key={feature.label} className="flex items-center gap-2">
              <span
                className="text-[10px] transition-colors duration-700"
                style={{ color: `${displayRealm.colors[0]}40` }}
              >
                {feature.icon}
              </span>
              <span className="text-[9px] tracking-[0.25em] uppercase text-muted-foreground/20">{feature.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none"
        style={{
          background: `linear-gradient(to top, ${displayRealm.colors[0]}05, transparent)`,
        }}
      />

      {/* Corner accents */}
      <div className="absolute top-8 left-8 flex items-center gap-3">
        <div
          className={`w-8 h-px transition-all duration-1000 delay-800 ${loaded ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"}`}
          style={{ backgroundColor: `${displayRealm.colors[0]}15`, transformOrigin: "left" }}
        />
      </div>
      <div className="absolute top-8 right-8 flex items-center gap-3">
        <div
          className={`w-8 h-px transition-all duration-1000 delay-800 ${loaded ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"}`}
          style={{ backgroundColor: `${displayRealm.colors[0]}15`, transformOrigin: "right" }}
        />
      </div>

      {/* Grain */}
      <div className="grain" />
    </div>
  )
}
