module.exports = function authorize(roles = []) {
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return [
    (req, res, next) => {
      try {

        if (roles.length && !roles.includes(req.user.role)) {
          return res.status(403).json({ message: `Forbidden: Requires one of the following roles: ${roles.join(', ')}` });
        }

        next();
      } catch (error) {
        console.error('Authorization error:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  ];
};
