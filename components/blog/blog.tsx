import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Clock, User, ArrowLeft, Calendar, Tag } from 'lucide-react';

// Mock blog data - in a real app, this would come from an API
const blogPosts = [
  {
    id: 1,
    title: "Designing with Purpose",
    excerpt: "Exploring how intentional design choices create meaningful user experiences.",
    content: `
      <p>Great design doesn't just happen by accident. It's the result of intentional decisions that prioritize the needs of users while achieving business goals.</p>
      <p>When we talk about designing with purpose, we're referring to the practice of making deliberate design choices that serve specific objectives...</p>
      <h2>The Elements of Purposeful Design</h2>
      <p>Purposeful design considers all aspects of the user experience...</p>
      <h2>Beyond the Surface</h2>
      <p>Designing with purpose goes deeper than what's immediately visible...</p>
    `,
    author: "Sarah Miller",
    date: "April 28, 2025",
    category: "Design",
    readTime: "4 min read",
    image: "./Blog-1.gif",
    authorImage: "./Blog-1.gif"
  },
  {
    id: 2,
    title: "The Evolution of Interfaces",
    excerpt: "How UI design has transformed over the decades and where it's headed next.",
    content: `
      <p>User interfaces have come a long way since the early days of computing...</p>
      <h2>From Commands to Gestures</h2>
      <p>The 1980s saw the mainstream adoption of graphical user interfaces...</p>
      <h2>Present and Future Directions</h2>
      <p>Today's interfaces are increasingly conversational, ambient, and contextual...</p>
    `,
    author: "Michael Chen",
    date: "April 24, 2025",
    category: "Technology",
    readTime: "6 min read",
    image: "./Blog-1.gif",
    authorImage: "./Blog-1.gif"
  },
  {
    id: 3,
    title: "Minimalism in Digital Products",
    excerpt: "Why less continues to be more in the world of product design.",
    content: `
      <p>Minimalism isn't just an aesthetic choice—it's a design philosophy...</p>
      <h2>The Benefits of Digital Minimalism</h2>
      <p>Minimalist design offers several advantages...</p>
      <h2>Minimalism vs. Simplicity</h2>
      <p>It's important to distinguish between minimalism and simplicity...</p>
    `,
    author: "Alex Rivera",
    date: "April 20, 2025",
    category: "Design",
    readTime: "3 min read",
    image: "./Blog-1.gif",
    authorImage: "./Blog-1.gif"
  }
];

// Main App component with routing
export default function BlogApp() {
  const [currentView, setCurrentView] = useState('list');
  const [currentPostId, setCurrentPostId] = useState<number | null>(null);

  const handleReadMore = (postId: number) => {
    setCurrentPostId(postId);
    setCurrentView('detail');
    window.scrollTo(0, 0);
  };

  const goBack = () => {
    setCurrentView('list');
  };

  const BlogListView = () => {
    const [hoveredTile, setHoveredTile] = useState<number | null>(null);

    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { staggerChildren: 0.2 }
      }
    };

    const tileVariants = {
      hidden: { opacity: 0, y: 50 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { type: "spring", stiffness: 100, damping: 15 }
      }
    };

    return (
      <div className="min-h-screen  py-16 px-6 font-sans">
        <div className="max-w-6xl justify-center mx-auto flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-16"
          >
            <h1 className="text-5xl font-bold mb-6 text-neutral-900">Latest Stories</h1>
            <p className="text-center text-xl text-black max-w-2xl">
              Insights and perspectives on design, technology, and the creative process.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {blogPosts.map((post) => (
              <motion.div
                key={post.id}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                variants={tileVariants}
                onMouseEnter={() => setHoveredTile(post.id)}
                onMouseLeave={() => setHoveredTile(null)}
              >
                <div className="h-60 overflow-hidden">
                  <motion.img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                    initial={{ scale: 1 }}
                    animate={{ scale: hoveredTile === post.id ? 1.05 : 1 }}
                    transition={{ duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }}
                  />
                </div>

                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <span className="text-sm font-medium text-emerald-600 mr-4">{post.category}</span>
                    <span className="text-sm text-neutral-500 flex items-center">
                      <Clock size={14} className="mr-1" />
                      {post.readTime}
                    </span>
                  </div>

                  <h2 className="text-2xl font-bold mb-3 text-neutral-900">{post.title}</h2>
                  <p className="text-neutral-600 mb-6">{post.excerpt}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <User size={16} className="text-neutral-500 mr-2" />
                      <span className="text-sm text-neutral-500">{post.author}</span>
                    </div>

                    <motion.div
                      className="flex items-center text-sm font-medium text-blue-600 cursor-pointer"
                      initial={{ x: 0 }}
                      animate={{ x: hoveredTile === post.id ? 5 : 0 }}
                      transition={{ duration: 0.3 }}
                      onClick={() => handleReadMore(post.id)}
                    >
                      Read more <ChevronRight size={16} className="ml-1" />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    );
  };

  const BlogDetailView = () => {
    const post = blogPosts.find(p => p.id === currentPostId);
    if (!post) return <div>Post not found</div>;

    return (
      <div className="min-h-screen bg-neutral-50 font-sans">
        <motion.div
          className="h-96 w-full relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

          <motion.button
            className="absolute top-8 left-8 flex items-center text-white bg-black/30 hover:bg-black/50 px-4 py-2 rounded-full transition-colors duration-200"
            onClick={goBack}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to articles
          </motion.button>
        </motion.div>

        <div className="max-w-4xl mx-auto px-6 -mt-24 relative z-10">
          <motion.div
            className="bg-white rounded-2xl shadow-xl p-8 mb-12"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center gap-4 mb-6">
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-medium rounded-full">
                {post.category}
              </span>
              <span className="text-sm text-neutral-500 flex items-center">
                <Clock size={14} className="mr-1" />
                {post.readTime}
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-neutral-900">{post.title}</h1>

            <div className="flex items-center justify-between border-t border-neutral-200 pt-6">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                  <img src={post.authorImage} alt={post.author} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="font-medium text-neutral-900">{post.author}</p>
                  <div className="flex items-center text-sm text-neutral-500">
                    <Calendar size={14} className="mr-1" />
                    {post.date}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white text-black rounded-2xl shadow-lg p-8 mb-12"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </motion.div>

          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <button
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-full hover:bg-blue-700 transition-colors duration-200"
              onClick={goBack}
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to all articles
            </button>
          </motion.div>
        </div>
      </div>
    );
  };

  return currentView === 'list' ? <BlogListView /> : <BlogDetailView />;
}
