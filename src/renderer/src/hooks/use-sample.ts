import { useState } from 'react'

export function useSample(): string {
  const [value] = useState('sample')

  return value
}
