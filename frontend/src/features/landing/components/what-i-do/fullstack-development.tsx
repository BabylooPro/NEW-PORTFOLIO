import { ProjectData } from "./types";
import { useState } from "react";

interface Post {
    id: number;
    title: string;
    content: string;
    likes: number;
}

function BlogDemo() {
    const [posts, setPosts] = useState<Post[]>([
        { id: 1, title: "Getting Started with Next.js", content: "Next.js is a powerful framework...", likes: 5 },
        { id: 2, title: "APIs with Express", content: "Building REST APIs with Express...", likes: 3 },
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [newPost, setNewPost] = useState({ title: "", content: "" });

    const handleAddPost = () => {
        setIsLoading(true);

        setTimeout(() => {
            const post = {
                id: Date.now(),
                title: newPost.title,
                content: newPost.content,
                likes: 0
            };
            setPosts([post, ...posts]);
            setNewPost({ title: "", content: "" });
            setIsLoading(false);
        }, 800);
    };

    const handleLike = (postId: number) => {
        setPosts(posts.map(post =>
            post.id === postId ? { ...post, likes: post.likes + 1 } : post
        ));
    };

    return (
        <div className="flex flex-col gap-4 p-4 border rounded-lg w-full max-w-md">
            <div className="space-y-3 border-b pb-4">
                <input
                    type="text"
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                    placeholder="Post title"
                    className="w-full px-3 py-2 border rounded-md dark:bg-neutral-800 dark:border-neutral-700"
                />
                <textarea
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                    placeholder="Post content"
                    className="w-full px-3 py-2 border rounded-md dark:bg-neutral-800 dark:border-neutral-700"
                />
                <button
                    onClick={handleAddPost}
                    disabled={isLoading || !newPost.title || !newPost.content}
                    className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                >
                    {isLoading ? "Publishing..." : "Publish Post"}
                </button>
            </div>

            <div className="space-y-4">
                {posts.map(post => (
                    <div key={post.id} className="p-3 border rounded-md dark:border-neutral-700">
                        <h3 className="font-medium">{post.title}</h3>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                            {post.content}
                        </p>
                        <button
                            onClick={() => handleLike(post.id)}
                            className="mt-2 text-sm text-blue-500 hover:text-blue-600"
                        >
                            ❤️ {post.likes} likes
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export const fullstackDevelopment: ProjectData = {
    title: "FullStack Development",
    file: "blog.tsx",
    language: "typescript",
    snippetHeight: 635,
    snippet: `

"use client";

import { useState, useEffect } from 'react';

interface Post {
  id: number;
  title: string;
  content: string;
  likes: number;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  // FETCH POSTS ON COMPONENT MOUNT
  useEffect(() => {
    fetchPosts();
  }, []);

  // FETCH POSTS FROM API
  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts');
      const data = await response.json();
      setPosts(data);
    } finally {
      setLoading(false);
    }
  };

  // LIKE A POST AND REFRESH POSTS
  const handleLike = async (postId: number) => {
    await fetch(\`/api/posts/\${postId}/like\`, {
      method: 'PUT'
    });
    await fetchPosts();
  };

  // HANDLE FORM SUBMISSION
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    // CREATE A NEW POST
    await fetch('/api/posts', {
      method: 'POST',
      body: JSON.stringify({
        title: formData.get('title'),
        content: formData.get('content')
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // RESET FORM AND REFRESH POSTS
    form.reset();
    await fetchPosts();
  };

  if (loading) return <div>Loading...</div>; // LOADING STATE

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* POST FORM */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <input
          name="title"
          placeholder="Post title"
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          name="content"
          placeholder="Write your post..."
          className="w-full p-2 border rounded"
          rows={4}
          required
        />
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
          Publish
        </button>
      </form>

      {/* POSTS LIST */}
      <div className="space-y-6">
        {posts.map((post) => (
          <article key={post.id} className="border rounded p-4">
            <h2 className="text-xl font-bold">{post.title}</h2>
            <p className="mt-2 text-gray-600">{post.content}</p>
            <button
              onClick={() => handleLike(post.id)}
              className="mt-4 text-blue-500"
            >
              ❤️ {post.likes} likes
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}`,
    preview: {
        type: "component",
        content: BlogDemo
    },
    project: {
        name: "Development/Blogify",
        branch: "web"
    },
    terminal: true,
    terminalCommands: [
        {
            command: 'docker compose up mysql -d',
            output: 'Creating volume "blog_mysql_data" with default driver\n[+] Running 2/2\n ✔ Network blog_default      Created\n ✔ Container blog-mysql-1   Started',
            delay: 1500
        },
        {
            command: 'mysql -u root -p blog < schema.sql',
            output: 'Enter password: ****\nDatabase schema created successfully\nTables: posts, users, comments created',
            delay: 1500
        },
        {
            command: 'npm run test',
            output: '> frontend@0.1.0 test\n> dotenv --env-file .env.test -- jest --testPathPattern=\'^(?!.*integration).*$\'\n\n PASS  __tests__/app/api/blog/posts.test.ts\n PASS  __tests__/app/api/blog/likes.test.ts\n PASS  __tests__/app/blog/page.test.tsx\n\nTest Suites: 3 passed, 3 total\nTests:       12 passed, 12 total\nSnapshots:   0 total\nTime:        1.245s',
            delay: 2000
        },
        {
            command: 'npm run dev',
            output: '> frontend@0.1.0 dev\n> next dev --turbopack\n\n ⚠ Port 3000 is in use, trying 3001 instead.\n   ▲ Next.js 15.0.3 (Turbopack)\n   - Local:        http://localhost:3001\n   - Environments: .env\n\n ✓ Starting...\n ✓ Ready in 805ms',
            delay: 1800
        }
    ]
};
