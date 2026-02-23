import jwt from 'jsonwebtoken';

export function getAuthController(cnf, log) {
  return {
    checkAuthUser: (req, res) => {
      const token = req.cookies?.token;
      if (!token) return res.status(401).json({ message: 'Unauthorized' });

      try {
        const decoded = jwt.verify(token, cnf.accessTokenSecret);
        return res.status(200).json(decoded);
      } catch (err) {
        log.error(err);
        return res.status(401).json({ message: 'Unauthorized' });
      }
    },
  };
}
