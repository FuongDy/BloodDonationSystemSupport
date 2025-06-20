import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { AppShell } from '@mantine/core'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotfoundPage'
import ForbiddenPage from './pages/ForbiddenPage'
import MainLayout from './components/layouts/MainLayout'

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/forbidden" element={<ForbiddenPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
