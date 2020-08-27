const { MongoClient } = require("mongodb");

// Connection URI

const uri = "mongodb://127.0.0.1:27017";
const databaseName = 'task-manager'

// Create a new MongoClient
const client = new MongoClient(uri, {useUnifiedTopology: true});

async function run() {
  try {
    // Connect the client to the server
    await client.connect();
    const db = client.db(databaseName);
    const result = await db.collection('tasks').insertMany([
      { name: 'Wash car'},
      {name: 'Clean the room'}
    ]);
    console.log(result.ops);

  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);