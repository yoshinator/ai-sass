// controller for long running task model

import { GmailImportTask, TaskStatus } from '@prisma/client'

import prismadb from '@/lib/prismadb'

export const createGmailImportTask = async (
  userId: string,
  nextPageToken?: string | null,
  lastProcessedDate?: string | Date | null
) => {
  try {
    return await prismadb.gmailImportTask.create({
      data: {
        userId,
        status: TaskStatus.PENDING,
        nextPageToken,
        lastProcessedDate,
      },
    })
  } catch (error) {
    console.error('[GMAIL_IMPORT_TASK_ERROR]', error)
    throw error
  }
}

export const updateGmailImportTask = async (updatedData: GmailImportTask) => {
  try {
    return await prismadb.gmailImportTask.update({
      where: { id: updatedData.id },
      data: updatedData,
    })
  } catch (error) {
    console.error('[UPDATE_LONG_RUNNING_TASK_ERROR]', error)
    throw error
  }
}

export const getGmailImportTaskByUserId = async (userId: string) => {
  try {
    return await prismadb.gmailImportTask.findUnique({
      where: {
        userId,
      },
    })
  } catch (error) {
    console.error('[GET_LONG_RUNNING_TASKS_BY_USER_ID_ERROR]', error)
    throw error
  }
}

export const deleteGmailImportTask = async (id: string) => {
  try {
    return await prismadb.gmailImportTask.delete({
      where: { id },
    })
  } catch (error) {
    console.error('[DELETE_LONG_RUNNING_TASK_ERROR]', error)
    throw error
  }
}
