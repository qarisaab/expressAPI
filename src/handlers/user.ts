import prisma from "../db";
import { comparePasswords, createJWT, hashPassword } from "../modules/auth";

export const createNewUser = async (req, res, next) => {
  try {
    const user = await prisma.user.create({
      data: {
        username: req.body.username,
        password: await hashPassword(req.body.password),
      },
    });

    const token = createJWT(user);
    res.json({ token });
  } catch (err) {
    err.type = "input";
    next(err);
  }
};

export const signin = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: {
      username: req.body.username,
    },
  });

  const isValid = comparePasswords(req.body.password, user.password);
  if (!isValid) {
    res.status(401);
    res.json({ message: "password is not correct" });
    return;
  }

  const token = createJWT(user);
  res.json({ token });
};
