import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI
const options = {}

let client
let db

if (!uri) {
  throw new Error('Missing MONGODB_URI environment variable')
}

const DB_NAME = 'travel-pilot'

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClient) {
    global._mongoClient = new MongoClient(uri, options)
    global._mongoClient.connect()
  }
  client = global._mongoClient
} else {
  client = new MongoClient(uri, options)
  client.connect()
}

db = client.db(DB_NAME)

export { client, db }
