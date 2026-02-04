import Header from '@/components/Header'
import { Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <div className="w-full p-4 mx-auto lg:p-8">
      <Header />
      <Outlet />
    </div>
  )
}
