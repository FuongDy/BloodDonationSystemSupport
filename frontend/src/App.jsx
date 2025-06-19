import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { AppShell } from '@mantine/core'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotfoundPage'
import Footer from './components/layouts/Footer'
import Navbar from './components/layouts/Navbar'
import ForbiddenPage from './pages/ForbiddenPage'

export default function App() {
  return (
    <AppShell
      header={{ height: 64 }}
      footer={{ height: 'auto' }}
      padding={0}
    >
      <AppShell.Header>
        <Navbar />
      </AppShell.Header>
      
      <AppShell.Main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/forbidden" element={<ForbiddenPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AppShell.Main>
      
      <AppShell.Footer>
        <Footer />
      </AppShell.Footer>
    </AppShell>
  )
}
