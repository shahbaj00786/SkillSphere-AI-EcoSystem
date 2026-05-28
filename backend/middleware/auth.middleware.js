import { verifyAccessToken } from "../utils/jwt.utils.js";

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Not Authorized, Login Again" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const token_decode = verifyAccessToken(token);
    req.user = { id: token_decode.id, role: token_decode.role };
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ success: false, message: error.message });
  }
};

export default auth;
