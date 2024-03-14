import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const comparePasswords = (password, hash) => {
  return bcrypt.compare(password, hash);
};

export const hashPassword = (password) => {
  return bcrypt.hash(password, 5);
};

export const createJWT = (user) => {
  const token = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_secret
  );

  return token;
};

export const protect = (req, res, next) => {
  const bearer = req.headers.authorization;

  if (!bearer) {
    res.status(401);
    res.json({ message: `You don't have a token` });
    return;
  }

  const [_, token] = bearer.split(" ");
  if (!token) {
    res.status(401);
    res.json({ message: `You don't have a token` });
    return;
  }

  try {
    const user = jwt.verify(token, process.env.JWT_secret);
    req.user = user;
    next();
  } catch (error) {
    console.log(error.message);
    res.status(401);
    res.json({ message: "Your token is not valid" });
  }
};
