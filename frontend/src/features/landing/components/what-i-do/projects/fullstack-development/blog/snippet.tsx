const code = `"use client";

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
}`;

export const snippet = code;
