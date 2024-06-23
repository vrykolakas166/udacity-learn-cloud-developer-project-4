import * as uuid from 'uuid'

import { TodoAccess } from '../dataLayer/todosAccess.mjs'
import { TodoStorage } from '../dataLayer/todosStorage.mjs'

const todoAccess = new TodoAccess()
const todoStorage = new TodoStorage

export async function getAllTodos(userId) {
    return todoAccess.getAllTodos(userId)
}

export async function createTodo(createTodoRequest, userId) {
    const todoId = uuid.v4()

    return await todoAccess.createTodo({
        todoId,
        userId,
        name: createTodoRequest.name,
        createdAt: new Date(Date.now()).toISOString(),
        dueDate: createTodoRequest.dueDate,
        done: false,
        attachmentUrl: null,
    })
}

export async function updateTodo(todoId, updateTodoRequest, userId) {
    const item = await todoAccess.getTodo(todoId, userId)
    if (!item) return;
    return await todoAccess.updateTodo(todoId, userId, updateTodoRequest)
}

export async function updateTodoWithAttachmentUrl(todoId, attachmentId, userId) {
    const item = await todoAccess.getTodo(todoId, userId)
    if (!item) return;
    await todoAccess.updateTodoAttachmentUrl(todoId, userId, attachmentId)
}

export async function deleteTodo(todoId, userId) {
    const item = await todoAccess.getTodo(todoId, userId)
    if (!item) return;
    return await todoAccess.deleteTodo(todoId, userId)
}

export async function generateUploadUrl(attachmentId) {
    return await todoStorage.getUploadUrl(attachmentId);
}
