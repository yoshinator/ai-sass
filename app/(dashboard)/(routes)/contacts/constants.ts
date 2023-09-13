import { Contact } from '@prisma/client'

export interface ContactFormValues
  extends Omit<Contact, 'userId' | 'createdAt' | 'updatedAt'> {}

export interface ContactFormField {
  name: string
  label: string
}

export const formFields = [
  { name: 'id', label: 'ID' },
  { name: 'name', label: 'Name' },
  { name: 'email', label: 'Email' },
  { name: 'source', label: 'Source' },
  { name: 'primaryAddress', label: 'Primary Address' },
  { name: 'secondaryAddress', label: 'Secondary Address' },
  { name: 'primaryPhone', label: 'Primary Phone' },
  { name: 'secondaryPhone', label: 'Secondary Phone' },
]
