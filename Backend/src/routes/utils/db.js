const AWS = require("aws-sdk");
const { v4: uuid } = require("uuid");

const dynamo = new AWS.DynamoDB.DocumentClient({ region: process.env.AWS_REGION });
const TableName = process.env.DYNAMO_DB_TABLE;

// Users
async function getUser(email) {
  const res = await dynamo.get({ TableName, Key: { pk: `USER#${email}`, sk: "PROFILE" } }).promise();
  return res.Item || null;
}

async function putUser(user) {
  await dynamo.put({
    TableName,
    Item: { pk: `USER#${user.email}`, sk: "PROFILE", ...user }
  }).promise();
}

// Expenses
async function addExpense(email, expense) {
  await dynamo.put({
    TableName,
    Item: {
      pk: `USER#${email}`,
      sk: `EXPENSE#${uuid()}`,
      ...expense,
      createdAt: Date.now()
    }
  }).promise();
}

async function getExpenses(email) {
  const res = await dynamo.query({
    TableName,
    KeyConditionExpression: "pk = :pk AND begins_with(sk, :sk)",
    ExpressionAttributeValues: { ":pk": `USER#${email}`, ":sk": "EXPENSE#" }
  }).promise();
  return res.Items || [];
}

module.exports = { getUser, putUser, addExpense, getExpenses };
