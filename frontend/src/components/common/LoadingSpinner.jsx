import React from 'react'
import { Loader, Box } from '@mantine/core'

export default function LoadingSpinner({ size = 'md', color = 'red' }) {
  return (
    <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Loader size={size} color={color} />
    </Box>
  )
}
