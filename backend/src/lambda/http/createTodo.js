import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { getUserId } from '../utils.mjs'
import { createTodo } from '../../businessLogic/todo.mjs'

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

    const newTodo = JSON.parse(event.body)
    const userId = getUserId(event)
    const item = await createTodo(newTodo, userId)

    return {
      statusCode: 201,
      body: JSON.stringify({
        item
      })
    }
  })

