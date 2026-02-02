import Header from '@/components/Header'
import { Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <div className="w-full p-4 max-w-7xl mx-auto lg:p-8">
      <Header />
      <Outlet />
    </div>
  )
}
