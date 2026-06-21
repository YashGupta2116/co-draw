import "dotenv/config";

// console.log(process.env.DATABASE_URL);
import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { authMiddleware } from "./middleware.js";
import {
  CreateUserSchema,
  SigninSchema,
  CreateRoomSchema,
} from "@repo/common/types";
import { prisma } from "@repo/db";
import bcrypt from "bcrypt";

const app = express();

app.use(express.json());
app.listen(8000);
app.get("/", (req, res) => {
  res.send("Hello");
});

app.post("/signup", async (req, res) => {
  console.log(JSON.stringify(req.body));
  const { data, success } = CreateUserSchema.safeParse(req.body);

  console.log(success);
  if (!success) {
    return res.json({
      message: "Incorrect inputs",
    });
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      username: data.username,
    },
  });

  if (existingUser) {
    return res.json({
      message: "User already exists",
    });
  }

  const hashedPass = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      username: data.username,
      password: hashedPass,
    },
  });

  res.json({
    userId: user.id,
  });
});

app.post("/signin", async (req, res) => {
  const { data, success } = SigninSchema.safeParse(req.body);

  console.log(JSON.stringify(req.body));
  console.log(success);

  if (!success) {
    return res.json({
      message: "Incorrect inputs",
    });
  }

  const user = await prisma.user.findFirst({
    where: {
      username: data.username,
    },
  });

  if (!user) return res.json({ message: "Invalid Credentials" });

  const checkPassword = await bcrypt.compare(data.password, user.password);

  if (!checkPassword) {
    return res.json({
      message: "Invalid Credentials",
    });
  }

  const token = jwt.sign(
    {
      userId: user.id,
      username: user.name,
    },
    JWT_SECRET,
  );

  res.json({ token });
});

app.post("/room", authMiddleware, async (req, res) => {
  const { data, success } = CreateRoomSchema.safeParse(req.body);
  if (!success) {
    return res.json({
      message: "Incorrect inputs",
    });
  }
  //@ts-ignore
  const userId = req.userId;

  try {
    const createdRoom = await prisma.room.create({
      data: {
        adminId: userId,
        slug: data.roomName,
      },
    });

    res.json({
      roomId: createdRoom.id,
    });
  } catch (error) {
    return res.status(411).json({
      message: "Room with this name already exists",
    });
  }
});
