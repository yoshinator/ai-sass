import clerk from '@clerk/clerk-sdk-node'
import { auth } from '@clerk/nextjs'
import { GmailImportTask, TaskStatus } from '@prisma/client'
import { gmail_v1, google } from 'googleapis'
import { NextResponse } from 'next/server'

import { extractEmailFromString, getTextBeforeEmail } from '@/app/utils'
import { createContactsBatch } from '@/controllers/contacts'
import {
  createGmailImportTask,
  getGmailImportTaskByUserId,
  updateGmailImportTask,
} from '@/controllers/gmail-import-task'

export async function GET(req: Request) {
  const searchParams = new URL(req.url ?? '').searchParams
  const pageToken = searchParams.get('pageToken')
  const { userId } = auth()
  let task: GmailImportTask | null = null

  try {
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    task = await getGmailImportTaskByUserId(userId)
    if (!task) {
      task = await createGmailImportTask(userId)
    }
  } catch (error) {
    console.log('[ERROR CREATING GMAIL IMPORT TAKS]', error)
    return new NextResponse('Internal error', { status: 500 })
  }

  try {
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

    const emailResults: { [email: string]: string } = {}

    const options = pageToken ? { pageToken } : {}

    const messagesResponse = await fetchMessages(gmail, options)

    const messages = messagesResponse.data.messages
    if (messages) {
      for (const msgObj of messages) {
        const messageId = msgObj.id
        if (messageId) {
          const emailStr = await getMessageSender(gmail, messageId)
          const email = extractEmailFromString(emailStr)
          const name = getTextBeforeEmail(emailStr)
          if (email && email.includes('@')) {
            emailResults[email] = name?.trim() ?? ''
          }
        }
      }
      console.log(emailResults)
    }

    const nextPageToken = messagesResponse.data?.nextPageToken

    if (nextPageToken) {
      await updateGmailImportTask({
        ...task,
        nextPageToken,
      })
    } else {
      await updateGmailImportTask({
        ...task,
        status: TaskStatus.COMPLETED,
        lastProcessedDate: new Date(),
      })
    }

    await createContactsBatch(userId, Object.entries(emailResults), 'gmail')

    return NextResponse.json({
      nextPageToken,
    })
  } catch (error) {
    console.log('[GMAIL ERROR]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}

//async helper functions.
async function fetchMessages(gmail: gmail_v1.Gmail, options: any) {
  return await gmail.users.messages.list({
    userId: 'me',
    labelIds: ['INBOX'],
    maxResults: 20,
    ...options,
  })
}

async function getMessageSender(gmail: any, messageId: string) {
  const args = {
    format: 'metadata',
    metadataHeaders: ['From'],
    fields: 'payload/headers,internalDate',
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
