"use server";

import client from "@/lib/mongodb";

const dbName = "HCAMS";

async function getCollection(collectionName: string) {
  if (!client?.db) {
    await client.connect();
  }
  const db = client.db(dbName);
  return db.collection(collectionName);
}

export async function findDocuments(collection: string, query = {}, options = {}) {
  const col = await getCollection(collection);
  const result = await col.find(query, options).toArray();
  return result;
}

export async function aggregateDocuments(collection: string, pipeline = []) {
  const col = await getCollection(collection);
  const result = await col.aggregate(pipeline).toArray();
  return result;
}

export async function insertOne(collection: string, doc: object) {
  const col = await getCollection(collection);
  const result = await col.insertOne(doc);
  return result;
}

export async function insertMany(collection: string, docs: object[]) {
  const col = await getCollection(collection);
  const result = await col.insertMany(docs);
  return result;
}

export async function updateOne(collection: string, filter: object, update: object, options = {}) {
  const col = await getCollection(collection);
  const result = await col.updateOne(filter, update, options);
  return result;
}

export async function updateMany(collection: string, filter: object, update: object, options = {}) {
  const col = await getCollection(collection);
  const result = await col.updateMany(filter, update, options);
  return result;
}

export async function deleteOne(collection: string, filter: object) {
  const col = await getCollection(collection);
  const result = await col.deleteOne(filter);
  return result;
}

export async function deleteMany(collection: string, filter: object) {
  const col = await getCollection(collection);
  const result = await col.deleteMany(filter);
  return result;
}