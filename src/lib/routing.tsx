import type { ComponentProps, ReactNode } from "react"
import { Link, useNavigate, useParams as useTanstackParams, useRouterState } from "@tanstack/react-router"
import { withBasePath } from "./base-path"

type AppLinkProps = Omit<ComponentProps<"a">, "href"> & {
  href: string
  children?: ReactNode
}

/** Next `<Link href>` 兼容层：站内路径自动加 domain 前缀。 */
export function AppLink({ href, children, ...props }: AppLinkProps) {
  if (href.startsWith("http://") || href.startsWith("https://")) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    )
  }
  return (
    <Link to={withBasePath(href) as never} {...props}>
      {children}
    </Link>
  )
}

export function useParams(): Record<string, string> {
  return useTanstackParams({ strict: false }) as Record<string, string>
}

export function usePathname(): string {
  return useRouterState({ select: (s) => s.location.pathname })
}

export function useRouter() {
  const navigate = useNavigate()
  return {
    push: (href: string) => {
      void navigate({ to: withBasePath(href) as never })
    },
  }
}
