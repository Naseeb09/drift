"use client"

import { type Realm, realms } from "./drift-experience"

interface RealmSelectorProps {
  currentRealm: Realm
  onRealmChange: (realm: Realm) => void
}

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

export function RealmSelector({ currentRealm, onRealmChange }: RealmSelectorProps) {
  return (
    <nav className="fixed bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-0.5 p-1.5 rounded-full bg-card/40 backdrop-blur-2xl border border-border/30">
        {realmOrder.map((realm, index) => {
          const config = realms[realm]
          const isActive = currentRealm === realm
          // Show number key hint (1-9, 0, -, =)
          const keyHint = index < 9 ? (index + 1).toString() : index === 9 ? "0" : index === 10 ? "-" : "="

          return (
            <button
              key={realm}
              onClick={() => onRealmChange(realm)}
              className={`group relative flex items-center justify-center rounded-full transition-all duration-500 ${
                isActive ? "w-20 md:w-24 px-3 py-2" : "w-8 md:w-9 py-2 hover:bg-card/50"
              }`}
              aria-label={`Switch to ${config.name} realm (${keyHint})`}
              title={`${config.name} - Press ${keyHint}`}
            >
              {isActive && (
                <span
                  className="absolute inset-0 rounded-full transition-all duration-700"
                  style={{ backgroundColor: config.colors[0] }}
                />
              )}

              {isActive ? (
                <span className="relative z-10 text-[9px] md:text-[10px] tracking-[0.15em] uppercase text-background font-medium">
                  {config.name}
                </span>
              ) : (
                <span
                  className="relative z-10 text-xs transition-colors duration-300"
                  style={{ color: config.colors[0] }}
                >
                  {config.icon}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
