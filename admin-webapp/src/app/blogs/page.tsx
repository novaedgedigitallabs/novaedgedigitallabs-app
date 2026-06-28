"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, FileJson, Trash2, Edit, X, RefreshCw, Eye, CheckCircle2, AlertCircle, Calendar, Clock, User, Newspaper } from "lucide-react";
import { toast } from "sonner";
import { AdminLayout } from "@/components/layout/AdminLayout";

interface Blog {
    _id: string;
    id: string;
    title: string;
    category: string;
    author: string;
    publishedAt: string;
    readTime: string;
    imageUrl: string;
}

export default function BlogsPage() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [jsonInput, setJsonInput] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, '') || "";

    const fetchBlogs = async () => {
        try {
            setIsLoading(true);
            const res = await fetch(`${API_URL}/api/blogs`);
            if (!res.ok) throw new Error("Failed to fetch blogs");
            const data = await res.json();
            setBlogs(data.data || []);
        } catch (error) {
            console.error("Error fetching blogs:", error);
            toast.error("Failed to load blogs");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this blog post?")) return;
        
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_URL}/api/blogs/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            
            if (!res.ok) throw new Error("Failed to delete blog");
            
            toast.success("Blog deleted successfully");
            fetchBlogs();
        } catch (error) {
            console.error("Error deleting blog:", error);
            toast.error("Failed to delete blog");
        }
    };

    const handleJsonSubmit = async () => {
        if (!jsonInput.trim()) {
            toast.error("Please paste valid JSON data");
            return;
        }

        setIsSubmitting(true);
        try {
            const parsedData = JSON.parse(jsonInput);
            const token = localStorage.getItem("token");
            
            const res = await fetch(`${API_URL}/api/blogs`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(parsedData)
            });

            const result = await res.json();
            
            if (!res.ok) {
                throw new Error(result.message || "Failed to create blog");
            }

            toast.success("Blog created successfully!");
            setIsCreateModalOpen(false);
            setJsonInput("");
            fetchBlogs();
        } catch (error: any) {
            console.error("Error creating blog:", error);
            toast.error(error.message || "Invalid JSON or failed to create blog");
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredBlogs = blogs.filter(blog => 
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <AdminLayout>
            <div className="w-full max-w-7xl mx-auto space-y-6">
                
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold gradient-text">Manage Blogs</h1>
                        <p className="text-muted-foreground mt-1">Create and manage your community feed updates.</p>
                    </div>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all font-medium shadow-lg shadow-primary/20 active:scale-95"
                    >
                        <Plus className="w-5 h-5" />
                        Upload via JSON
                    </button>
                </div>

                {/* Filters */}
                <div className="glass-panel p-4 rounded-2xl flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full sm:max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search blogs by title or category..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-neutral-900/50 border border-border rounded-xl pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground transition-all"
                        />
                    </div>
                    <button 
                        onClick={fetchBlogs}
                        className="p-2 text-muted-foreground hover:text-foreground bg-neutral-900/50 hover:bg-neutral-800 rounded-xl transition-all border border-border"
                        title="Refresh"
                    >
                        <RefreshCw className={isLoading ? "animate-spin" : ""} />
                    </button>
                </div>

                {/* Content */}
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                        <RefreshCw className="w-10 h-10 animate-spin text-primary mb-4" />
                        <p>Loading blogs...</p>
                    </div>
                ) : filteredBlogs.length === 0 ? (
                    <div className="glass-panel rounded-2xl p-12 flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 bg-neutral-900 rounded-full flex items-center justify-center mb-4">
                            <FileJson className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">No blogs found</h3>
                        <p className="text-muted-foreground max-w-md">
                            {searchQuery ? "No blogs match your search criteria." : "You haven't uploaded any blogs yet. Click the button above to paste your first blog JSON."}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        <AnimatePresence>
                            {filteredBlogs.map((blog, index) => (
                                <motion.div
                                    key={blog._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.2, delay: index * 0.05 }}
                                    className="glass-panel rounded-2xl overflow-hidden group flex flex-col h-full hover:border-primary/50 transition-colors"
                                >
                                    <div className="relative h-48 bg-neutral-900 w-full overflow-hidden">
                                        {blog.imageUrl ? (
                                            <img 
                                                src={blog.imageUrl} 
                                                alt={blog.title} 
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Newspaper className="w-12 h-12 text-muted-foreground/30" />
                                            </div>
                                        )}
                                        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium border border-white/10">
                                            {blog.category}
                                        </div>
                                    </div>
                                    
                                    <div className="p-5 flex-1 flex flex-col">
                                        <h3 className="text-lg font-bold line-clamp-2 mb-3 group-hover:text-primary transition-colors">
                                            {blog.title}
                                        </h3>
                                        
                                        <div className="space-y-2 mt-auto">
                                            <div className="flex items-center text-sm text-muted-foreground gap-2">
                                                <User className="w-4 h-4" />
                                                <span className="truncate">{blog.author}</span>
                                            </div>
                                            <div className="flex items-center text-sm text-muted-foreground gap-2">
                                                <Calendar className="w-4 h-4" />
                                                <span>{new Date(blog.publishedAt).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex items-center text-sm text-muted-foreground gap-2">
                                                <Clock className="w-4 h-4" />
                                                <span>{blog.readTime}</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="border-t border-border p-3 bg-neutral-900/30 flex justify-end gap-2">
                                        <button 
                                            onClick={() => handleDelete(blog._id)}
                                            className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            {/* Create JSON Modal */}
            <AnimatePresence>
                {isCreateModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => !isSubmitting && setIsCreateModalOpen(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-3xl glass-panel bg-background rounded-2xl shadow-2xl overflow-hidden border border-border flex flex-col max-h-[90vh]"
                        >
                            <div className="p-6 border-b border-border flex justify-between items-center bg-neutral-900/50">
                                <div>
                                    <h2 className="text-xl font-bold">Upload Blog via JSON</h2>
                                    <p className="text-sm text-muted-foreground mt-1">Paste the exact JSON object from your website data.</p>
                                </div>
                                <button
                                    onClick={() => !isSubmitting && setIsCreateModalOpen(false)}
                                    className="p-2 hover:bg-neutral-800 rounded-full transition-colors"
                                    disabled={isSubmitting}
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-6 flex-1 overflow-y-auto">
                                <div className="space-y-4">
                                    <div className="bg-primary/10 border border-primary/20 p-4 rounded-xl flex gap-3 text-primary/90 text-sm">
                                        <AlertCircle className="w-5 h-5 shrink-0" />
                                        <p>
                                            Ensure your JSON contains all required fields (title, slug, body array, etc.). 
                                            The system will automatically validate the structure before uploading.
                                        </p>
                                    </div>
                                    
                                    <textarea
                                        value={jsonInput}
                                        onChange={(e) => setJsonInput(e.target.value)}
                                        placeholder="{\n  &quot;id&quot;: &quot;mvp-app-development-start-small&quot;,\n  &quot;title&quot;: &quot;...&quot;,\n  &quot;body&quot;: [...]\n}"
                                        className="w-full h-[400px] bg-neutral-950 border border-border rounded-xl p-4 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                                        spellCheck={false}
                                    />
                                </div>
                            </div>

                            <div className="p-6 border-t border-border bg-neutral-900/50 flex justify-end gap-3">
                                <button
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="px-4 py-2 hover:bg-neutral-800 rounded-xl transition-colors font-medium disabled:opacity-50"
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleJsonSubmit}
                                    disabled={isSubmitting || !jsonInput.trim()}
                                    className="px-6 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors font-medium flex items-center gap-2 disabled:opacity-50"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <RefreshCw className="w-4 h-4 animate-spin" />
                                            Uploading...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle2 className="w-4 h-4" />
                                            Upload Blog
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </AdminLayout>
    );
}
