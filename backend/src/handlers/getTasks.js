const { QueryCommand } = require("@aws-sdk/lib-dynamodb");
const { config } = require("../config");
const { documentClient } = require("../lib/dynamodb");
const { getCurrentUserId } = require("../lib/auth");
const { handleError, jsonResponse } = require("../lib/http");

async function handler(event = {}) {
  try {
    const userId = getCurrentUserId(event);
    const result = await documentClient.send(
      new QueryCommand({
        TableName: config.tableName,
        IndexName: "userId-index",
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: {
          ":userId": userId
        }
      })
    );

    const tasks = (result.Items || []).sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
    return jsonResponse(200, { tasks });
  } catch (error) {
    return handleError(error);
  }
}

module.exports = { handler };
