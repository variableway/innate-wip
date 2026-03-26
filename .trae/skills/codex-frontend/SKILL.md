---
name: "codex-frontend"
description: "Expert frontend development skill for OpenAI Codex. Invoke when building UI components, React applications, or generating HTML/CSS with OpenAI models."
---

# Codex Frontend Development Skill

Expert frontend development guidance optimized for OpenAI Codex and GPT-5 models.

## Core Principles

### Framework Specifications
Always prefix prompts with framework and version:
- React 19, TypeScript 6, Next.js App Router
- Tailwind CSS for styling
- Radix UI for accessible primitives

### Atomic Prompting Strategy
Break down complex UIs into smaller, manageable components:
1. Start with individual components
2. Compose into larger features
3. Integrate with data layer
4. Add interactions and animations

### Code Generation Best Practices

#### React Components
```tsx
'use client'

import { forwardRef, type ComponentPropsWithoutRef } from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  variant?: 'default' | 'destructive' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-md font-medium',
          'transition-colors focus-visible:outline-none focus-visible:ring-2',
          {
            'bg-primary text-primary-foreground hover:bg-primary/90': variant === 'default',
            'bg-destructive text-destructive-foreground hover:bg-destructive/90': variant === 'destructive',
            'border border-input bg-background hover:bg-accent': variant === 'outline',
            'hover:bg-accent hover:text-accent-foreground': variant === 'ghost',
          },
          {
            'h-9 px-3 text-sm': size === 'sm',
            'h-10 px-4 text-base': size === 'md',
            'h-11 px-6 text-lg': size === 'lg',
          },
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button }
```

### UI Quality Standards
- Use TypeScript strict mode
- Implement proper prop types and generics
- Handle edge cases gracefully
- Provide loading and error states
- Ensure keyboard accessibility
- Support screen readers

### Styling Guidelines
- Use Tailwind utility classes
- Implement CSS variables for theming
- Support dark mode natively
- Use consistent spacing scale
- Apply meaningful animations

## Workflow Integration

### Iterative Development
1. Generate base component structure
2. Refine with specific requirements
3. Add accessibility features
4. Implement responsive design
5. Add animations and interactions

### Integration Patterns
- Connect to API endpoints
- Implement form validation with zod
- Use react-hook-form for forms
- Integrate with state management
- Handle async operations properly

## Quality Checklist
- [ ] TypeScript types complete
- [ ] Props validated with proper types
- [ ] Accessibility attributes present
- [ ] Responsive design implemented
- [ ] Dark mode supported
- [ ] Loading/error states handled
- [ ] Animations smooth and purposeful
