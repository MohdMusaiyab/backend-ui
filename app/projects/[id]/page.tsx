import type { Metadata, ResolvingMetadata } from "next";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { notFound } from "next/navigation";
import { IBM_Plex_Mono } from "next/font/google";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import projectsData from "../../../data/projects.json";

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const GithubIcon = ({ size = 20, className }: { size?: number, className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export async function generateStaticParams() {
  const contentDir = path.join(process.cwd(), "content/projects");
  if (!fs.existsSync(contentDir)) {
    return [];
  }
  const files = fs.readdirSync(contentDir);
  return files.map((filename) => ({
    id: filename.replace(".md", ""),
  }));
}

function getProject(id: string) {
  try {
    const markdownWithMeta = fs.readFileSync(
      path.join(process.cwd(), "content/projects", id + ".md"),
      "utf-8"
    );
    const { data: frontmatter, content } = matter(markdownWithMeta);
    return { frontmatter, content };
  } catch (e) {
    return null;
  }
}

export async function generateMetadata(
  props: { params: Promise<{ id: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const params = await props.params;
  const project = getProject(params.id);
  
  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  const { frontmatter } = project;
  const projectMeta = projectsData.find(p => p.id === params.id);
  const description = projectMeta?.description || `A technical deep-dive into the ${frontmatter.title} architecture.`;

  return {
    title: frontmatter.title,
    description: description,
    openGraph: {
      title: frontmatter.title,
      description: description,
      url: `https://backend-journal.vercel.app/projects/${params.id}`,
    },
    twitter: {
      title: frontmatter.title,
      description: description,
    },
  };
}

export default async function ProjectPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const project = getProject(params.id);
  
  if (!project) {
    notFound();
  }

  const { frontmatter, content } = project;

  return (
    <main className={`${mono.className} min-h-screen bg-[#121210] text-[#EDE7D8] px-6 py-24 sm:py-32 selection:bg-[#B4482F] selection:text-white`}>
      <article className="mx-auto max-w-[800px] w-full">
        {/* Navigation */}
        <div className="mb-16">
          <Link href="/#projects" className="inline-flex items-center gap-3 text-[13px] uppercase tracking-[0.2em] font-bold text-[#7A7360] hover:text-[#8B6BC4] transition-colors">
            <ArrowLeft size={16} /> Back to Gallery
          </Link>
        </div>

        {/* Header */}
        <header className="mb-16 border-b-2 border-[#2A2A22] pb-12">
          <div className="flex items-center gap-3 mb-6">
             <span className="px-3 py-1 bg-[#2A2A22] text-[#8B6BC4] text-[10px] uppercase tracking-widest font-bold">
               {frontmatter.category}
             </span>
          </div>
          
          <h1 className="text-[3rem] sm:text-[4.5rem] leading-[1.1] font-bold tracking-tight text-[#EDE7D8] mb-8">
            {frontmatter.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex flex-wrap gap-2">
              {frontmatter.techStack?.map((tech: string) => (
                <span key={tech} className="text-[11px] uppercase tracking-[0.15em] font-semibold text-[#7A7360] border border-[#2A2A22] px-3 py-1.5 bg-[#161614] hover:border-[#B4482F] hover:text-[#EDE7D8] hover:scale-105 transition-all duration-300 cursor-default">
                  {tech}
                </span>
              ))}
            </div>

            {frontmatter.githubUrl && (
              <a href={frontmatter.githubUrl} target="_blank" rel="noreferrer" className="group flex items-center gap-2 text-[14px] font-semibold text-[#C9C2AE] hover:text-[#B4482F] transition-all duration-300">
                <GithubIcon size={20} className="group-hover:-translate-y-1 group-hover:rotate-12 transition-transform duration-300 ease-out" /> 
                <span className="group-hover:translate-x-1 transition-transform duration-300">View Repository</span>
              </a>
            )}
          </div>
        </header>

        {/* Markdown Content */}
        <div className="prose prose-invert max-w-none prose-p:text-[#C9C2AE] prose-p:leading-relaxed prose-headings:text-[#EDE7D8] prose-a:text-[#8B6BC4] hover:prose-a:text-[#B4482F] prose-a:transition-colors">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={{
              code({node, className, children, ...props}: any) {
                const match = /language-(\w+)/.exec(className || '')
                if (match) {
                  return (
                    <SyntaxHighlighter
                      {...props}
                      style={vscDarkPlus as any}
                      language={match[1]}
                      PreTag="div"
                      customStyle={{
                        background: "#161614",
                        border: "1px solid #2A2A22",
                        borderRadius: "0.375rem",
                        padding: "1rem",
                        margin: "1.5rem 0",
                        fontSize: "0.9em"
                      }}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  )
                }
                return (
                  <code {...props} className={`${className || ''} bg-[#161614] border border-[#2A2A22] px-1.5 py-0.5 rounded text-[#B4482F]`}>
                    {children}
                  </code>
                )
              }
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </article>
    </main>
  );
}
