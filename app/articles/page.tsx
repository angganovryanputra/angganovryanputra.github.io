"use client"

import { useState, useEffect } from "react"
import { MatrixRain } from "@/components/matrix-rain"
import { Navigation } from "@/components/navigation"
import { LoadingSpinner } from "@/components/loading-spinner"
import { fetchMediumPosts, type MediumPost } from "@/lib/medium-rss"
import { ExternalLink, Calendar, User, Tag } from "lucide-react"

export default function ArticlesPage() {
  const [posts, setPosts] = useState<MediumPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true)
        setError(null)
        const mediumPosts = await fetchMediumPosts("angganvryn")
        setPosts(mediumPosts)
        console.log("Successfully loaded Medium posts:", mediumPosts.length)
      } catch (err) {
        console.error("Failed to load Medium posts:", err)
        setError("Failed to fetch articles from Medium. Please check your internet connection.")
        setPosts([])
      } finally {
        setLoading(false)
      }
    }

    loadPosts()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-green-400 font-mono relative overflow-hidden">
        <MatrixRain />
        <div className="relative z-10">
          <Navigation />
          <main className="container mx-auto px-4 py-8">
            <LoadingSpinner message="Loading Medium articles..." />
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono relative overflow-hidden">
      <MatrixRain />
      <div className="relative z-10">
        <Navigation />
        <main className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="bg-black/90 border border-green-400 p-4 md:p-6 rounded-lg">
            <div className="text-green-400 text-lg md:text-xl font-bold mb-6 flex items-center">
              <Tag className="w-5 h-5 mr-2" />$ curl -s https://medium.com/@angganvryn/feed
            </div>
            <div className="text-green-300 mb-6 text-sm md:text-base">
              Latest cybersecurity articles and insights from Medium...
            </div>

            {error && (
              <div className="bg-red-900/20 border border-red-400 p-4 rounded mb-6">
                <div className="text-red-400 text-sm">❌ {error}</div>
                <div className="text-red-300 text-xs mt-2">
                  Make sure you have an active internet connection and the Medium RSS feed is accessible.
                </div>
              </div>
            )}

            {posts.length > 0 ? (
              <>
                <div className="bg-green-900/20 border border-green-400 p-4 rounded mb-6">
                  <div className="text-green-400 text-sm">
                    ✅ Successfully loaded {posts.length} articles from Medium
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                  {posts.map((post, index) => (
                    <article
                      key={post.guid || index}
                      className="bg-black/80 border border-green-400 p-4 md:p-6 rounded hover:border-green-300 transition-colors group"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-green-400 text-sm md:text-lg font-bold mb-2 pr-2">
                            <a
                              href={post.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-green-300 transition-colors flex items-start gap-2 group-hover:text-green-300"
                            >
                              <span className="flex-1">{post.title}</span>
                              <ExternalLink
                                size={16}
                                className="mt-1 flex-shrink-0 opacity-70 group-hover:opacity-100"
                              />
                            </a>
                          </h3>
                          <div className="flex items-center gap-4 text-xs text-green-300 mb-2">
                            <div className="flex items-center">
                              <User className="w-3 h-3 mr-1" />
                              {post.author}
                            </div>
                            <div className="flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              {new Date(post.pubDate).toLocaleDateString()}
                            </div>
                            {post.readTime && <div className="text-cyan-400">{post.readTime}</div>}
                          </div>
                        </div>
                      </div>

                      <p className="text-green-300 text-xs md:text-sm leading-relaxed mb-4 line-clamp-4">
                        {post.description}
                      </p>

                      <div className="flex flex-wrap gap-1 md:gap-2 mb-4">
                        {post.categories.slice(0, 4).map((category, categoryIndex) => (
                          <span
                            key={categoryIndex}
                            className="px-2 py-1 bg-green-400/10 border border-green-400 text-green-400 text-xs rounded hover:bg-green-400/20 transition-colors"
                          >
                            #{category.toLowerCase().replace(/\s+/g, "_")}
                          </span>
                        ))}
                        {post.categories.length > 4 && (
                          <span className="px-2 py-1 bg-green-400/10 border border-green-400 text-green-400 text-xs rounded">
                            +{post.categories.length - 4} more
                          </span>
                        )}
                      </div>

                      <div className="pt-4 border-t border-green-400/30">
                        <a
                          href={post.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-cyan-400 hover:text-cyan-300 text-xs transition-colors inline-flex items-center gap-1"
                        >
                          Read full article on Medium →
                        </a>
                      </div>
                    </article>
                  ))}
                </div>
              </>
            ) : (
              !error && (
                <div className="text-center py-12">
                  <div className="text-green-300 text-lg mb-2">No articles found</div>
                  <div className="text-green-300/70 text-sm">
                    Articles will appear here once published on Medium (@angganvryn)
                  </div>
                </div>
              )
            )}

            {/* Medium Integration Info */}
            <div className="bg-black/80 border border-green-400 p-4 md:p-6 rounded mt-8">
              <h2 className="text-green-400 text-lg font-bold mb-4"># Medium Integration</h2>
              <div className="text-green-300 space-y-2 text-xs md:text-sm">
                <div>{"> Medium Username: @angganvryn"}</div>
                <div>{"> RSS Feed: https://medium.com/feed/@angganvryn"}</div>
                <div>{"> API: RSS2JSON (Free Tier)"}</div>
                <div className={posts.length > 0 ? "text-green-400" : "text-yellow-400"}>
                  {"> Status: "}
                  {posts.length > 0 ? `Connected ✅ (${posts.length} articles)` : "Checking... ⏳"}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
