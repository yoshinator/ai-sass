'use client'
import { useEffect, useState } from 'react'

import { Zap } from 'lucide-react'

import { Button } from '@/app/components/ui/button'
import { Card, CardContent } from '@/app/components/ui/card'
import { Progress } from '@/app/components/ui/progress'
import { useProModal } from '@/app/hooks/use-pro-modal'
import { MAX_FREE_COUNTS } from '@/constants'

interface FreeCounterProps {
  apiLimitCount: number
}

export const FreeCounter = ({ apiLimitCount = 0 }: FreeCounterProps) => {
  const [mounted, setMounted] = useState(false)
  const proModal = useProModal()
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }
  return (
    <div className="px-3">
      <Card className="bg-white/10 border-0">
        <CardContent className="py-6">
          <div className="text-center text-sm text-white mb-4 space-y-2">
            <p>
              {apiLimitCount} / {MAX_FREE_COUNTS} free AI generations
            </p>
            <Progress
              className="h-2"
              value={(apiLimitCount / MAX_FREE_COUNTS) * 100}
            />
            {/* TODO: add limits for email sends and text */}
            <p>5 / 100 free emails left</p>
            <Progress className="h-2" value={5} />
            <p>9 / 10 free sms text left</p>
            <Progress className="h-2" value={90} />
            <Button
              className="w-full"
              variant="premium"
              onClick={proModal.onOpen}
            >
              Upgrade <Zap className="w-4 h-4 ml-2 fill-white" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
