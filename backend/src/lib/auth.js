const { config } = require("../config");

function getHeader(headers, name) {
  if (!headers) {
    return undefined;
  }

  const foundKey = Object.keys(headers).find((key) => key.toLowerCase() === name.toLowerCase());
  return foundKey ? headers[foundKey] : undefined;
}

function getCurrentUserId(event) {
  return (
    event?.queryStringParameters?.userId ||
    getHeader(event?.headers, "x-user-id") ||
    event?.requestContext?.authorizer?.claims?.sub ||
    config.localUserId
  );
}

module.exports = { getCurrentUserId };
