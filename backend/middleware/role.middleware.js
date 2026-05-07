const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.role)) {
      return res.json({
        success: false,
        message: 'Access Denied: You do not have permission',
      });
    }
    next();
  };
};

export default requireRole;