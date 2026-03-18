"use client"

import { type Realm, realms } from "./drift-experience"

interface AmbientOrbsProps {
  realm: Realm
  mousePos: { x: number; y: number }
}

export function AmbientOrbs({ realm, mousePos }: AmbientOrbsProps) {
  const config = realms[realm]

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Primary orb */}
      <div
        className="absolute w-[700px] h-[700px] rounded-full animate-pulse-glow transition-all duration-[3000ms]"
        style={{
          background: `radial-gradient(circle, ${config.colors[0]}35 0%, transparent 70%)`,
          left: `calc(15% + ${(mousePos.x - 0.5) * 150}px)`,
          top: `calc(25% + ${(mousePos.y - 0.5) * 150}px)`,
        }}
      />

      {/* Secondary orb */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full animate-pulse-glow transition-all duration-[3000ms]"
        style={{
          background: `radial-gradient(circle, ${config.colors[2] || config.colors[0]}25 0%, transparent 70%)`,
          right: `calc(5% + ${(mousePos.x - 0.5) * -120}px)`,
          bottom: `calc(15% + ${(mousePos.y - 0.5) * -120}px)`,
          animationDelay: "-4s",
        }}
      />

      {/* Tertiary orb */}
      <div
        className="absolute w-[400px] h-[400px] rounded-full animate-pulse-glow transition-all duration-[3000ms]"
        style={{
          background: `radial-gradient(circle, ${config.colors[1] || config.colors[0]}20 0%, transparent 70%)`,
          left: `calc(55% + ${(mousePos.x - 0.5) * 80}px)`,
          top: `calc(55% + ${(mousePos.y - 0.5) * 80}px)`,
          animationDelay: "-2s",
        }}
      />

      {/* Fourth accent orb */}
      <div
        className="absolute w-[300px] h-[300px] rounded-full animate-pulse-glow transition-all duration-[3000ms]"
        style={{
          background: `radial-gradient(circle, ${config.colors[3] || config.colors[0]}15 0%, transparent 70%)`,
          right: `calc(30% + ${(mousePos.x - 0.5) * -60}px)`,
          top: `calc(10% + ${(mousePos.y - 0.5) * -60}px)`,
          animationDelay: "-6s",
        }}
      />

      {/* Mouse-following spotlight */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full transition-all duration-500 ease-out"
        style={{
          background: `radial-gradient(circle, ${config.colors[0]}08 0%, transparent 50%)`,
          left: `calc(${mousePos.x * 100}% - 250px)`,
          top: `calc(${mousePos.y * 100}% - 250px)`,
        }}
      />

      {/* Vignette overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(10,10,11,0.4)_100%)]" />
    </div>
  )
}
