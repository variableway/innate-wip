---
name: "claude-frontend"
description: "Expert frontend development skill for Claude Code. Invoke when building React/Next.js UIs, creating components, or implementing frontend designs with Tailwind CSS."
---

# Claude Frontend Development Skill

Expert frontend engineer guidance for Claude Code with React, Next.js, and Tailwind CSS.

## Core Principles

### Typography Guidelines
Avoid generic fonts that create the "AI slop" aesthetic:
- **Never use**: Inter, Roboto, Open Sans, Lato, default system fonts
- **Code aesthetic**: JetBrains Mono, Fira Code, Space Grotesk
- **Editorial**: Playfair Display, Crimson Pro, Fraunces
- **Startup**: Clash Display, Satoshi, Cabinet Grotesk
- **Technical**: IBM Plex family, Source Sans 3
- **Distinctive**: Bricolage Grotesque, Obviously, Newsreader

### Color Strategy
- Avoid flat, solid backgrounds
- Use atmospheric gradients and layered effects
- Create depth with subtle shadows and overlays
- Implement meaningful color contrast for accessibility

### Motion & Animation
- Add micro-interactions for polish
- Use CSS transitions for smooth state changes
- Implement staggered animations for lists
- Consider reduced-motion preferences

### Background Design
- Replace solid colors with atmospheric backgrounds
- Use subtle patterns or noise textures
- Layer multiple gradients for depth
- Consider glassmorphism effects where appropriate

## React/Next.js Patterns

### Component Structure
```tsx
import { cn } from '@innate/ui'
import { cva, type VariantProps } from 'class-variance-authority'

const componentVariants = cva(
  'base-classes-here',
  {
    variants: {
      variant: {
        default: 'default-variant-classes',
        secondary: 'secondary-variant-classes',
      },
      size: {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

interface ComponentProps extends VariantProps<typeof componentVariants> {
  className?: string
  children: React.ReactNode
}

export function Component({ variant, size, className, children }: ComponentProps) {
  return (
    <div className={cn(componentVariants({ variant, size }), className)}>
      {children}
    </div>
  )
}
```

### Tailwind Best Practices
- Use semantic color names via CSS variables
- Implement dark mode with `dark:` prefix
- Group responsive classes: `sm:`, `md:`, `lg:`, `xl:`
- Use `cn()` utility for conditional class merging

## Quality Checklist
- [ ] Accessible (proper ARIA attributes, keyboard navigation)
- [ ] Responsive across breakpoints
- [ ] Dark mode compatible
- [ ] Performant (avoid unnecessary re-renders)
- [ ] Visually distinctive (not generic AI aesthetic)
- [ ] Properly typed with TypeScript
