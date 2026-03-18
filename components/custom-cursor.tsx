"use client"

import { useEffect, useState } from "react"

interface CustomCursorProps {
  visible: boolean
  color: string
}

export function CustomCursor({ visible, color }: CustomCursorProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isPointer, setIsPointer] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })

      const target = e.target as HTMLElement
      setIsPointer(
        target.tagName === "BUTTON" ||
          target.tagName === "A" ||
          target.closest("button") !== null ||
          target.closest("a") !== null ||
          window.getComputedStyle(target).cursor === "pointer",
      )
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  if (!visible) return null

  return (
    <>
      {/* Main cursor dot */}
      <div
        className="custom-cursor transition-transform duration-100"
        style={{
          left: position.x,
          top: position.y,
          transform: `translate(-50%, -50%) scale(${isPointer ? 1.5 : 1})`,
        }}
      >
        <div
          className="w-3 h-3 rounded-full transition-all duration-200"
          style={{
            backgroundColor: color,
            boxShadow: `0 0 20px ${color}80, 0 0 40px ${color}40`,
          }}
        />
      </div>

      {/* Cursor trail ring */}
      <div
        className="custom-cursor transition-all duration-300 ease-out"
        style={{
          left: position.x,
          top: position.y,
          transform: `translate(-50%, -50%) scale(${isPointer ? 1.2 : 1})`,
        }}
      >
        <div
          className="w-8 h-8 rounded-full border transition-all duration-200"
          style={{
            borderColor: `${color}40`,
          }}
        />
      </div>
    </>
  )
}
