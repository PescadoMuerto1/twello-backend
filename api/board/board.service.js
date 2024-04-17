import { dbService } from '../../services/db.service.js'
import { logger } from '../../services/logger.service.js'
import mongodb from 'mongodb'
const { ObjectId } = mongodb

async function getMiniBoards() {
    try {
        const collection = await dbService.getCollection('board')
        var boards = await collection.find().toArray()

        return boards.map(board => ({ _id: board._id, title: board.title, style: { backgroundImage: board.style?.backgroundImage }, isStarred: board.isStarred }))
    } catch (err) {
        logger.error('cannot find boards', err)
        throw err
    }
}

async function getById(boardId) {
    try {
        const collection = await dbService.getCollection('board')
        const board = await collection.findOne({ _id: ObjectId(boardId) })
        board.createdAt = ObjectId(board._id).getTimestamp()

        return board
    } catch (err) {
        logger.error(`while finding board ${boardId}`, err)
        throw err
    }
}

async function remove(boardId) {
    try {
        const collection = await dbService.getCollection('board')
        await collection.deleteOne({ _id: ObjectId(boardId) })
        return boardId
    } catch (err) {
        logger.error(`cannot remove board ${boardId}`, err)
        throw err
    }
}

async function add(board) {
    try {
        const collection = await dbService.getCollection('board')
        await collection.insertOne(board)
        return board
    } catch (err) {
        logger.error('cannot insert board', err)
        throw err
    }
}

async function update(board) {
    try {
        const boardToSave = {
            title: board.title,
            style: board.style,
            isStarred: board.isStarred,
            archivedAt: board.archivedAt,
            createdById: board.createdById,
            labels: board.labels,
            members: board.members,
            groups: board.groups,
            activities: board.activities,
        }
    
        const collection = await dbService.getCollection('board')
        await collection.updateOne({ _id: new ObjectId(board._id) }, { $set: boardToSave })
        return board
    } catch (err) {
        ``
        logger.error(`cannot update board ${board.id}`, err)
        throw err
    }
}

export const boardService = {
    remove,
    getMiniBoards,
    getById,
    add,
    update
}
