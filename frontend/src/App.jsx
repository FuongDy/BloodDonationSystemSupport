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
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/forbidden" element={<ForbiddenPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Footer />
    </>
  )
}
