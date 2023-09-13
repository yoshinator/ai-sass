import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

import { inngest } from '@/inngest/client'

export async function GET() {
  const { userId } = auth()

  try {
    const result = await inngest.send({
      name: 'get-email-addresses-from-gmail',
      data: userId,
    })
    console.log(result)
    return NextResponse.json({
      result,
    })
  } catch (error) {
    console.log(error)
    return new NextResponse('Unknown error: ' + error, { status: 500 })
  }
}
