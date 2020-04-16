const keys = require('../private/keys')
const MongoClient = require('mongodb').MongoClient;
const moment = require("moment-timezone")
const testUID = require("../cypress.env.json")["TEST_UID"]
//const {v4: uuid} = require("uuid")
const client = new MongoClient(keys.mongoURI, {useNewUrlParser: true,  useUnifiedTopology: true });
client.connect(async err => {
  const db = client.db("GraphiteWriter")

  await db.collection("documents").deleteMany({owner: testUID})
  await db.collection("sharedDocOpens").deleteMany({_id: testUID})
  await db.collection("documents").insertOne({_id: "testingDoc", owner: testUID, title: "testingDoc", data: "", date:  moment().unix(), opened:  moment().unix()})

  client.close()
})