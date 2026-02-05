import Header from '@/components/Header'
import Menu from '@/components/Menu'
import { Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <div className="w-full p-4 mx-auto lg:p-8">
      <Header />
      <Menu />
      <Outlet />
    </div>
  )
}
