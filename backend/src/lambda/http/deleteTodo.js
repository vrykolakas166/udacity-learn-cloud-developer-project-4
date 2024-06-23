import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { getUserId } from '../utils.mjs'
import { deleteTodo } from '../../businessLogic/todo.mjs'

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      origin: "*",
      credentials: true
    })
  )
  .handler(async (event) => {
    console.log('Processing event: ', event)

    const todoId = event.pathParameters.todoId
    const userId = getUserId(event)

    const deletedId = await deleteTodo(todoId, userId)

    return {
      statusCode: 204,
      body: JSON.stringify({
        deletedId
      })
    }
  })

