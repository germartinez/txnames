import { Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <div className="w-full p-6 max-w-6xl mx-auto lg:p-16 border">
      <Outlet />
    </div>
  )
}
