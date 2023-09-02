'use client'

import { useEffect, useState } from 'react'

import { Menu } from 'lucide-react'

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

import Sidebar from './sidebar'

const MobileSidebar = () => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null
  return (
    <Sheet>
      <SheetTrigger>
        <Menu className="md:hidden" />
      </SheetTrigger>
      <SheetContent className="p-0" side="left">
        <Sidebar />
      </SheetContent>
    </Sheet>
  )
}

export default MobileSidebar
