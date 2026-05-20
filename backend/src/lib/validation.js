const PRIORITIES = new Set(["low", "medium", "high"]);
const STATUSES = new Set(["pending", "done"]);

function fail(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  throw error;
}

function validateTaskInput(input, { partial = false } = {}) {
  const data = {};

  if (!partial || input.title !== undefined) {
    if (typeof input.title !== "string" || !input.title.trim()) {
      fail(400, "title is required.");
    }
    data.title = input.title.trim();
  }

  if (input.description !== undefined) {
    data.description = String(input.description);
  } else if (!partial) {
    data.description = "";
  }

  if (!partial || input.priority !== undefined) {
    if (!PRIORITIES.has(input.priority)) {
      fail(400, "priority must be one of: low, medium, high.");
    }
    data.priority = input.priority;
  }

  if (!partial || input.status !== undefined) {
    if (!STATUSES.has(input.status)) {
      fail(400, "status must be one of: pending, done.");
    }
    data.status = input.status;
  }

  if (!partial || input.dueDate !== undefined) {
    if (typeof input.dueDate !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(input.dueDate)) {
      fail(400, "dueDate is required in YYYY-MM-DD format.");
    }
    data.dueDate = input.dueDate;
  }

  return data;
}

module.exports = { validateTaskInput, fail };
