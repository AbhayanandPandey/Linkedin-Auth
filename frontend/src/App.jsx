import { useState } from 'react'
import Home from './components/Home'
import Dashboard from './components/Dashboard'
import { Routes, Route } from 'react-router-dom'
import PrivateRouter from './components/PrivateRouter'

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element=
          {
          <PrivateRouter >
            {<Dashboard />}
          </PrivateRouter>
          }
        />
      </Routes>
    </>
  )
}

export default App
