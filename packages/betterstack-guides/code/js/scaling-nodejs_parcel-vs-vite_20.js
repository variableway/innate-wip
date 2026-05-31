# Source: https://betterstack.com/community/guides/scaling-nodejs/parcel-vs-vite/
# Original language: jsx
# Normalized: js
# Block index: 20

// React component (works without configuration)
import React from 'react'
import './Button.css'

export function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  )
}