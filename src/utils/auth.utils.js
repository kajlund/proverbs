import jwt from 'jsonwebtoken';

export function getAuthUtils(cnf, log) {
  return {
    verifyAccessToken: (token) => {
      try {
        const decoded = jwt.decode(token, cnf.accessTokenSecret);
        return decoded;
      } catch (err) {
        log.error(err);
        return null;
      }
    },
  };
}
