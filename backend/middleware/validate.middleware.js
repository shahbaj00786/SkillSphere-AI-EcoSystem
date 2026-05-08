const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const messages = error.details.map((err) => err.message).join(", ");
      return res.json({
        success: false,
        message: messages,
      });
    }

    next();
  };
};

export default validate;
