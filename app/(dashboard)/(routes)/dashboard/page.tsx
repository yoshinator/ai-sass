'use client'
import { ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { Card } from '@/app/components/ui/card'
import { tools } from '@/constants'
import { cn } from '@/lib/utils'

const DashBoardPage = () => {
  const router = useRouter()

  return (
    <div>
      <div className="mb-8 space-y-4">
        <h2 className="text-2xl md:text-4xl font-bold">
          Explore the Power of AI
        </h2>
        <p className="text-muted-foreground font-light text-sm md:text-lg text-center">
          Chat with the smartest AI on the planet. Generate music, video, and
          code with the power of GPT-4
        </p>
        <div className="px-4 md:px-20 lg:px-32 space-y-4">
          {tools.map((tool) => (
            <Card
              className="p-4 border-black/5 flex items-center justify-between hover:shadow-md transition cursor-pointer"
              key={tool.href}
              onClick={() => router.push(tool.href)}
            >
              <div className="flex items-center gap-x-4">
                <div className={cn('p-2 w-fit rounded-md', tool.bgColor)}>
                  <tool.icon className={cn(tool.color, 'w-8 h-8')} />
                </div>
                <div className="font-semibold">{tool.label}</div>
              </div>
              <ArrowRight className="w-5 h-5" />
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DashBoardPage
