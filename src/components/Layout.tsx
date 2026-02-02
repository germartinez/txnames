import { queryClient } from '@/client/queryClient'
import Header from '@/components/Header'
import { QueryClientProvider } from '@tanstack/react-query'
import { Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="w-full p-6 max-w-6xl mx-auto lg:p-16">
        <Header />
        <Outlet />
      </div>
    </QueryClientProvider>
  )
}
