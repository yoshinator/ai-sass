'use client'

import { useState } from 'react'

import { useForm } from 'react-hook-form'
import ReactMarkdown from 'react-markdown'

import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { Code } from 'lucide-react'
import { useRouter } from 'next/navigation'
import OpenAI from 'openai'
import * as z from 'zod'

import { BotAvatar } from '@/app/components/bot-avatar'
import { Empty } from '@/app/components/Empty'
import { Heading } from '@/app/components/heading'
import { Loader } from '@/app/components/Loader'
import { Button } from '@/app/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from '@/app/components/ui/form'
import { Input } from '@/app/components/ui/input'
import { UserAvatar } from '@/app/components/user-avatar'
import { useProModal } from '@/app/hooks/use-pro-modal'
import { cn } from '@/lib/utils'

import { formSchema } from './constants'

const CodePage = () => {
  const proModal = useProModal()
  const router = useRouter()
  const [messages, setMessages] = useState<
    OpenAI.Chat.Completions.CreateChatCompletionRequestMessage[]
  >([])
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
    },
  })

  const isLoading = form.formState.isSubmitting
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const userMessage: OpenAI.Chat.Completions.CreateChatCompletionRequestMessage =
        {
          role: 'user',
          content: values.prompt,
        }
      const newMessages = [...messages, userMessage]
      const response = await axios.post('/api/code', {
        messages: newMessages,
      })
      setMessages((current) => [...current, userMessage, response.data])
      form.reset()
    } catch (err: any) {
      if (err?.response?.status === 402) {
        proModal.onOpen()
      }
      console.log(err)
    } finally {
      router.refresh()
    }
  }

  return (
    <div>
      <Heading
        bgColor="bg-green-700/10"
        description="Generate code using descriptive text"
        icon={Code}
        iconColor="text-green-700"
        title="Code Generation"
      />
      <div className="px-4 lg:px-8">
        <div>
          <Form {...form}>
            <form
              className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                name="prompt"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-10">
                    <FormControl className="m-0 p-0">
                      <Input
                        className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                        disabled={isLoading}
                        placeholder="Simple toggle button using React hooks and Tailwind css"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                className="col-span-12 lg:col-span-2 w-full"
                disabled={isLoading}
              >
                Generate
              </Button>
            </form>
          </Form>
        </div>
        <div className="space-y-4 mt-4 ">
          {isLoading && (
            <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
              <Loader />
            </div>
          )}
          {messages.length === 0 && !isLoading && (
            <Empty label="No conversation started" />
          )}
          <div className="flex flex-col gap-y-4">
            {messages.map((message) => (
              <div
                className={cn(
                  'p-8 w-full flex items-start gap-x-8 rounded-lg',
                  message.role === 'user'
                    ? 'flex-row-reverse bg-white border border-black-10'
                    : 'flex-row bg-muted'
                )}
                key={message.content}
              >
                {message.role === 'user' ? <UserAvatar /> : <BotAvatar />}
                <ReactMarkdown
                  className="text-sm overflow-hidden leading-7"
                  components={{
                    pre: (props) => (
                      <div className="overflow-auto w-full my-2 bg-black/10 p-2 rounded-lg">
                        <pre {...props} />
                      </div>
                    ),
                    code: (props) => (
                      <code className="bg-black/10 rounded-lg p-1" {...props} />
                    ),
                  }}
                >
                  {message.content || ''}
                </ReactMarkdown>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CodePage
