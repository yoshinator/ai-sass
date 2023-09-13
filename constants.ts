import {
  Code,
  Contact,
  ImageIcon,
  LayoutTemplate,
  MessageSquare,
} from 'lucide-react'

export const MAX_FREE_COUNTS = 5

export const tools = [
  {
    label: 'Conversation',
    icon: MessageSquare,
    color: 'text-violet-500',
    bgColor: 'bg-violet-500/10',
    href: '/conversation',
  },
  {
    label: 'Image Generation',
    icon: ImageIcon,
    color: 'text-pink-700',
    bgColor: 'bg-pink-500/10',
    href: '/image',
  },
  {
    label: 'Code Generation',
    icon: Code,
    color: 'text-Green-700',
    bgColor: 'bg-green-700/10',
    href: '/code',
  },
  {
    label: 'Contacts',
    href: '/contacts',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
    icon: Contact,
  },
  {
    label: 'Templates',
    href: '/templates',
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10',
    icon: LayoutTemplate,
  },
]
