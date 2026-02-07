import Header from '@/components/header'
import Menu from '@/components/menu'
import { Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <div className="w-full p-6 mx-auto md:py-16 max-w-3xl">
      <Header />
      <Menu />
      <Outlet />
    </div>
  )
}
