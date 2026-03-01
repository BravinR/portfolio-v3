import express from "express";
import { createServer as createViteServer } from "vite";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // API routes
  app.get("/api/posts", (req, res) => {
    const postsDir = path.join(process.cwd(), "posts");
    if (!fs.existsSync(postsDir)) {
      return res.json([]);
    }
    const files = fs.readdirSync(postsDir);
    const posts = files
      .filter((file) => file.endsWith(".md"))
      .map((file) => {
        const slug = file.replace(".md", "");
        const content = fs.readFileSync(path.join(postsDir, file), "utf-8");
        const { data } = matter(content);
        return {
          slug,
          title: data.title || slug,
          date: data.date || "",
          description: data.description || "",
        };
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    res.json(posts);
  });

  app.get("/api/posts/:slug", (req, res) => {
    const { slug } = req.params;
    const postPath = path.join(process.cwd(), "posts", `${slug}.md`);
    if (!fs.existsSync(postPath)) {
      return res.status(404).json({ error: "Post not found" });
    }
    const content = fs.readFileSync(postPath, "utf-8");
    const { data, content: markdown } = matter(content);
    res.json({
      title: data.title || slug,
      date: data.date || "",
      markdown,
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(process.cwd(), "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(process.cwd(), "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
