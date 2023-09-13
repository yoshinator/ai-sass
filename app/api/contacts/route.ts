import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

import { getContacts } from '@/controllers/contacts'

export async function GET() {
  try {
    const { userId } = auth()

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }
    //get all contacts from prisma
    const contacts = await getContacts(userId || '')

    return NextResponse.json({
      contacts,
    })
  } catch (error) {
    console.log(error)
    return new NextResponse('Unknown error: ' + error, { status: 500 })
  }
}
