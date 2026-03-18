import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import localFont from "next/font/local"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const editorial = localFont({
  src: [
    {
      path: "../public/fonts/PPEditorialNew-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/PPEditorialNew-Italic.woff2",
      weight: "400",
      style: "italic",
    },
  ],
  variable: "--font-editorial",
})

export const metadata: Metadata = {
  title: "Drift | Ambient Escape",
  description: "Enter a world of ambient soundscapes and generative visuals. Let your mind drift.",
    generator: 'v0.app'
}

export const viewport: Viewport = {
  themeColor: "#050506",
  width: "device-width",
  initialScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${editorial.variable} font-sans`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
