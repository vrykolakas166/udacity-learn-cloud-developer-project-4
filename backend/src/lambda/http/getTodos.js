import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { getUserId } from '../utils.mjs'
import { getAllTodos } from '../../businessLogic/todo.mjs'

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      origin: "*",
      credentials: true
    })
  )
  .handler(async (event) => {
    const userId = getUserId(event)

    const items = await getAllTodos(userId)

    return {
      statusCode: 200,
      body: JSON.stringify({
        items
      })
    }
  })
