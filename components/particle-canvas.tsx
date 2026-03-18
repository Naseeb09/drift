"use client"

import { useRef, useEffect, useCallback } from "react"
import { type Realm, realms } from "./drift-experience"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  alpha: number
  life: number
  maxLife: number
  rotation: number
  rotationSpeed: number
  blinkPhase: number
  blinkSpeed: number
}

interface ParticleCanvasProps {
  realm: Realm
  mousePos: { x: number; y: number }
  timeOfDay: "day" | "night"
  cursorFollowEnabled: boolean
}

export function ParticleCanvas({ realm, mousePos, timeOfDay, cursorFollowEnabled }: ParticleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationRef = useRef<number>()
  const prevRealmRef = useRef<Realm>(realm)
  const timeRef = useRef(0)

  const config = realms[realm]
  const dayBrightness = timeOfDay === "day" ? 1.3 : 1

  const createParticle = useCallback(
    (width: number, height: number, colors: string[]): Particle => {
      const angle = Math.random() * Math.PI * 2
      const speed = (Math.random() * 0.5 + 0.2) * config.speed

      return {
        x: Math.random() * width,
        y: realm === "rain" || realm === "snow" ? -20 : Math.random() * height,
        vx: Math.cos(angle) * speed,
        vy:
          realm === "rain"
            ? Math.random() * 3 + 2
            : realm === "snow"
              ? Math.random() * 1 + 0.5
              : Math.sin(angle) * speed,
        size: Math.random() * 4 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.6 + 0.2,
        life: 0,
        maxLife: Math.random() * 600 + 400,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        blinkPhase: Math.random() * Math.PI * 2,
        blinkSpeed: Math.random() * 0.05 + 0.02,
      }
    },
    [config.speed, realm],
  )

  const initParticles = useCallback(
    (width: number, height: number) => {
      const particles: Particle[] = []
      for (let i = 0; i < config.particleCount; i++) {
        particles.push(createParticle(width, height, config.colors))
      }
      particlesRef.current = particles
    },
    [config.particleCount, config.colors, createParticle],
  )

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth * window.devicePixelRatio
      canvas.height = window.innerHeight * window.devicePixelRatio
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }

    resize()
    initParticles(window.innerWidth, window.innerHeight)

    window.addEventListener("resize", resize)
    return () => window.removeEventListener("resize", resize)
  }, [initParticles])

  // Handle realm change
  useEffect(() => {
    if (prevRealmRef.current !== realm) {
      const width = window.innerWidth
      const height = window.innerHeight

      particlesRef.current.forEach((p) => {
        p.color = config.colors[Math.floor(Math.random() * config.colors.length)]
        p.vx += (Math.random() - 0.5) * 2
        p.vy += (Math.random() - 0.5) * 2
      })

      const diff = config.particleCount - particlesRef.current.length
      if (diff > 0) {
        for (let i = 0; i < diff; i++) {
          particlesRef.current.push(createParticle(width, height, config.colors))
        }
      } else if (diff < 0) {
        particlesRef.current = particlesRef.current.slice(0, config.particleCount)
      }

      prevRealmRef.current = realm
    }
  }, [realm, config.colors, config.particleCount, createParticle])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const width = window.innerWidth
    const height = window.innerHeight
    const mouseX = mousePos.x * width
    const mouseY = mousePos.y * height

    const animate = () => {
      timeRef.current += 0.016
      ctx.clearRect(0, 0, width, height)

      // Draw connections for certain realms
      if (realm === "cosmos" || realm === "void" || realm === "deep" || realm === "nebula") {
        ctx.strokeStyle = config.colors[0]
        particlesRef.current.forEach((p1, i) => {
          particlesRef.current.slice(i + 1).forEach((p2) => {
            const dx = p1.x - p2.x
            const dy = p1.y - p2.y
            const dist = Math.sqrt(dx * dx + dy * dy)
            if (dist < 120) {
              ctx.globalAlpha = (1 - dist / 120) * 0.08 * dayBrightness
              ctx.beginPath()
              ctx.moveTo(p1.x, p1.y)
              ctx.lineTo(p2.x, p2.y)
              ctx.stroke()
            }
          })
        })
      }

      particlesRef.current.forEach((p, i) => {
        if (cursorFollowEnabled) {
          const dx = mouseX - p.x
          const dy = mouseY - p.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          const maxDist = 250

          if (dist < maxDist) {
            const force = (1 - dist / maxDist) * 0.03
            p.vx += dx * force * 0.1
            p.vy += dy * force * 0.1
          }
        }

        // Realm-specific behavior
        switch (realm) {
          case "rain":
            p.vy += 0.05
            p.vx += Math.sin(timeRef.current + p.x * 0.01) * 0.008
            p.vx *= 0.98
            if (p.y > height + 20) {
              p.y = -20
              p.x = Math.random() * width
            }
            break
          case "snow":
            p.vy += 0.01
            p.vx += Math.sin(timeRef.current * 0.5 + p.x * 0.005) * 0.02
            p.vx *= 0.99
            if (p.y > height + 20) {
              p.y = -20
              p.x = Math.random() * width
            }
            break
          case "cosmos":
          case "nebula":
            const centerX = width / 2
            const centerY = height / 2
            const toCenterX = centerX - p.x
            const toCenterY = centerY - p.y
            const distToCenter = Math.sqrt(toCenterX * toCenterX + toCenterY * toCenterY)
            if (distToCenter > 50) {
              p.vx += (toCenterX / distToCenter) * 0.002
              p.vy += (toCenterY / distToCenter) * 0.002
              p.vx += (-toCenterY / distToCenter) * 0.001
              p.vy += (toCenterX / distToCenter) * 0.001
            }
            break
          case "aurora":
            p.vx += Math.sin(p.y * 0.008 + timeRef.current * 0.5) * 0.02
            p.vy += Math.cos(p.x * 0.005 + timeRef.current * 0.3) * 0.005
            break
          case "deep":
            p.vy -= 0.008
            p.vx += Math.sin(timeRef.current * 0.5 + p.x * 0.008) * 0.015
            break
          case "ember":
            p.vy -= 0.02
            p.vx += (Math.random() - 0.5) * 0.08
            p.alpha = Math.max(0, p.alpha - 0.0005)
            break
          case "mist":
            p.vx += Math.sin(timeRef.current * 0.2 + p.y * 0.003) * 0.008
            p.vy += Math.cos(timeRef.current * 0.15 + p.x * 0.003) * 0.005
            break
          case "void":
            p.vx *= 0.995
            p.vy *= 0.995
            break
          case "bloom":
            const angleBloom = Math.atan2(p.y - height / 2, p.x - width / 2)
            p.vx += Math.cos(angleBloom + Math.PI / 2) * 0.005
            p.vy += Math.sin(angleBloom + Math.PI / 2) * 0.005
            p.vy -= 0.003
            break
          case "ocean":
            p.vx += Math.sin(timeRef.current * 0.3 + p.y * 0.01) * 0.03
            p.vy += Math.cos(timeRef.current * 0.2 + p.x * 0.005) * 0.01
            break
          case "firefly":
            // Random direction changes
            if (Math.random() < 0.02) {
              p.vx += (Math.random() - 0.5) * 0.3
              p.vy += (Math.random() - 0.5) * 0.3
            }
            p.vx *= 0.98
            p.vy *= 0.98
            // Blinking effect
            p.blinkPhase += p.blinkSpeed
            break
        }

        // Apply velocity
        p.x += p.vx
        p.y += p.vy
        p.rotation += p.rotationSpeed

        // Damping
        p.vx *= 0.995
        p.vy *= 0.995

        // Life cycle
        p.life++
        const lifeRatio = p.life / p.maxLife
        const fadeAlpha = lifeRatio < 0.15 ? lifeRatio / 0.15 : lifeRatio > 0.85 ? (1 - lifeRatio) / 0.15 : 1

        // Wrap around edges
        if (realm !== "rain" && realm !== "snow") {
          if (p.x < -50) p.x = width + 50
          if (p.x > width + 50) p.x = -50
          if (p.y < -50) p.y = height + 50
          if (p.y > height + 50) p.y = -50
        }

        // Reset if life exceeded
        if (p.life > p.maxLife) {
          particlesRef.current[i] = createParticle(width, height, config.colors)
        }

        // Draw particle
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rotation)

        // Calculate alpha with firefly blink
        let drawAlpha = p.alpha * fadeAlpha * dayBrightness
        if (realm === "firefly") {
          drawAlpha *= (Math.sin(p.blinkPhase) + 1) * 0.5
        }

        ctx.beginPath()
        if (realm === "bloom") {
          ctx.ellipse(0, 0, p.size * 2, p.size * 0.8, 0, 0, Math.PI * 2)
        } else if (realm === "rain") {
          ctx.ellipse(0, 0, p.size * 0.5, p.size * 2.5, 0, 0, Math.PI * 2)
        } else if (realm === "snow") {
          // Snowflake shape
          for (let j = 0; j < 6; j++) {
            ctx.moveTo(0, 0)
            ctx.lineTo(Math.cos((j * Math.PI) / 3) * p.size * 2, Math.sin((j * Math.PI) / 3) * p.size * 2)
          }
          ctx.strokeStyle = p.color
          ctx.globalAlpha = drawAlpha
          ctx.lineWidth = 0.5
          ctx.stroke()
          ctx.restore()
          return
        } else {
          ctx.arc(0, 0, p.size, 0, Math.PI * 2)
        }

        ctx.fillStyle = p.color
        ctx.globalAlpha = drawAlpha
        ctx.fill()

        // Draw glow
        const glowSize = realm === "firefly" ? p.size * 8 : p.size * 5
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, glowSize)
        gradient.addColorStop(0, p.color)
        gradient.addColorStop(1, "transparent")
        ctx.beginPath()
        ctx.arc(0, 0, glowSize, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.globalAlpha = drawAlpha * (realm === "firefly" ? 0.5 : 0.25)
        ctx.fill()

        ctx.restore()
      })

      ctx.globalAlpha = 1
      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [mousePos, realm, config.colors, createParticle, dayBrightness, cursorFollowEnabled])

  return <canvas ref={canvasRef} className="fixed inset-0 z-0" style={{ background: "transparent" }} />
}
