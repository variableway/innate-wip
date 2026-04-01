"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { HeroVariantA } from "./hero-variant-a"
import { HeroVariantB } from "./hero-variant-b"
import { HeroVariantC } from "./hero-variant-c"
import { HeroVariantD } from "./hero-variant-d"
import { Button } from "@allone/ui"
import { LayoutGrid, Split, Maximize, Shapes, Palette } from "lucide-react"

type HeroVariant = "a" | "b" | "c" | "d"

interface VariantOption {
  id: HeroVariant
  label: string
  description: string
  icon: React.ReactNode
  component: React.ComponentType
}

const variants: VariantOption[] = [
  {
    id: "a",
    label: "Dynamic Grid",
    description: "Animated background with stats",
    icon: <LayoutGrid className="h-4 w-4" />,
    component: HeroVariantA,
  },
  {
    id: "b",
    label: "Split Layout",
    description: "Side-by-side with content preview",
    icon: <Split className="h-4 w-4" />,
    component: HeroVariantB,
  },
  {
    id: "c",
    label: "Immersive",
    description: "Full-screen with parallax",
    icon: <Maximize className="h-4 w-4" />,
    component: HeroVariantC,
  },
  {
    id: "d",
    label: "Geometric",
    description: "Shapes with feature cards",
    icon: <Shapes className="h-4 w-4" />,
    component: HeroVariantD,
  },
]

// 切换器 UI
function VariantSelector({
  currentVariant,
  onVariantChange,
}: {
  currentVariant: HeroVariant
  onVariantChange: (variant: HeroVariant) => void
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="fixed top-20 right-6 z-50">
      {/* 切换按钮 */}
      <Button
        variant="outline"
        size="sm"
        className="bg-background/80 backdrop-blur-sm border-[#8FA68E]/30 hover:bg-[#8FA68E]/10"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Palette className="h-4 w-4 mr-2" />
        Design: {variants.find((v) => v.id === currentVariant)?.label}
      </Button>

      {/* 下拉菜单 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full right-0 mt-2 w-64 bg-card border border-border rounded-lg shadow-xl overflow-hidden"
          >
            <div className="p-2">
              <p className="text-xs text-muted-foreground px-2 py-1 mb-1">
                Choose Hero Design
              </p>
              {variants.map((variant) => (
                <button
                  key={variant.id}
                  onClick={() => {
                    onVariantChange(variant.id)
                    setIsOpen(false)
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition-colors ${
                    currentVariant === variant.id
                      ? "bg-[#8FA68E]/10 text-[#8FA68E]"
                      : "hover:bg-secondary"
                  }`}
                >
                  <div
                    className={`p-1.5 rounded ${
                      currentVariant === variant.id
                        ? "bg-[#8FA68E]/20"
                        : "bg-secondary"
                    }`}
                  >
                    {variant.icon}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{variant.label}</div>
                    <div className="text-xs text-muted-foreground">
                      {variant.description}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 点击外部关闭 */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[-1]"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}

// 主组件
export function HeroSwitcher() {
  const [currentVariant, setCurrentVariant] = useState<HeroVariant>("d")
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("hero-variant") as HeroVariant
    if (saved && variants.find((v) => v.id === saved)) {
      setCurrentVariant(saved)
    }
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("hero-variant", currentVariant)
    }
  }, [currentVariant, isLoaded])

  const CurrentComponent = variants.find((v) => v.id === currentVariant)?.component

  if (!CurrentComponent) {
    return null
  }

  return (
    <>
      {/* 切换器 UI */}
      <VariantSelector
        currentVariant={currentVariant}
        onVariantChange={setCurrentVariant}
      />

      {/* Hero 内容 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentVariant}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <CurrentComponent />
        </motion.div>
      </AnimatePresence>
    </>
  )
}
