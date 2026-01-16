'use client'

import dayjs from 'dayjs'
import { VideoDetail } from 'gying'
import { DBSchema, openDB } from 'idb'

import { BROWSING_HISTORY_DB } from '@/constants'

type BrowsingHistoryItem = VideoDetail & { updateTime: string }

interface HistoryDB extends DBSchema {
  [BROWSING_HISTORY_DB.STORE]: {
    key: string
    value: BrowsingHistoryItem
    indexes: { time: string }
  }
}

async function initDB() {
  return openDB<HistoryDB>(BROWSING_HISTORY_DB.NAME, 1, {
    upgrade(db) {
      const store = db.createObjectStore(BROWSING_HISTORY_DB.STORE, {
        keyPath: 'id'
      })
      store.createIndex('time', 'updateTime')
    }
  })
}

async function addHistory(video: VideoDetail) {
  const db = await initDB()
  const item = {
    ...video,
    updateTime: dayjs().toISOString()
  }
  await db.put(BROWSING_HISTORY_DB.STORE, item)
}

async function getHistory() {
  const db = await initDB()
  const history = await db.getAllFromIndex(BROWSING_HISTORY_DB.STORE, 'time')
  return history.reverse()
}

async function getHistoryList(page = 1, pageSize = 20) {
  const db = await initDB()
  const transaction = db.transaction(BROWSING_HISTORY_DB.STORE, 'readonly')
  const store = transaction.objectStore(BROWSING_HISTORY_DB.STORE)
  const index = store.index('time')
  const total = await store.count()

  let cursor = await index.openCursor(null, 'prev')
  const skip = (page - 1) * pageSize
  if (skip > 0 && cursor) {
    await cursor.advance(skip)
  }

  const list: BrowsingHistoryItem[] = []
  while (cursor && list.length < pageSize) {
    list.push(cursor.value)
    cursor = await cursor.continue()
  }

  return { list, total }
}

async function clearHistory() {
  const db = await initDB()
  await db.clear(BROWSING_HISTORY_DB.STORE)
}

export { addHistory, type BrowsingHistoryItem, clearHistory, getHistory, getHistoryList }
