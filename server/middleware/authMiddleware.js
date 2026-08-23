import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    /* No Authorization header */

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    /* Expected format:
       Authorization: Bearer TOKEN
    */

    const parts = authHeader.split(" ");

    if (
      parts.length !== 2 ||
      parts[0] !== "Bearer"
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication format.",
      });
    }

    const token = parts[1];

    /* JWT secret check */

    if (!process.env.JWT_SECRET) {
      console.error(
        "JWT_SECRET is not configured."
      );

      return res.status(500).json({
        success: false,
        message:
          "Authentication configuration is missing.",
      });
    }

    /* Verify token */

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    /* Store authenticated worker information */

    req.worker = decoded;

    next();

  } catch (error) {
    console.error(
      "Authentication error:",
      error.message
    );

    return res.status(401).json({
      success: false,
      message:
        "Invalid or expired authentication token.",
    });
  }
};

export default authMiddleware;