# create-revo

**create-revo** is a fast, minimal project setup tool for **React** and **Next.js** projects. Get started with modern, production-ready templates in seconds.

---

## ✨ Features

- **Two Framework Options**: React (Vite) or Next.js
- **TypeScript Ready**: Pre-configured TypeScript setup
- **Tailwind CSS**: Fully configured utility-first styling
- **Latest Versions**: React 19, Next.js 16, and latest dependencies
- **Fast Setup**: Project created in ~200ms
- **Clean Structure**: Organized, maintainable project structure
- **CLI Flags**: Skip prompts with command-line options

---

## 📦 What You Get

### React Template
- **React 19** with TypeScript
- **Vite 6** for lightning-fast development
- **Tailwind CSS 3** for styling
- **ESLint 9** for code quality
- **Framer Motion** for animations
- **Lenis** for smooth scrolling
- **React Router 7** for routing
- **Revoicons** for icons

### Next.js Template
- **Next.js 16** with App Router
- **React 19** with TypeScript
- **Tailwind CSS 4** for styling
- **ESLint 9** for code quality
- **Framer Motion** for animations
- **Lenis** for smooth scrolling
- **Revoicons** for icons

---

## � Quick Start

### Create a New Project

```bash
npx create-revo my-app
```

Then follow the prompts to select your template.

### With Template Flag (Skip Prompt)

**React Template:**
```bash
npx create-revo my-app --template react
# or
npx create-revo my-app -t react
```

**Next.js Template:**
```bash
npx create-revo my-app --template next
# or
npx create-revo my-app -t next
```

### Interactive Mode

```bash
npx create-revo
```

You'll be prompted for:
1. Project name
2. Template choice (React or Next.js)

---

## 🛠️ CLI Options

```bash
create-revo <project-name> [options]
```

### Options

| Flag | Alias | Description |
|------|-------|-------------|
| `--template <type>` | `-t` | Template type: `react` or `next` |
| `--help` | `-h` | Show help message |
| `--version` | `-v` | Show version number |

### Examples

```bash
# Interactive mode
npx create-revo

# With project name
npx create-revo my-app

# With template
npx create-revo my-app -t react

# Show help
npx create-revo --help

# Show version
npx create-revo --version
```

---

## 📁 Project Structure

### React Template
```
my-app/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── pages/
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── .gitignore
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

### Next.js Template
```
my-app/
├── public/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   └── components/
├── .gitignore
├── package.json
├── tsconfig.json
└── tailwind.config.ts
```

---

## 🏃 Development

After creating your project:

```bash
cd my-app
npm install
npm run dev
```

Your app will be running at:
- **React (Vite)**: http://localhost:7350
- **Next.js**: http://localhost:7350

---

## 📜 Available Scripts

### React Template
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Next.js Template
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

---

## 🌟 Why create-revo?

- **Fast**: Creates projects in ~200ms
- **Minimal**: No unnecessary bloat or features
- **Modern**: Latest versions of React, Next.js, and dependencies
- **Simple**: Clean, straightforward CLI
- **Flexible**: Choose your framework and package manager

---

## 🔧 Package Managers

create-revo works with all major package managers:

```bash
# npm
npx create-revo my-app

# yarn
yarn create revo my-app

# pnpm
pnpm create revo my-app

# bun
bunx create-revo my-app
```

The CLI automatically detects your package manager and shows the appropriate commands.

---

## 🙏 Credits

Built with amazing open-source tools:

- [React](https://react.dev/) - UI library
- [Next.js](https://nextjs.org/) - React framework
- [Vite](https://vitejs.dev/) - Build tool
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [Lenis](https://lenis.studiofreight.com/) - Smooth scrolling

---

## 📝 License

MIT

---

## 🌟 Feedback & Support

If you like create-revo or have suggestions, reach out on [Twitter](https://twitter.com/MaybeTarun).

Happy coding! 🚀
