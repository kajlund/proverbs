import addFormats from "ajv-formats";
import { Validator } from "express-json-validator-middleware";

/**
 * Create a new instance of the `express-json-validator-middleware`
 * `Validator` class and pass in Ajv options if needed.
 *
 * @see https://github.com/ajv-validator/ajv/blob/master/docs/api.md#options
 */

const validator = new Validator({
  allErrors: true,
  strict: false,
  validateFormats: true,
});
addFormats(validator.ajv);

export default validator.validate;
