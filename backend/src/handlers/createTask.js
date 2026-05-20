const { PutCommand } = require("@aws-sdk/lib-dynamodb");
const { randomUUID } = require("node:crypto");
const { config } = require("../config");
const { documentClient } = require("../lib/dynamodb");
const { getCurrentUserId } = require("../lib/auth");
const { handleError, jsonResponse, parseJsonBody } = require("../lib/http");
const { validateTaskInput } = require("../lib/validation");

async function handler(event = {}) {
  try {
    const input = validateTaskInput(parseJsonBody(event));
    const task = {
      taskId: randomUUID(),
      userId: getCurrentUserId(event),
      ...input,
      createdAt: new Date().toISOString()
    };

    await documentClient.send(
      new PutCommand({
        TableName: config.tableName,
        Item: task,
        ConditionExpression: "attribute_not_exists(taskId)"
      })
    );

    return jsonResponse(201, { task });
  } catch (error) {
    return handleError(error);
  }
}

module.exports = { handler };
