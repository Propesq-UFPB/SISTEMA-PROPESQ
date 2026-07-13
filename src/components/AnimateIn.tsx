import React from "react"
import { useInView } from "@/components/useInView"

type AnimateInProps = {
  children: React.ReactNode
  delay?: number
  y?: number
  className?: string
}

const AnimateIn: React.FC<AnimateInProps> = ({
  children,
  delay = 0,
  y = 24,
  className = "",
}) => {
  const { ref, visible } = useInView()

  return (
    <div
      ref={ref}
      className={`
        transition-all duration-700 ease-out
        ${visible ? "opacity-100 translate-y-0" : `opacity-0 translate-y-[${y}px]`}
        ${className}
      `}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

export default AnimateIn
