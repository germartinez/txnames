import { cn } from '@/lib/utils'
import { Link, useLocation } from 'react-router-dom'

export default function Menu() {
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/config', label: 'Configuration' },
    { path: '/account', label: 'My transactions' },
  ]

  return (
    <nav className="mb-8 border-b">
      <ul className="flex items-center gap-1">
        {navItems.map((item) => {
          const active = isActive(item.path)
          return (
            <li key={item.path}>
              <Link
                to={item.path}
                className={cn(
                  'relative inline-flex items-center px-4 py-3 text-sm font-medium transition-colors',
                  'hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                  active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground/80',
                )}
              >
                {item.label}
                {active && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
