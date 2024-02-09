"use strict";
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.ttv2qxt.mongodb.net/${process.env.MONGODB_DATABASE}?retryWrites=true&w=majority`;

let expressDB;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function mongoConnect() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // assigning value to expressDB
    expressDB = client.db();
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

const getDB = () => {
  if (expressDB) return expressDB;
  throw new Error("DB connection is not establised");
};

module.exports = { mongoConnect, getDB };
