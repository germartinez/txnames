import Layout from '@/components/layout'
import AccountPage from '@/pages/account'
import ConfigPage from '@/pages/config'
import ExecutionPage from '@/pages/execution'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<ExecutionPage />} />
          <Route path="/config" element={<ConfigPage />} />
          <Route path="/account" element={<AccountPage />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
