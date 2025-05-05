import { Codes, Phrases } from "./status.js";

/**
 * ErrorBuilder class to build error responses
 */
export class AppError extends Error {
  constructor(message = Phrases.INTERNAL_SERVER_ERROR, code = Codes.INTERNAL_SERVER_ERROR, detail = "", errors = null) {
    super(message);
    this.name = this.constructor.name;
    this.isAppError = true;
    this.response = {
      success: false,
      status: code,
      message: message,
      detail,
      errors,
    };
    Error.captureStackTrace(this, this.constructor);
  }
}

export class UnauthorizedError extends AppError {
  constructor(detail = "") {
    super(Phrases.UNAUTHORIZED, Codes.UNAUTHORIZED, detail);
  }
}
export class BadRequestError extends AppError {
  constructor(detail = "", errors = null) {
    super(Phrases.BAD_REQUEST, Codes.BAD_REQUEST, detail, errors);
  }
}
export class NotFoundError extends AppError {
  constructor(detail = "") {
    super(Phrases.NOT_FOUND, Codes.NOT_FOUND, detail);
  }
}

export class InternalServerError extends AppError {
  constructor(detail = "") {
    super(Phrases.INTERNAL_SERVER_ERROR, Codes.INTERNAL_SERVER_ERROR, detail);
  }
}
