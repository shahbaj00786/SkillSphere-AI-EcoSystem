import { verifyAccessToken } from "../utils/jwt.utils.js";

const auth = async (req, res, next) => {
  const { token } = req.headers;

  if (!token) {
    return res.json({ success: false, message: "Not Authorized, Login Again" });
  }

  try {
    const token_decode = verifyAccessToken(token);
    req.userId = token_decode.id;
    req.role = token_decode.role;
    next();
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export default auth;
