'use client'

import { ChangeEventHandler, FC, useCallback, useEffect, useState } from 'react'

import Fuse from 'fuse.js'
import { Contact as ContactIcon, ImportIcon } from 'lucide-react'

import { Heading } from '@/app/components/heading'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { Label } from '@/app/components/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select'

import { ContactFormValues } from './constants'
import { ContactRow } from './contact-row'

// Fuse.js options
const fuseOptions = {
  keys: [
    'name',
    'email',
    'primarryAddress',
    'secondaryAddress',
    'source',
    'primaryPhone',
    'secondaryPhone',
  ],
  includeScore: true,
}

const ContactsPage: FC = () => {
  const [searchResults, setSearchResults] = useState<ContactFormValues[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [currentTablePage, setCurrentTablePage] = useState(1)
  const [contactsPerPage, setContactsPerPage] = useState(10)
  const [contacts, setContacts] = useState<ContactFormValues[]>([])
  const [currentContacts, setCurrentContacts] = useState<ContactFormValues[]>(
    []
  )

  const fuse = new Fuse(contacts, fuseOptions)

  // Function to handle search input changes
  const handleSearch: ChangeEventHandler<HTMLInputElement> = (e) => {
    const newSearchTerm = e?.target.value
    setSearchTerm(newSearchTerm)

    // Use Fuse to perform the search
    if (newSearchTerm.length > 0) {
      const results = fuse.search(newSearchTerm)
      setSearchResults(results.map((res) => res.item))
    } else {
      setSearchResults(contacts) // reset if search term is empty
    }
  }

  const indexOfLastContact = currentTablePage * contactsPerPage
  const indexOfFirstContact = indexOfLastContact - contactsPerPage

  useEffect(() => {
    const newCurrentContacts = searchResults.slice(
      indexOfFirstContact,
      indexOfFirstContact + contactsPerPage
    )
    setCurrentContacts(newCurrentContacts)
  }, [currentTablePage, contactsPerPage, indexOfFirstContact, searchResults])

  // use effect fo fetch contacts from /api/contacts
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch('/api/contacts')
        if (response.ok) {
          const { contacts } = await response.json()
          console.log('Received contacts from API:', contacts)
          setContacts(contacts)
          setSearchResults(contacts)
        } else {
          console.log(
            `Fetch request failed with status: ${response.status} ${response.statusText}`
          )
        }
      } catch (err: any) {
        console.log(`An error occurred while fetching contacts: ${err}`)
      }
    }
    fetchContacts()
  }, [])

  const startFetch = useCallback(() => {
    console.log('start fetch')
    //check if there is a GmailImportTask in progress
    const fetchGmailImportTask = async () => {
      try {
        const response = await fetch('/api/gmail/import')
        if (response.ok) {
          const data = await response.json()
          console.log('Received status from API:', data)
        } else {
          console.log(
            `Fetch request failed with status: ${response.status} ${response.statusText}`
          )
        }
      } catch (err: any) {
        console.log(`An error occurred while fetching contacts: ${err}`)
      }
    }
    return fetchGmailImportTask()
    // const fetchEmails = async (token: string | null) => {
    //   try {
    //     // Conditionally add pageToken to URL
    //     const url = new URL('/api/gmail', window.location.origin)
    //     console.log(token)

    //     if (token) {
    //       url.searchParams.append('pageToken', token)
    //     }

    //     const response = await fetch(url.toString())
    //     if (response.ok) {
    //       const data = await response.json()

    //       console.log(
    //         'Received nextPageToken from Gmail API:',
    //         data?.nextPageToken
    //       )

    //       // Check if nextPageToken is null or undefined. If so, stop fetching.
    //       if (!data?.nextPageToken) {
    //         console.log('Reached the end of the messages')
    //         return
    //       }

    //       // Recursive call to fetch next set of emails
    //       fetchEmails(data?.nextPageToken)
    //     } else {
    //       console.log(`Fetch request failed with status: ${response.status}`)
    //     }
    //   } catch (err: any) {
    //     console.log(`An error occurred while fetching emails: ${err}`)
    //   }
    // }
    // fetchEmails(null)
  }, [])

  return (
    <div>
      <Heading
        bgColor="bg-yellow-500/10"
        description="Import and manage all your contacts"
        icon={ContactIcon}
        iconColor="text-yellow-500"
        title="Contacts"
      />
      <div className="container mx-auto">
        <Button
          className="bg-blue-500 hover:bg-blue-600 text-white"
          onClick={startFetch}
        >
          import gmail contacts
          <ImportIcon className="ml-2" />
        </Button>
      </div>
      {/* Dropdown for contacts per page */}
      <div className="p-8">
        <div className="flex justify-between items-center pb-4">
          <h1 className="text-2xl mb-4">Contact List</h1>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="search">Search Contacts</Label>
            <Input
              id="search"
              placeholder="Search contacts"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <div>
            <div>
              <Label className="block " htmlFor="contactsPerPage">
                Contacts per page
              </Label>
              <Select onValueChange={(e) => setContactsPerPage(Number(e))}>
                <SelectTrigger
                  className="w-[180px]"
                  id="contactsPerPage"
                  value={contactsPerPage}
                >
                  <SelectValue>{contactsPerPage}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                    <SelectItem value="250">250</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="border border-gray-200 rounded">
          {/* Header */}
          <div className="grid grid-cols-9 gap-2 border-b border-gray-200 bg-gray-100">
            <div className="p-2 font-semibold">Name</div>
            <div className="p-2 font-semibold">Email</div>
            <div className="p-2 font-semibold">Source</div>
            <div className="p-2 font-semibold">Primary Address</div>
            <div className="p-2 font-semibold">Secondary Address</div>
            <div className="p-2 font-semibold">Primary Phone</div>
            <div className="p-2 font-semibold">Secondary Phone</div>
            <div className="p-2 font-semibold">Actions</div>
          </div>

          {/* Table Body */}
          {currentContacts.map((contact: ContactFormValues, index) => (
            <ContactRow
              contact={contact}
              index={indexOfFirstContact + index}
              key={contact.id}
            />
          ))}

          {/* Pagination */}
          <div className="mt-4 flex justify-between p-2">
            <Button
              className={`px-4 py-2 rounded ${
                currentTablePage === 1
                  ? 'bg-gray-300'
                  : 'bg-blue-500 text-white'
              }`}
              disabled={currentTablePage === 1}
              onClick={() => setCurrentTablePage(currentTablePage - 1)}
            >
              Previous
            </Button>

            {/* Show "Page x of y" */}
            <span className="self-center">
              Page {currentTablePage} of{' '}
              {Math.ceil(searchResults.length / contactsPerPage)}
            </span>

            <Button
              className={`px-4 py-2 rounded ${
                currentTablePage ===
                Math.ceil(contacts.length / contactsPerPage)
                  ? 'bg-gray-300'
                  : 'bg-blue-500 text-white'
              }`}
              disabled={
                currentTablePage ===
                Math.ceil(searchResults.length / contactsPerPage)
              }
              onClick={() => setCurrentTablePage(currentTablePage + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactsPage
