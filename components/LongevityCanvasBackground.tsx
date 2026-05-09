'use client'

import { useEffect, useRef, forwardRef } from 'react'

export type PresetType = 'dna_helix' | 'mito_lightwave' | 'cellular_pulse' | 'quantum_grid'

export interface CanvasConfig {
  preset: PresetType
  speed: number
  complexity: number
  glowColor: string
  particleSize: number
  lineWidth: number
  bloomEffect: boolean
}

interface Props {
  id?: string
  config: CanvasConfig
  className?: string
  width?: number
  height?: number
}

const addAlpha = (hex: string, alpha: number) => {
  const cleaned = hex.replace('#', '')
  const r = parseInt(cleaned.substring(0, 2), 16)
  const g = parseInt(cleaned.substring(2, 4), 16)
  const b = parseInt(cleaned.substring(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export const LongevityCanvasBackground = forwardRef<HTMLCanvasElement, Props>(({
  id = 'longevity-bg-canvas',
  config,
  className = 'w-full h-full absolute inset-0 pointer-events-none',
  width,
  height,
}, ref) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const configRef = useRef<CanvasConfig>(config)

  useEffect(() => { configRef.current = config }, [config])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    if (width && height) {
      canvas.width = width
      canvas.height = height
      return
    }

    const handleResize = () => {
      const parent = canvas.parentElement
      if (parent) {
        canvas.width = parent.clientWidth
        canvas.height = parent.clientHeight
      }
    }
    const observer = new ResizeObserver(handleResize)
    if (canvas.parentElement) observer.observe(canvas.parentElement)
    handleResize()
    return () => observer.disconnect()
  }, [width, height])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const draw = (w: number, h: number, time: number) => {
      const { preset, speed, complexity, glowColor, particleSize, lineWidth, bloomEffect } = configRef.current
      const t = time * 0.0015 * speed

      ctx.fillStyle = 'rgba(9,10,12,0.18)'
      ctx.fillRect(0, 0, w, h)

      ctx.strokeStyle = 'rgba(197,168,128,0.03)'
      ctx.lineWidth = 1
      const gridSize = Math.min(w, h) / 12
      for (let x = 0; x < w; x += gridSize) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke()
      }
      for (let y = 0; y < h; y += gridSize) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke()
      }

      ctx.shadowColor = bloomEffect ? glowColor : 'transparent'
      ctx.shadowBlur = bloomEffect ? 15 : 0

      if (preset === 'dna_helix') {
        const centerX = w / 2
        const centerY = h / 2
        const length = Math.sqrt(w * w + h * h) * 0.8
        const helixRadius = Math.min(w, h) * 0.16
        const rotationAngle = -Math.PI / 6

        for (let i = 0; i < complexity; i++) {
          const spiralPos = i / complexity - 0.5
          const spiralAngle = spiralPos * Math.PI * 5 + t * 0.8
          const xOffset = spiralPos * length
          const yOffset1 = Math.sin(spiralAngle) * helixRadius
          const yOffset2 = -Math.sin(spiralAngle) * helixRadius
          const z1 = Math.cos(spiralAngle)
          const z2 = -Math.cos(spiralAngle)
          const rotX1 = centerX + xOffset * Math.cos(rotationAngle) - yOffset1 * Math.sin(rotationAngle)
          const rotY1 = centerY + xOffset * Math.sin(rotationAngle) + yOffset1 * Math.cos(rotationAngle)
          const rotX2 = centerX + xOffset * Math.cos(rotationAngle) - yOffset2 * Math.sin(rotationAngle)
          const rotY2 = centerY + xOffset * Math.sin(rotationAngle) + yOffset2 * Math.cos(rotationAngle)
          const op1 = (z1 + 1.25) / 2.25
          const op2 = (z2 + 1.25) / 2.25

          if (z1 > -0.8 && z2 > -0.8) {
            ctx.strokeStyle = addAlpha(glowColor, 0.12 * Math.min(op1, op2))
            ctx.lineWidth = lineWidth * 0.5
            ctx.beginPath(); ctx.moveTo(rotX1, rotY1); ctx.lineTo(rotX2, rotY2); ctx.stroke()
          }
          ctx.fillStyle = z1 > 0 ? addAlpha(glowColor, op1) : addAlpha('#A3C2F2', op1 * 0.7)
          ctx.beginPath(); ctx.arc(rotX1, rotY1, particleSize * (0.8 + z1 * 0.3), 0, Math.PI * 2); ctx.fill()
          ctx.fillStyle = z2 > 0 ? addAlpha(glowColor, op2) : addAlpha('#C5A880', op2 * 0.7)
          ctx.beginPath(); ctx.arc(rotX2, rotY2, particleSize * (0.8 + z2 * 0.3), 0, Math.PI * 2); ctx.fill()
        }
      } else if (preset === 'mito_lightwave') {
        for (let j = 0; j < 5; j++) {
          ctx.beginPath()
          const cycle = j / 5
          ctx.strokeStyle = addAlpha(glowColor, 0.08 + (1 - cycle) * 0.2)
          ctx.lineWidth = lineWidth * (1 + cycle * 2)
          for (let x = 0; x < w; x += 10) {
            const normX = x / w
            const y = h * 0.5 + (Math.sin(normX * Math.PI * 2 + t * 0.5 + cycle * Math.PI) * 120 + Math.cos(normX * Math.PI * 4 - t * 0.7) * 45) * Math.sin(normX * Math.PI)
            if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y)
          }
          ctx.stroke()
        }
      } else if (preset === 'cellular_pulse') {
        const cx = w / 2, cy = h / 2
        for (let i = 0; i < complexity; i++) {
          const angle = (i / complexity) * Math.PI * 2 + t * 0.3
          const r = Math.min(w, h) * 0.3 * (0.5 + Math.sin(t * 0.5 + i * 0.4) * 0.5)
          const x = cx + Math.cos(angle) * r
          const y = cy + Math.sin(angle) * r
          ctx.fillStyle = addAlpha(glowColor, 0.4 + Math.sin(t + i) * 0.3)
          ctx.beginPath(); ctx.arc(x, y, particleSize, 0, Math.PI * 2); ctx.fill()
        }
      } else if (preset === 'quantum_grid') {
        for (let i = 0; i < complexity; i++) {
          const x = (i % 10) * (w / 10) + Math.sin(t + i * 0.5) * 20
          const y = Math.floor(i / 10) * (h / (complexity / 10)) + Math.cos(t * 0.7 + i * 0.3) * 20
          ctx.strokeStyle = addAlpha(glowColor, 0.15 + Math.sin(t * 0.5 + i) * 0.1)
          ctx.lineWidth = lineWidth
          ctx.strokeRect(x - 10, y - 10, 20, 20)
        }
      }
    }

    let start: number | null = null
    const tick = (now: number) => {
      if (!start) start = now
      draw(canvas.width, canvas.height, now - start)
      animationFrameRef.current = requestAnimationFrame(tick)
    }
    animationFrameRef.current = requestAnimationFrame(tick)
    return () => { if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current) }
  }, [])

  return <canvas ref={canvasRef} id={id} className={className} />
})
LongevityCanvasBackground.displayName = 'LongevityCanvasBackground'
