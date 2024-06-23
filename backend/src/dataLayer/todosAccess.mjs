import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import AWSXRay from 'aws-xray-sdk-core'
import { createLogger } from '../utils/logger.mjs'

const logger = createLogger("todosAcess")

export class TodoAccess {
    constructor(
        documentClient = AWSXRay.captureAWSv3Client(new DynamoDB()),
        todosTable = process.env.TODOS_TABLE,
        todosCreatedAtIndex = process.env.TODOS_CREATED_AT_INDEX
    ) {
        this.documentClient = documentClient
        this.todosTable = todosTable
        this.todosCreatedAtIndex = todosCreatedAtIndex
        this.dynamoDbClient = DynamoDBDocument.from(this.documentClient)
    }

    async getAllTodos(userId) {
        console.log('Getting all todos')

        const result = await this.dynamoDbClient.query({
            TableName: this.todosTable,
            IndexName: this.todosCreatedAtIndex,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        })

        return result.Items
    }

    async getTodo(todoId, userId) {
        console.log(`Getting todo ${todoId}`)

        const result = await this.dynamoDbClient.get({
            TableName: this.todosTable,
            Key: {
                todoId,
                userId
            }
        })

        return result.Item
    }

    async createTodo(todo) {
        console.log(`create todo with id ${todo.id}`)

        await this.dynamoDbClient.put({
            TableName: this.todosTable,
            Item: todo
        })

        return todo
    }

    async updateTodo(todoId, userId, todo) {
        console.log(`update todo with id ${todoId}`)

        await this.dynamoDbClient.update({
            TableName: this.todosTable,
            Key: {
                todoId,
                userId
            },
            UpdateExpression: 'set #name = :name, dueDate = :dueDate, done = :done',
            ExpressionAttributeValues: {
                ':name': todo.name,
                ':dueDate': todo.dueDate,
                ':done': todo.done
            },
            ExpressionAttributeNames: {
                '#name': 'name',
            }
        })

        return todo;
    }

    async updateTodoAttachmentUrl(todoId, userId, attachmentId) {
        logger.info(`update todo attachment url with id ${todoId}`)

        const attachmentUrl = `https://${process.env.ATTACHMENTS_S3_BUCKET}.s3.amazonaws.com/${attachmentId}`

        await this.dynamoDbClient.update({
            TableName: this.todosTable,
            Key: {
                todoId,
                userId
            },
            UpdateExpression: 'set attachmentUrl = :attachmentUrl',
            ExpressionAttributeValues: {
                ':attachmentUrl': attachmentUrl
            }
        })
    }

    async deleteTodo(todoId, userId) {
        logger.info(`delete todo with id ${todoId}`)

        await this.dynamoDbClient.delete({
            TableName: this.todosTable,
            Key: {
                todoId,
                userId
            }
        })

        return todoId
    }
}
