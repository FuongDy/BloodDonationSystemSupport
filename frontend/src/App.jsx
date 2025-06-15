import React from 'react'
import Button from './components/common/Button'
import LoadingSpinner from './components/common/LoadingSpinner'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotfoundPage'
import { Avatar, AvatarImage, AvatarFallback } from './components/ui/Avatar'
import { Badge } from './components/ui/Badge' // Thêm import cho Badge

export default function App() {
  return (
    <>
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="User Avatar" />
        <AvatarFallback>U</AvatarFallback>
      </Avatar>

      {/* Thêm các Badge để hiển thị */}
      <div className="flex space-x-2 p-4">
        <Badge>Default</Badge>
        <Badge variant="success">Success</Badge>
        <Badge variant="warning">Warning</Badge>
        <Badge variant="error">Error</Badge>
        <Badge variant="info">Info</Badge>
        <Badge variant="primary">Primary</Badge>
        <Badge variant="outline">Outline</Badge>
      </div>
      
      {/* Bạn có thể thêm NotFoundPage hoặc các component khác ở đây nếu cần */}
      {/* <NotFoundPage /> */}
    </>
  )
}
