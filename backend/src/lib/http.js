function jsonResponse(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": process.env.CORS_ORIGIN || "*",
      "Access-Control-Allow-Headers": "Content-Type,Authorization,X-User-Id",
      "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS"
    },
    body: JSON.stringify(body)
  };
}

function parseJsonBody(event) {
  if (!event.body) {
    return {};
  }

  if (typeof event.body === "object") {
    return event.body;
  }

  try {
    return JSON.parse(event.body);
  } catch {
    const error = new Error("Request body must be valid JSON.");
    error.statusCode = 400;
    throw error;
  }
}

function handleError(error) {
  if (error.statusCode) {
    return jsonResponse(error.statusCode, { message: error.message });
  }

  console.error(error);
  return jsonResponse(500, { message: "Internal server error." });
}

module.exports = { jsonResponse, parseJsonBody, handleError };
