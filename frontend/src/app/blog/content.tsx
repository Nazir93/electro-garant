"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

type PostItem = {
  id: string;
  slug?: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
};

function PostCard({
  post,
  index,
}: {
  post: PostItem;
  index: number;
}) {
  const ref = useRef<HTMLDivElement & HTMLAnchorElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const inner = (
    <div
      className="relative overflow-hidden flex flex-col justify-between h-[360px] p-6 md:p-8 transition-transform duration-500 group-hover:scale-[0.98]"
      style={{
        backgroundColor: "var(--bg-secondary)",
        border: "1px solid var(--border)",
        borderRadius: "20px",
      }}
    >
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ opacity: 0.03 }}
      >
        <span
          className="font-heading text-[160px] leading-none select-none"
          style={{ color: "var(--text)" }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <span
            className="text-[10px] uppercase tracking-[0.15em] px-3 py-1 rounded-full"
            style={{ border: "1px solid var(--border)", color: "var(--text-muted)" }}
          >
            {post.category}
          </span>
          <span className="text-[10px] tracking-wider" style={{ color: "var(--text-subtle)" }}>
            {post.date}
          </span>
        </div>
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
          style={{ border: "1px solid var(--border)" }}
        >
          <ArrowRight size={16} style={{ color: "var(--text)" }} />
        </div>
      </div>

      <div className="relative z-10">
        <h3
          className="font-heading text-xl md:text-2xl leading-[1.1] mb-3 transition-colors duration-200 group-hover:text-[var(--accent)]"
          style={{ color: "var(--text)" }}
        >
          {post.title}
        </h3>
        <p className="text-xs leading-relaxed line-clamp-3" style={{ color: "var(--text-muted)" }}>
          {post.excerpt}
        </p>
      </div>
    </div>
  );

  const sharedStyle = {
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(40px)",
    transitionDelay: `${(index % 3) * 100}ms`,
  };

  if (post.slug) {
    return (
      <Link
        href={`/blog/${post.slug}`}
        ref={ref as React.Ref<HTMLAnchorElement>}
        className="group cursor-pointer transition-all duration-700 ease-out block"
        style={sharedStyle}
      >
        {inner}
      </Link>
    );
  }

  return (
    <div
      ref={ref}
      className="group cursor-pointer transition-all duration-700 ease-out"
      style={sharedStyle}
    >
      {inner}
    </div>
  );
}

export function BlogPageContent({ posts }: { posts: PostItem[] }) {
  return (
    <section className="pt-32 pb-20 md:pt-40 md:pb-28" style={{ backgroundColor: "var(--bg)" }}>
      <div className="container mx-auto">
        <h1
          className="font-heading text-[20vw] md:text-[14vw] lg:text-[12vw] leading-[0.85] tracking-tighter mb-6"
          style={{ color: "var(--text)" }}
        >
          БЛОГ
        </h1>
        <p className="text-base md:text-lg mb-14 md:mb-20 max-w-xl" style={{ color: "var(--text-muted)" }}>
          Полезные статьи, кейсы и новости из мира электромонтажа и автоматизации
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {posts.map((post, i) => (
            <PostCard key={post.id} post={post} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
