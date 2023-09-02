'use client'

import {
  Code,
  Contact,
  ImageIcon,
  LayoutDashboard,
  LayoutTemplate,
  MessageSquare,
  Music,
  Settings,
  VideoIcon,
} from 'lucide-react'
import { Montserrat } from 'next/font/google'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { cn } from '@/lib/utils'

const montserrat = Montserrat({
  weight: '600',
  subsets: ['latin'],
})

const routes = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    color: 'text-sky-500',
    icon: LayoutDashboard,
  },
  {
    label: 'Conversation',
    href: '/conversation',
    color: 'text-violet-500',
    icon: MessageSquare,
  },
  {
    label: 'Image Generation',
    href: '/image',
    color: 'text-pink-700',
    icon: ImageIcon,
  },
  {
    label: 'Video Generation',
    href: '/video',
    color: 'text-orange-700',
    icon: VideoIcon,
  },
  {
    label: 'Music Generation',
    href: '/music',
    color: 'text-emerald-500',
    icon: Music,
  },
  {
    label: 'Code Generation',
    href: '/code',
    color: 'text-green-700',
    icon: Code,
  },
  {
    label: 'Contacts',
    href: '/contacts',
    color: 'text-yellow-500',
    icon: Contact,
  },
  {
    label: 'Templates',
    href: '/templates',
    color: 'text-red-700',
    icon: LayoutTemplate,
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: Settings,
  },
]

const Sidebar = () => {
  const pathname = usePathname()
  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-[#111827] text-white">
      <div className="px-3 py-2 flex-1">
        <Link className="flex items-baseline pl-3 mb-14" href="/dashboard">
          <div className="relative w-10 h-8 mr-4">
            <Image alt="logo" height={40} src="/logo.svg" width={40} />
          </div>
          <h1 className={cn('text-2xl font-bold', montserrat.className)}>Web Review Kit</h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              className={cn(
                'text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition',
                pathname === route.href ? 'text-white bg-white/10' : 'text-zinc-400'
              )}
              href={route.href}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn('h-5 w-5 mr-3', route.color)} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
export default Sidebar
