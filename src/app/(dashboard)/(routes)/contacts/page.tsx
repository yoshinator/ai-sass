'use client'

import { useEffect } from 'react'

import axios from 'axios'
import { Contact } from 'lucide-react'

import { Heading } from '@/components/heading'

const ContactsPage = () => {
  useEffect(() => {
    let currentPageToken: string | null | undefined = null
    const fetchEmails = async () => {
      try {
        const response = await axios.get('/api/gmail', {
          params: { pageToken: currentPageToken },
        })
        console.log('client response', response.data)

        // Update the currentPageToken for the next request
        currentPageToken = response.data.nextPageToken

        // Check if nextPageToken is null or undefined. If so, stop fetching.
        if (!currentPageToken) {
          console.log('Reached the end of the messages')
          return
        }
      } catch (err: any) {
        console.log(err)
      } finally {
        // For demo purposes, we'll fetch the next page of emails automatically
        // after a delay of 2 seconds. In a real app, you would probably want
        // to fetch the next page when the user clicks a "Load more" button.
        if (currentPageToken) {
          setTimeout(fetchEmails, 2000)
        }
      }
    }

    false && fetchEmails()
  }, [])

  return (
    <div>
      <Heading
        bgColor="bg-yellow-500/10"
        description="Import and manage all your contacts"
        icon={Contact}
        iconColor="text-yellow-500"
        title="Contacts"
      />
    </div>
  )
}

export default ContactsPage
