import Layout from '@/components/Layout'
import Account from '@/pages/account'
import Config from '@/pages/config'
import Home from '@/pages/home'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/config" element={<Config />} />
          <Route path="/account" element={<Account />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
