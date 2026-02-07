import { Link, useLocation } from 'react-router-dom'

export default function Menu() {
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  const navItems = [
    { path: '/', label: 'Execution' },
    { path: '/account', label: 'My transactions' },
    { path: '/config', label: 'Configuration' },
    { path: '/instructions', label: 'Instructions' },
  ]

  return (
    <nav className="mb-4">
      <ul className="flex items-center gap-6">
        {navItems.map((item) => {
          const active = isActive(item.path)
          return (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`text-lg font-semibold transition-colors hover:text-foreground ${active ? 'text-foreground' : 'text-muted-foreground/80'}`}
              >
                {item.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
