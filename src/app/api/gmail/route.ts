import { auth } from '@clerk/nextjs'
import { NextResponse, NextRequest } from 'next/server'
import { gmail_v1, google } from 'googleapis'
import clerk from '@clerk/clerk-sdk-node'

async function fetchMessages(gmail: gmail_v1.Gmail, options: any) {
  return await gmail.users.messages.list({
    userId: 'me',
    labelIds: ['INBOX'],
    maxResults: 100,
    ...options,
  })
}

async function getMessageSender(gmail: any, messageId: string) {
  const args = {
    format: 'metadata',
    metadataHeaders: ['From'],
    fields: 'payload/headers',
  }
  const message = await gmail.users.messages.get({
    userId: 'me',
    id: messageId,
    ...args,
  })

  const headers = message.data.payload?.headers
  const fromHeader = headers?.find((header: any) => header.name === 'From')

  return fromHeader ? fromHeader.value : null
}

export async function GET(req: Request) {
  const url = new URL(req.url)
  const pageToken = url.searchParams.get('pageToken')

  try {
    const { userId } = auth()
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const [OauthAccessToken] = await clerk.users.getUserOauthAccessToken(
      userId,
      'oauth_google'
    )
    const { token } = OauthAccessToken

    if (!token) {
      return new NextResponse('Unauthorized NO TOKEN', { status: 401 })
    }

    const gmail = google.gmail({
      version: 'v1',
      headers: { Authorization: `Bearer ${token}` },
    })

    const emailResults: { [email: string]: number } = {}

    // If a nextPageToken was passed in, use it.

    const options = pageToken ? { pageToken } : {}

    const messagesResponse = await fetchMessages(gmail, options)

    const messages = messagesResponse.data.messages
    if (messages) {
      for (const msgObj of messages) {
        const messageId = msgObj.id
        if (messageId) {
          const emailStr = await getMessageSender(gmail, messageId)
          const email = extractEmailFromAddress(emailStr)
          if (email && email.includes('@')) {
            emailResults[email] = (emailResults[email] || 0) + 1 // Updated this line
          }
        }
      }
    }

    const nextPageToken = messagesResponse.data.nextPageToken
    return NextResponse.json({
      emails: Object.keys(emailResults),
      nextPageToken,
    })
  } catch (error) {
    console.log('[GMAIL ERROR]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}

function extractEmailFromAddress(emailStr: string | null): string | null {
  // regex that matches email addresses
  const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/
  const matches = emailStr?.match(emailRegex)
  if (matches) {
    emailStr = matches[0]
  }
  return emailStr
}
