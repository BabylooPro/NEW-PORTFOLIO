import { useState } from "react";

interface Post {
    id: number;
    title: string;
    content: string;
    likes: number;
}

export function BlogDemo() {
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
