import React from 'react'

type CardProps = {
  title: React.ReactNode
  children: React.ReactNode
  actions?: React.ReactNode
  className?: string
}

export default function Card({ title, children, actions, className }: CardProps) {
  return (
    <section style={{margin: '10px'}} className={`card ${className ?? ''}`}>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[13px] font-semibold text-ufpb-dark">{title}</h2>
        {actions}
      </div>
      <div>{children}</div>
    </section>
  )
}