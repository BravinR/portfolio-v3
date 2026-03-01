import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Link, useParams } from "react-router-dom";
import Markdown from "react-markdown";
import { motion, AnimatePresence } from "motion/react";
import { BookMarked, ChevronRight, Github, createLucideIcon, Mail, Calendar, ArrowLeft, Copy, Check } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Post {
  slug: string;
  title: string;
  date: string;
  description: string;
}

interface PostDetail {
  title: string;
  date: string;
  markdown: string;
}

const XIcon = createLucideIcon("X", [
  [
    "path",
    {
      d: "M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z",
      stroke: "none",
      fill: "currentColor",
    },
  ],
]);

const BOOKMARKS = [
  { title: "Password Generator", url: "https://password-generator.bravin.dev", description: "Generate secure passwords." },
  { title: "VS Code Server", url: "https://codeserver.bravin.dev", description: "Run VS Code in a browser." },
  { title: "Random Key gen", url: "https://randomkeygen.com/", description: "Generate secure random keys." },
  { title: "Overreacted", url: "https://overreacted.io", description: "Dan Abramov's personal blog." },
  { title: "Lee Robinson", url: "https://leerob.io", description: "Developer relations at Vercel." },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="absolute right-3 top-3 p-2 rounded-lg bg-zinc-800/50 hover:bg-zinc-700/50 border border-zinc-700/50 text-zinc-400 hover:text-zinc-100 transition-all z-10"
      aria-label="Copy code"
    >
      <AnimatePresence mode="wait">
        {copied ? (
          <motion.div
            key="check"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
          >
            <Check className="w-4 h-4 text-emerald-500" />
          </motion.div>
        ) : (
          <motion.div
            key="copy"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
          >
            <Copy className="w-4 h-4" />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}

function Home() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetch("/api/posts")
      .then((res) => res.json())
      .then(setPosts);
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <header className="mb-20">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-bold tracking-tight mb-4"
        >
          Bravin Rutto
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-zinc-600 dark:text-zinc-400"
        >
          Software engineer, designer, and writer. Building things for the web.
        </motion.p>
        <div className="flex gap-4 mt-6">
          <a href="#" className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
            <Github className="w-5 h-5" />
          </a>
          <a href="#" className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
            <XIcon className="w-5 h-5" />
          </a>
          <a href="#" className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
            <Mail className="w-5 h-5" />
          </a>
        </div>
      </header>

      <section className="mb-20">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-400 mb-8">Writing</h2>
        <div className="space-y-12">
          {posts.map((post, i) => (
            <motion.article 
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
            >
              <Link to={`/${post.slug}`} className="group block">
                <div className="flex justify-between items-baseline mb-2">
                  <h3 className="text-xl font-medium group-hover:text-emerald-600 transition-colors">
                    {post.title}
                  </h3>
                  <time className="text-sm text-zinc-400 font-mono">{post.date}</time>
                </div>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {post.description}
                </p>
              </Link>
            </motion.article>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-400 mb-8">Bookmarks</h2>
        <div className="grid gap-4">
          {BOOKMARKS.map((bookmark, i) => (
            <motion.a
              key={bookmark.url}
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 hover:border-emerald-500/50 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10 transition-all group flex items-start gap-4"
            >
              <div className="p-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/30 transition-colors">
                <BookMarked className="w-5 h-5 text-zinc-400 group-hover:text-emerald-600" />
              </div>
              <div>
                <div className="flex items-center gap-1 font-medium">
                  {bookmark.title}
                  <ChevronRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </div>
                <p className="text-sm text-zinc-500">{bookmark.description}</p>
              </div>
            </motion.a>
          ))}
        </div>
      </section>
    </div>
  );
}

function Post() {
  const { slug } = useParams();
  const [post, setPost] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/posts/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        setPost(data);
        setLoading(false);
      });
  }, [slug]);

  if (loading) return <div className="max-w-3xl mx-auto px-6 py-20 animate-pulse">Loading...</div>;
  if (!post) return <div className="max-w-3xl mx-auto px-6 py-20">Post not found.</div>;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-3xl mx-auto px-6 py-20"
    >
      <Link to="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors mb-12 group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to home
      </Link>

      <header className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">{post.title}</h1>
        <div className="flex items-center gap-2 text-zinc-400 font-mono text-sm">
          <Calendar className="w-4 h-4" />
          {post.date}
        </div>
      </header>

      <div className="prose prose-zinc dark:prose-invert prose-emerald max-w-none">
        <Markdown
          components={{
            code({ node, inline, className, children, ...props }: any) {
              const match = /language-(\w+)/.exec(className || "");
              const codeString = String(children).replace(/\n$/, "");
              
              return !inline && match ? (
                <div className="relative group/code my-6">
                  <CopyButton text={codeString} />
                  <SyntaxHighlighter
                    style={oneDark}
                    language={match[1]}
                    PreTag="div"
                    className="rounded-xl p-6! m-0! border border-zinc-800"
                    {...props}>
                    {codeString}
                  </SyntaxHighlighter>
                </div>
              ) : (
                <code className={cn("bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded font-mono text-sm", className)} {...props}>
                  {children}
                </code>
              );
            },
            // Override pre to avoid double wrapping
            pre({ children }) {
              return <>{children}</>;
            }
          }}
        >
          {post.markdown}
        </Markdown>
      </div>
    </motion.div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 selection:bg-emerald-100 dark:selection:bg-emerald-900/30">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/:slug" element={<Post />} />
        </Routes>
        
        <footer className="max-w-3xl mx-auto px-6 py-20 border-t border-zinc-100 dark:border-zinc-900 text-zinc-400 text-sm">
          <p>© {new Date().getFullYear()} Bravin Rutto. All rights reserved.</p>
        </footer>
      </div>
    </BrowserRouter>
  );
}
