const { DeleteCommand, GetCommand } = require("@aws-sdk/lib-dynamodb");
const { config } = require("../config");
const { documentClient } = require("../lib/dynamodb");
const { getCurrentUserId } = require("../lib/auth");
const { handleError, jsonResponse } = require("../lib/http");
const { fail } = require("../lib/validation");

async function handler(event = {}) {
  try {
    const taskId = event.pathParameters?.id;
    if (!taskId) {
      fail(400, "task id is required.");
    }

    const existing = await documentClient.send(
      new GetCommand({
        TableName: config.tableName,
        Key: { taskId }
      })
    );

    const userId = getCurrentUserId(event);
    if (!existing.Item || existing.Item.userId !== userId) {
      fail(404, "task not found.");
    }

    await documentClient.send(
      new DeleteCommand({
        TableName: config.tableName,
        Key: { taskId }
      })
    );

    return jsonResponse(200, { deleted: true, taskId });
  } catch (error) {
    return handleError(error);
  }
}

module.exports = { handler };
