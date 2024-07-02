import React, { useContext } from 'react'
import { Context } from '@app/store/Context'
export function useStore() {
  return useContext(Context)
}
