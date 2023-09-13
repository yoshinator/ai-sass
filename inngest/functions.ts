import clerk from '@clerk/clerk-sdk-node'
import { GmailImportTask, TaskStatus } from '@prisma/client'
import { gmail_v1, google } from 'googleapis'

import { extractEmailFromString, getTextBeforeEmail } from '@/app/utils'
import { createContactsBatch } from '@/controllers/contacts'
import {
  createGmailImportTask,
  getGmailImportTaskByUserId,
  updateGmailImportTask,
} from '@/controllers/gmail-import-task'

import { inngest } from './client'

export const getEmailAddressesFromGmail = inngest.createFunction(
  { name: 'Get Addresses From Gmail' },
  { event: 'get-email-addresses-from-gmail' },
  async ({ event, step }) => {
    let task: GmailImportTask | null = null
    const { userId } = event.data
    try {
      task = await getGmailImportTaskByUserId(userId)
      if (!task) {
        task = await createGmailImportTask(userId)
      }
    } catch (error) {
      console.log('[ERROR CREATING GMAIL IMPORT TAKS]', error)
    }

    try {
      const [OauthAccessToken] = await clerk.users.getUserOauthAccessToken(
        userId,
        'oauth_google'
      )
      const { token } = OauthAccessToken

      if (!token) {
        await step.sendEvent({ name: 'test/hello.world', data: userId })
        return
      }

      const gmail = google.gmail({
        version: 'v1',
        headers: { Authorization: `Bearer ${token}` },
      })

      const emailResults: { [email: string]: string } = {}

      let pageToken: string | null | undefined = null
      // loop to run until there are no more emails to process
      do {
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
              if (email?.includes('@')) {
                emailResults[email] = name?.trim() ?? ''
              }
            }
          }
        }

        pageToken = messagesResponse.data?.nextPageToken
        // need to narrow the type since Prisma Doesn't have a undefined type
        typeof pageToken === 'undefined' && (pageToken = null)

        if (pageToken) {
          await updateGmailImportTask({
            ...task!,
          })
        } else {
          await updateGmailImportTask({
            ...task!,
            nextPageToken: null,
            status: TaskStatus.COMPLETED,
            lastProcessedDate: new Date(),
          })
        }
      } while (pageToken)

      console.log('[GMAIL RESULTS COUNT]', Object.entries(emailResults).length)
      await createContactsBatch(userId, Object.entries(emailResults), 'gmail')
    } catch (error) {
      console.log('[GMAIL ERROR]', error)
    }
  }
)

//async helper functions.
async function fetchMessages(gmail: gmail_v1.Gmail, options: any) {
  return await gmail.users.messages.list({
    userId: 'me',
    labelIds: ['INBOX'],
    maxResults: 200,
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
