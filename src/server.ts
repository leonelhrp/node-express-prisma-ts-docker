import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { PrismaClient } from '@prisma/client';

const app = express();
const port = 4000;
const prisma = new PrismaClient();

app.use(bodyParser.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, World!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

app.post("/users/create", async (req: Request, res: Response) => {
  try {
    const { name, email } = req.body;
    const user = await prisma.user.create({
      data: {
        name,
        email,
      },
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to create user" });
  }
});

app.post("/posts/create", async (req: Request, res: Response) => {
  try {
    const { title, content, userId } = req.body;
    const post = await prisma.post.create({
      data: {
        title,
        content,
        userId,
      },
    });
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: "Failed to create post" });
  }
});

app.post("/users/create-with-posts", async (req: Request, res: Response) => {
  try {
    const { name, email, posts } = req.body;
    const user = await prisma.user.create({
      data: {
        name,
        email,
        posts: {
          create: posts,
        },
      },
      include: {
        posts: true,
      },
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to create user with posts" });
  }
});

app.get("/users", (req: Request, res: Response) => {
  prisma.user
    .findMany()
    .then((users) => {
      res.json(users);
    })
    .catch((error) => {
      res.status(500).json({ error: "Failed to fetch users" });
    });
});

app.get("/posts", (req: Request, res: Response) => {
  prisma.post
    .findMany({
      include: {
        user: true,
      },
    })
    .then((posts) => {
      res.json(posts);
    })
    .catch((error) => {
      res.status(500).json({ error: "Failed to fetch posts" });
    });
});

app.get("/users-with-posts", (req: Request, res: Response) => {
  prisma.user
    .findMany({
      include: {
        posts: true,
      },
    })
    .then((users) => {
      res.json(users);
    })
    .catch((error) => {
      res.status(500).json({ error: "Failed to fetch users with posts" });
    });
});