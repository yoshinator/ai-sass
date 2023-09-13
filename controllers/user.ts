import { auth } from '@clerk/nextjs'

import prismadb from '../lib/prismadb'

export const userInit = async () => {
  const { userId } = auth()

  if (!userId) {
    return
  }

  try {
    const user = await prismadb.user.findUnique({
      where: {
        userId,
      },
    })
    if (!user) {
      await prismadb.user.create({
        data: {
          userId,
        },
      })
    }
    return user
  } catch (error) {
    console.log('[USER_INIT_ERROR]', error as string)
    throw new Error(error as string)
  }
}
