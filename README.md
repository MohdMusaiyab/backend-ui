# Backend Architecture Gallery 🚀

Hey there! Welcome to the source code of my **Backend Architecture Portfolio**.

Instead of a standard "about me" website, I wanted a place to properly document the systems I build. This is a statically generated, highly-optimized Next.js app designed to showcase complex backend architectures, distributed queues, and high-concurrency patterns through deep-dive engineering logs.

You can check out the live site here: https://backend-journal.vercel.app <img width="1805" height="861" alt="image" src="https://github.com/user-attachments/assets/8cad5b38-76a6-41c3-9684-5221fde9afd0" />

## 🛠️ The Tech Stack

This isn't just a basic React template; it's engineered with production-grade best practices:

* **Framework**: Next.js (App Router)
* **Styling**: Tailwind CSS with custom multi-theme sections (Gruvbox Dark/Light)
* **Content Engine**: Native Markdown (`react-markdown` + `remark-gfm`)
* **Syntax Highlighting**: `react-syntax-highlighter` (VS Code Dark theme)
* **SEO & Metadata**: 100% programmatic SEO, auto-generating Sitemaps, and JSON-LD Structured Data
* **Icons**: Programmatic JSX Favicons (`next/og`) & Lucide React

## 📂 Project Structure

* `/content/projects/` - This is the brain of the site. All projects are written as standard Markdown (`.md`) files. The App Router dynamically parses these into static pages.
* `/data/projects.json` - The metadata registry that feeds the Bento Grid on the homepage.
* `/app/projects/[id]/page.tsx` - The dynamic route that reads the Markdown, injects specific SEO tags, and renders the technical deep-dives.

## 🚀 Getting Started Locally

Want to spin it up yourself? It's super lightweight.

1. **Clone the repo**

   ```bash
   git clone https://github.com/MohdMusaiyab/backend-ui.git
   cd backend-ui
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run the development server**

   ```bash
   npm run dev
   ```

4. Open http://localhost:3000 (or 3001 if the port is busy) in your browser!

## ✍️ Adding a New Project

Adding a new architectural log is practically effortless:

1. Write your deep-dive in a new Markdown file: `content/projects/my-new-system.md`.
2. Add the title and tech stack to the `projects.json` array.
3. Next.js automatically generates the route, updates the homepage grid, and pushes the new route to the `sitemap.xml` for Google to index.

## 🤝 Let's Connect

If you're into distributed systems, Go, Node.js, or just want to chat about architecture, feel free to reach out!

* **Twitter/X**: [@mohd_musaiyab](https://x.com/mohd_musaiyab)
* **LinkedIn**: [Mohd Musaiyab](https://www.linkedin.com/in/mohd-musaiyab/)

---

## 🌐 Personal Website

* **Website**: https://itsmusaiyab.in/
