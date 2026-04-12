import { MongoClient } from 'mongodb'

const url = 'mongodb://127.0.0.1:27017'
const client = new MongoClient(url)

async function initReplicaSet() {
  try {
    await client.connect()
    console.log('Connected to MongoDB')

    const adminDb = client.db('admin')
    
    // Initialize replica set
    const result = await adminDb.command({ replSetInit: 'rs0' })
    console.log('Replica set initialized:', result)
    
  } catch (error: any) {
    if (error.code === 130) {
      console.log('Replica set already initialized or error:', error.message)
    } else {
      console.error('Error:', error)
    }
  } finally {
    await client.close()
  }
}

initReplicaSet()