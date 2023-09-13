import { FC } from 'react'

import { Controller, FieldValues, useForm } from 'react-hook-form'

import { Input } from '@/app/components/ui/input'

import { ContactFormField, ContactFormValues, formFields } from './constants'

interface RowProps {
  index: number
  contact: ContactFormValues
}

export const ContactRow: FC<RowProps> = ({ index, contact }) => {
  const { control, handleSubmit } = useForm()

  const onSubmit = (data: FieldValues) => {
    console.log(data)
  }

  return (
    <form
      className="grid grid-cols-9 gap-2 border-b border-gray-200"
      onSubmit={handleSubmit(onSubmit)}
    >
      {formFields.map((formField: ContactFormField) => (
        <Controller
          control={control}
          defaultValue={contact[formField.name as keyof ContactFormValues]}
          key={formField.name}
          name={`contacts[${index}].${formField.name}`}
          render={({ field }) =>
            formField.name === 'id' ? (
              <Input type="hidden" {...field} />
            ) : (
              <div className="p-2" key={contact.email}>
                <Input
                  {...field}
                  aria-label={formField.label}
                  className="w-full border rounded p-1"
                />
              </div>
            )
          }
        />
      ))}

      <div className="p-2">
        <button className="bg-blue-500 text-white p-2 rounded" type="submit">
          Update
        </button>
      </div>
    </form>
  )
}
