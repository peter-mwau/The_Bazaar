import React, { useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useNavigate, useParams } from "react-router-dom";
import {
  BookOpen,
  FileText,
  ChevronRight,
  Hash,
  Code,
  Terminal,
  Layers,
  Copy,
  Check,
} from "lucide-react";
import docsContent from "../content/docs/getting-started.md?raw";
import whitepaperContent from "../content/docs/whitepaper.md?raw";
import auditReportContent from "../content/docs/audit-report.md?raw";
import termsContent from "../content/docs/terms.md?raw";
import privacyContent from "../content/docs/privacy.md?raw";
import contactContent from "../content/docs/contact.md?raw";

function Docs() {
  const [scratchedTexture] = useState(() => {
    if (typeof document === "undefined") return null;

    const canvas = document.createElement("canvas");
    canvas.width = 400;
    canvas.height = 600;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < 200; i++) {
      ctx.beginPath();
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const width = Math.random() * 2 + 0.5;
      const angle = Math.random() * Math.PI;
      const length = Math.random() * 30 + 5;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.1 + 0.02})`;
      ctx.fillRect(0, 0, width, length);
      ctx.restore();
    }

    for (let i = 0; i < 500; i++) {
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.05})`;
      ctx.fillRect(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        Math.random() * 1.5,
        Math.random() * 1.5,
      );
    }

    return canvas.toDataURL();
  });
  const navigate = useNavigate();
  const { slug } = useParams();
  const [copiedSnippet, setCopiedSnippet] = useState("");

  const docsMap = {
    "getting-started": docsContent,
    whitepaper: whitepaperContent,
    "audit-report": auditReportContent,
    terms: termsContent,
    privacy: privacyContent,
    contact: contactContent,
  };

  const activeSection = docsMap[slug] ? slug : "getting-started";
  const activeContent = docsMap[activeSection];
  const [pageIndex, setPageIndex] = useState(0);

  const pagedSections = useMemo(() => {
    const lines = activeContent.split("\n");
    const sections = [];
    let current = [];

    for (const line of lines) {
      if (/^##\s+/.test(line) && current.length > 0) {
        sections.push(current.join("\n").trim());
        current = [line];
      } else {
        current.push(line);
      }
    }

    if (current.length > 0) {
      sections.push(current.join("\n").trim());
    }

    return sections.filter(Boolean);
  }, [activeContent]);

  const safePageIndex = Math.min(
    pageIndex,
    Math.max(pagedSections.length - 1, 0),
  );
  const pagedContent = pagedSections[safePageIndex] || activeContent;
  const hasPagination = pagedSections.length > 1;

  const copySnippet = async (snippet) => {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopiedSnippet(snippet);
      setTimeout(() => setCopiedSnippet(""), 1500);
    } catch {
      setCopiedSnippet("");
    }
  };

  // Custom clip path for vintage card shape
  const vintageClipPath =
    "polygon(2% 0%, 98% 1%, 100% 98%, 1% 100%, 0% 50%, 1% 2%)";

  // Custom components for ReactMarkdown
  const MarkdownComponents = {
    h1: ({ children }) => (
      <div className="relative mb-6 mt-8 first:mt-0">
        <div className="absolute -left-5 top-1/2 -translate-y-1/2 w-1 h-6 bg-emerald-500/40" />
        <h1 className="text-2xl sm:text-3xl font-bold text-white uppercase tracking-tighter">
          {children}
        </h1>
      </div>
    ),
    h2: ({ children }) => (
      <div className="relative mb-4 mt-8">
        <div className="flex items-center gap-2 mb-2">
          <Hash size={12} className="text-emerald-500/60" />
          <h2 className="text-xl font-bold text-white uppercase tracking-tight">
            {children}
          </h2>
        </div>
        <div className="w-12 h-px bg-white/20" />
      </div>
    ),
    h3: ({ children }) => (
      <div className="relative mb-3 mt-6">
        <h3 className="text-base font-bold text-white/90 uppercase tracking-tight flex items-center gap-2">
          <ChevronRight size={12} className="text-emerald-500/60" />
          {children}
        </h3>
      </div>
    ),
    p: ({ children }) => (
      <p className="text-white/70 leading-relaxed mb-4 text-sm font-mono">
        {children}
      </p>
    ),
    code: ({ children, className }) => {
      const isInline = !className;
      const codeValue = String(children).replace(/\n$/, "");
      if (isInline) {
        return (
          <code className="bg-white/10 px-1.5 py-0.5 rounded text-[11px] font-mono text-emerald-400 border border-white/10">
            {children}
          </code>
        );
      }
      return (
        <div className="relative my-4 group">
          <div className="absolute top-2 right-2 flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={() => copySnippet(codeValue)}
              className="flex items-center gap-1 rounded border border-white/20 bg-black/60 px-2 py-1 text-[9px] font-mono uppercase tracking-wider text-white/70 hover:text-white hover:border-white/40 transition-colors"
            >
              {copiedSnippet === codeValue ? (
                <Check size={11} />
              ) : (
                <Copy size={11} />
              )}
              {copiedSnippet === codeValue ? "Copied" : "Copy"}
            </button>
            <Terminal size={12} className="text-white/30" />
          </div>
          <pre className="bg-black/60 border border-white/15 rounded-lg p-4 overflow-x-auto">
            <code className="text-[11px] font-mono text-emerald-300/90 leading-relaxed">
              {children}
            </code>
          </pre>
        </div>
      );
    },
    pre: ({ children }) => children,
    ul: ({ children }) => (
      <ul className="space-y-2 mb-4 list-none">{children}</ul>
    ),
    li: ({ children }) => (
      <li className="text-white/70 text-sm font-mono flex items-start gap-2">
        <span className="text-emerald-500/60 mt-1">•</span>
        <span>{children}</span>
      </li>
    ),
    a: ({ href, children }) => (
      <a
        href={href}
        className="text-emerald-400/80 hover:text-emerald-400 transition-colors underline decoration-white/20 hover:decoration-emerald-400/50 underline-offset-2"
        target={href?.startsWith("http") ? "_blank" : undefined}
        rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
      >
        {children}
      </a>
    ),
    blockquote: ({ children }) => (
      <div className="relative my-4 pl-4 border-l-2 border-white/20 bg-white/5 py-2 pr-3">
        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-emerald-500/30" />
        <blockquote className="text-white/60 text-xs font-mono italic">
          {children}
        </blockquote>
      </div>
    ),
    table: ({ children }) => (
      <div className="overflow-x-auto my-6 border border-white/10 rounded-lg">
        <table className="min-w-full divide-y divide-white/10">
          {children}
        </table>
      </div>
    ),
    th: ({ children }) => (
      <th className="px-4 py-2 text-left text-[10px] font-mono uppercase tracking-wider text-white/60 border-b border-white/10">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="px-4 py-2 text-[11px] font-mono text-white/70 border-b border-white/5">
        {children}
      </td>
    ),
    hr: () => (
      <div className="my-6">
        <div className="w-full h-px bg-linear-to-r from-transparent via-white/20 to-transparent" />
      </div>
    ),
  };

  return (
    <div className="bg-black min-h-screen pt-24 pb-20 relative overflow-x-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.03),transparent_50%)]" />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='60' height='60' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 60 0 L 0 0 0 60' fill='none' stroke='rgba(255,255,255,0.02)' stroke-width='0.5'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grid)' /%3E%3C/svg%3E\")",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-12">
          <div className="border-l-2 border-white/20 pl-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-1 h-4 bg-emerald-500/60" />
              <p className="text-[10px] font-mono text-emerald-500/60 uppercase tracking-[0.4em]">
                // PROTOCOL_DOCS_v1.0.4
              </p>
            </div>
            <h1 className="text-4xl font-custom sm:text-5xl italic lg:text-6xl font-bold text-white uppercase tracking-tighter">
              Bazaar{" "}
              <span className="text-transparent [-webkit-text-stroke:0.8px_white]">
                Documentation
              </span>
            </h1>
            <p className="text-gray-500 font-mono text-[10px] mt-3 uppercase tracking-[0.3em] flex items-center gap-3">
              <span>STATIC_MARKDOWN</span>
              <span className="w-1 h-1 bg-white/20 rounded-full" />
              <span>VINTAGE_PROTOCOL</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
          {/* Sidebar - Vintage Style */}
          <aside className="h-fit sticky top-28">
            <div
              className="relative bg-black"
              style={{
                clipPath: vintageClipPath,
                background: scratchedTexture
                  ? `url(${scratchedTexture})`
                  : "#0a0a0a",
                backgroundSize: "cover",
              }}
            >
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  clipPath: vintageClipPath,
                  border: "1px solid rgba(255,255,255,0.12)",
                }}
              />

              <div
                className="relative p-5"
                style={{ clipPath: vintageClipPath }}
              >
                <div className="flex items-center gap-2 mb-6 pb-2 border-b border-white/10">
                  <BookOpen size={14} className="text-emerald-500/60" />
                  <span className="text-[9px] font-mono text-white/50 uppercase tracking-widest">
                    DOCUMENT INDEX
                  </span>
                </div>

                <nav className="space-y-1">
                  {[
                    {
                      id: "getting-started",
                      label: "Getting Started",
                      icon: FileText,
                    },
                    { id: "whitepaper", label: "Whitepaper", icon: Layers },
                    {
                      id: "audit-report",
                      label: "Audit Report",
                      icon: Terminal,
                    },
                    { id: "terms", label: "Terms", icon: Code },
                    { id: "privacy", label: "Privacy", icon: Hash },
                    { id: "contact", label: "Contact", icon: ChevronRight },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setPageIndex(0);
                        navigate(`/docs/${item.id}`);
                      }}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-[10px] font-mono uppercase tracking-wider transition-all duration-200 ${
                        activeSection === item.id
                          ? "text-white bg-white/5 border-l-2 border-emerald-500"
                          : "text-white/40 hover:text-white/70 hover:bg-white/5"
                      }`}
                    >
                      <item.icon size={10} />
                      {item.label}
                    </button>
                  ))}
                </nav>

                {/* Decorative Corner Elements */}
                <div className="absolute -top-0.5 -left-0.5 w-4 h-4">
                  <div className="absolute top-0 left-0 w-2.5 h-px bg-white/20" />
                  <div className="absolute top-0 left-0 w-px h-2.5 bg-white/20" />
                </div>
                <div className="absolute -top-0.5 -right-0.5 w-4 h-4">
                  <div className="absolute top-0 right-0 w-2.5 h-px bg-white/20" />
                  <div className="absolute top-0 right-0 w-px h-2.5 bg-white/20" />
                </div>
                <div className="absolute -bottom-0.5 -left-0.5 w-4 h-4">
                  <div className="absolute bottom-0 left-0 w-2.5 h-px bg-white/20" />
                  <div className="absolute bottom-0 left-0 w-px h-2.5 bg-white/20" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4">
                  <div className="absolute bottom-0 right-0 w-2.5 h-px bg-white/20" />
                  <div className="absolute bottom-0 right-0 w-px h-2.5 bg-white/20" />
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content - Vintage Card Style */}
          <section>
            <div
              className="relative bg-black transition-all duration-300"
              style={{
                clipPath: vintageClipPath,
                background: scratchedTexture
                  ? `url(${scratchedTexture})`
                  : "#0a0a0a",
                backgroundSize: "cover",
              }}
            >
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  clipPath: vintageClipPath,
                  border: "1px solid rgba(255,255,255,0.12)",
                }}
              />

              <div
                className="relative p-6 sm:p-10"
                style={{ clipPath: vintageClipPath }}
              >
                {hasPagination && (
                  <div className="mb-5 flex items-center justify-between gap-3 border-b border-white/10 pb-3">
                    <p className="text-[9px] font-mono uppercase tracking-widest text-white/50">
                      Section {safePageIndex + 1} / {pagedSections.length}
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setPageIndex((prev) => Math.max(prev - 1, 0))
                        }
                        disabled={safePageIndex === 0}
                        className="px-2 py-1 text-[9px] font-mono uppercase tracking-wider border border-white/20 text-white/70 disabled:text-white/25 disabled:border-white/10 hover:border-white/40 hover:text-white transition-colors"
                      >
                        Prev
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setPageIndex((prev) =>
                            Math.min(prev + 1, pagedSections.length - 1),
                          )
                        }
                        disabled={safePageIndex >= pagedSections.length - 1}
                        className="px-2 py-1 text-[9px] font-mono uppercase tracking-wider border border-white/20 text-white/70 disabled:text-white/25 disabled:border-white/10 hover:border-white/40 hover:text-white transition-colors"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}

                <article className="prose prose-invert max-w-none prose-headings:font-bold prose-headings:uppercase prose-headings:tracking-tight prose-p:text-white/80 prose-strong:text-white prose-li:text-white/75 prose-code:text-emerald-300 prose-pre:border prose-pre:border-white/15 prose-pre:bg-black/70 prose-table:text-white/80 prose-th:text-white prose-td:border-white/20 prose-blockquote:border-l-white/30 prose-blockquote:text-white/65">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={MarkdownComponents}
                  >
                    {pagedContent}
                  </ReactMarkdown>
                </article>

                {/* Vintage Stamp at Bottom */}
                <div className="mt-8 pt-4 border-t border-white/10 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-emerald-500/40 rounded-full" />
                    <p className="text-[6px] font-mono text-white/20 uppercase tracking-widest">
                      VERIFIED // BAZAAR PROTOCOL v1.0.4
                    </p>
                  </div>
                  <div className="opacity-20">
                    <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                      <circle
                        cx="15"
                        cy="15"
                        r="12"
                        stroke="white"
                        strokeWidth="0.5"
                      />
                      <path
                        d="M15 8 L15 22 M8 15 L22 15"
                        stroke="white"
                        strokeWidth="0.5"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Corner Decorations */}
              <div className="absolute -top-0.5 -left-0.5 w-5 h-5">
                <div className="absolute top-0 left-0 w-3 h-px bg-white/20" />
                <div className="absolute top-0 left-0 w-px h-3 bg-white/20" />
              </div>
              <div className="absolute -top-0.5 -right-0.5 w-5 h-5">
                <div className="absolute top-0 right-0 w-3 h-px bg-white/20" />
                <div className="absolute top-0 right-0 w-px h-3 bg-white/20" />
              </div>
              <div className="absolute -bottom-0.5 -left-0.5 w-5 h-5">
                <div className="absolute bottom-0 left-0 w-3 h-px bg-white/20" />
                <div className="absolute bottom-0 left-0 w-px h-3 bg-white/20" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5">
                <div className="absolute bottom-0 right-0 w-3 h-px bg-white/20" />
                <div className="absolute bottom-0 right-0 w-px h-3 bg-white/20" />
              </div>
            </div>
          </section>
        </div>
      </div>

      <style jsx>{`
        .prose code {
          font-size: 0.75rem;
        }
        .prose pre {
          background-color: rgba(0, 0, 0, 0.6);
        }
      `}</style>
    </div>
  );
}

export default Docs;
