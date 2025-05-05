import { ValidationError } from "express-json-validator-middleware";

import { Codes, Phrases } from "../status.js";
import { getLogger } from "../logger.js";
import { BadRequestError } from "../errors.js";

const log = getLogger();

// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  // Default error response
  let error = {
    success: false,
    status: Codes.INTERNAL_SERVER_ERROR,
    message: Phrases.INTERNAL_SERVER_ERROR,
    detail: "",
    errors: null,
  };

  // Check if the error is a validation error
  if (err instanceof ValidationError) {
    err = new BadRequestError("", err.validationErrors);
  }

  if (err.isAppError) {
    error = err.response;
  } else {
    // Log unhandled
    log.error(err);
  }

  return res.status(error.status).json(error);
};
