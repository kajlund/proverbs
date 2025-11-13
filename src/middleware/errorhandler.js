import { codes, phrases } from '../status.js';

export function getErrorHandler(log) {
  // eslint-disable-next-line no-unused-vars
  return (err, req, res, next) => {
    const user = req.session.user;
    let error = {
      success: false,
      statusCode: codes.INTERNAL_SERVER_ERROR,
      message: phrases.INTERNAL_SERVER_ERROR,
    };

    if (err.isAppError) {
      error.message = err.message;
      error.statusCode = err.statusCode;
      error.detail = err.detail;
      error.errors = err.errors;
    } else {
      log.error(err);
    }

    return res.render('error', { title: 'Error', page: 'error', user, error });
  };
}
