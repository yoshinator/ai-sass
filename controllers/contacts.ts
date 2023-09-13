import { Contact } from '@prisma/client'

import prismadb from '@/lib/prismadb' // Assuming prismadb is your Prisma Client instance

export const getContacts = async (userId: string) => {
  try {
    return await prismadb.contact.findMany({
      where: {
        userId: userId,
      },
    })
  } catch (error) {
    console.error('[GET_CONTACTS_ERROR]', error)
    throw error
  }
}

export const getContactById = async (id: string) => {
  try {
    return await prismadb.contact.findUnique({
      where: { id },
    })
  } catch (error) {
    console.error('[GET_CONTACT_BY_ID_ERROR]', error)
    throw error
  }
}

export const createContact = async (contactData: Contact) => {
  try {
    return await prismadb.contact.create({
      data: contactData,
    })
  } catch (error) {
    console.error('[CREATE_CONTACT_ERROR]', error)
    throw error
  }
}

export const updateContact = async (id: string, updatedData: Contact) => {
  try {
    return await prismadb.contact.update({
      where: { id },
      data: updatedData,
    })
  } catch (error) {
    console.error('[UPDATE_CONTACT_ERROR]', error)
    throw error
  }
}

export const deleteContact = async (id: string) => {
  try {
    return await prismadb.contact.delete({
      where: { id },
    })
  } catch (error) {
    console.error('[DELETE_CONTACT_ERROR]', error)
    throw error
  }
}

export const createContactsBatch = async (
  userId: string,
  contactsArray: [string, string][],
  source: string = 'unknown'
) => {
  // Create multiple contacts for a user
  const contacts = contactsArray.map((contact) => {
    const email = contact[0]
    const name = contact[1]
    return {
      userId,
      email,
      name,
      source,
    }
  })

  try {
    return await prismadb.contact.createMany({
      data: contacts,
    })
  } catch (error) {
    console.error('[CREATE_CONTACTS_BATCH_ERROR]', error)
  }
}
