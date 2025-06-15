import React from 'react'
import Button from './components/common/Button'
import LoadingSpinner from './components/common/LoadingSpinner'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotfoundPage'
import { Avatar, AvatarImage, AvatarFallback } from './components/ui/Avatar' // Modified import

export default function App() {
  return (
    <>
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="User Avatar" />
        <AvatarFallback>U</AvatarFallback>
      </Avatar>
      {/* Bạn có thể thêm NotFoundPage hoặc các component khác ở đây nếu cần */}
      {/* <NotFoundPage /> */}
    </>
  )
}
