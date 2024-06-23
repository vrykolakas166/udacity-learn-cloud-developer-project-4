import * as uuid from 'uuid'
import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { generateUploadUrl, updateTodoWithAttachmentUrl } from '../../businessLogic/todo.mjs'
import { createLogger } from '../../utils/logger.mjs'
import { getUserId } from '../utils.mjs'

const logger = createLogger('generateUploadUrl')

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      origin: "*",
      credentials: true
    })
  )
  .handler(async (event) => {
    logger.info('Processing generateUploadUrl event', event)

    const attachmentId = uuid.v4()
    const userId = getUserId(event)
    const todoId = event.pathParameters.todoId

    const signedUrl = await generateUploadUrl(attachmentId);

    await updateTodoWithAttachmentUrl(todoId, attachmentId, userId)

    return {
      statusCode: 200,
      body: JSON.stringify({
        uploadUrl: signedUrl
      })
    };
  })

