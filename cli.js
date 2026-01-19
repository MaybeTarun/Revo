#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import readline from "readline";
import { createRequire } from "module";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);
const { version: VERSION } = require('./package.json');

// ============================================================================
// CONSTANTS
// ============================================================================

const TEMPLATES = {
  reactjs: 'React.js + TypeScript + TailwindCSS + Vite',
  nextjs: 'Next.js + TypeScript + TailwindCSS'
};

const IGNORE_PATTERNS = ['node_modules', '.git', 'dist', 'build', '.next', '.cache'];

// ============================================================================
// UTILITIES
// ============================================================================

/**
 * Validate project name
 */
function validateProjectName(name) {
  if (!name || name.trim() === '') {
    return { valid: false, error: 'Project name cannot be empty' };
  }

  if (!/^[a-zA-Z0-9-_~]+$/.test(name)) {
    return {
      valid: false,
      error: 'Project name can only contain letters, numbers, hyphens, underscores, and tildes'
    };
  }

  return { valid: true };
}

/**
 * Sanitize project name for package.json
 */
function sanitizeProjectName(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9-_~]/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Detect package manager
 */
function detectPackageManager() {
  const userAgent = process.env.npm_config_user_agent || '';

  if (userAgent.includes('bun')) return 'bun';
  if (userAgent.includes('pnpm')) return 'pnpm';
  if (userAgent.includes('yarn')) return 'yarn';

  return 'npm';
}

/**
 * Get commands for package manager
 */
function getCommands(pm) {
  const commands = {
    npm: { install: 'npm install', dev: 'npm run dev' },
    yarn: { install: 'yarn', dev: 'yarn dev' },
    pnpm: { install: 'pnpm install', dev: 'pnpm dev' },
    bun: { install: 'bun install', dev: 'bun dev' }
  };
  return commands[pm] || commands.npm;
}

// ============================================================================
// PROMPTS
// ============================================================================

/**
 * Ask for project name
 */
function askProjectName() {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const ask = () => {
      rl.question('Project name: ', (answer) => {
        const name = answer.trim();
        const validation = validateProjectName(name);

        if (!validation.valid) {
          console.log(`Error: ${validation.error}`);
          ask();
        } else {
          rl.close();
          resolve(name);
        }
      });
    };

    ask();
  });
}

/**
 * Ask for template choice
 */
function askTemplateChoice() {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    console.log('\nSelect template:');
    console.log('1. React.js + TypeScript + TailwindCSS + Vite');
    console.log('2. Next.js + TypeScript + TailwindCSS');

    const ask = () => {
      rl.question('\nChoice (1 or 2): ', (answer) => {
        const choice = answer.trim().toLowerCase();

        if (choice === '1' || choice === 'react' || choice === 'reactjs') {
          rl.close();
          resolve('reactjs');
        } else if (choice === '2' || choice === 'next' || choice === 'nextjs') {
          rl.close();
          resolve('nextjs');
        } else {
          console.log('Invalid choice. Please enter 1 or 2.');
          ask();
        }
      });
    };

    ask();
  });
}

// ============================================================================
// FILE OPERATIONS
// ============================================================================

/**
 * Copy files recursively
 */
function copyRecursive(source, target) {
  if (fs.statSync(source).isDirectory()) {
    fs.mkdirSync(target, { recursive: true });
    const files = fs.readdirSync(source);

    for (const file of files) {
      if (IGNORE_PATTERNS.includes(file)) continue;

      const sourcePath = path.join(source, file);
      const targetPath = path.join(target, file);
      copyRecursive(sourcePath, targetPath);
    }
  } else {
    fs.copyFileSync(source, target);
  }
}

/**
 * Replace placeholders in files
 */
function replacePlaceholders(directory, projectName) {
  const sanitized = sanitizeProjectName(projectName);
  const files = fs.readdirSync(directory);

  for (const file of files) {
    const filePath = path.join(directory, file);

    if (IGNORE_PATTERNS.includes(file)) continue;

    if (fs.statSync(filePath).isDirectory()) {
      replacePlaceholders(filePath, projectName);
    } else if (file.endsWith('.json') || file.endsWith('.html') ||
      file.endsWith('.tsx') || file.endsWith('.ts') ||
      file.endsWith('.jsx') || file.endsWith('.js') ||
      file.endsWith('.md')) {

      let content = fs.readFileSync(filePath, "utf8");

      if (file === "package.json") {
        try {
          const json = JSON.parse(content);
          json.name = sanitized;
          content = JSON.stringify(json, null, 2);
        } catch (e) {
          content = content.replace(/\{\{projectName\}\}/g, sanitized);
        }
      } else {
        content = content.replace(/\{\{projectName\}\}/g, projectName);
      }

      fs.writeFileSync(filePath, content);
    }
  }
}

/**
 * Create .gitignore
 */
function createGitignore(projectDir) {
  const content = `# dependencies
/node_modules
/.pnp
.pnp.*
.yarn/*
!.yarn/patches
!.yarn/plugins
!.yarn/releases
!.yarn/versions

# testing
/coverage

# next.js
/.next/
/out/

# production
/build
/dist

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*
bun-debug.log*

# env files
.env*

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
`;

  fs.writeFileSync(path.join(projectDir, '.gitignore'), content);
}

// ============================================================================
// CLI ARGS
// ============================================================================

/**
 * Parse CLI arguments
 */
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    projectName: null,
    template: null,
    help: false,
    version: false
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '-h' || arg === '--help') {
      options.help = true;
    } else if (arg === '-v' || arg === '--version') {
      options.version = true;
    } else if (arg === '-t' || arg === '--template') {
      options.template = args[++i];
    } else if (!arg.startsWith('-') && !options.projectName) {
      options.projectName = arg;
    }
  }

  return options;
}

/**
 * Show help
 */
function showHelp() {
  console.log('\nUsage: create-revo <project-name> [options]');
  console.log('\nOptions:');
  console.log('  -t, --template <type>    Template type (react or next)');
  console.log('  -h, --help               Show help');
  console.log('  -v, --version            Show version');
  console.log('\nExamples:');
  console.log('  create-revo my-app');
  console.log('  create-revo my-app --template react');
  console.log('  create-revo my-app -t next\n');
}

// ============================================================================
// MAIN
// ============================================================================

async function main() {
  const options = parseArgs();

  if (options.help) {
    showHelp();
    process.exit(0);
  }

  if (options.version) {
    console.log(VERSION);
    process.exit(0);
  }

  try {
    // Get project name
    let projectName = options.projectName;
    if (!projectName) {
      projectName = await askProjectName();
    } else {
      const validation = validateProjectName(projectName);
      if (!validation.valid) {
        console.log(`Error: ${validation.error}`);
        process.exit(1);
      }
    }

    // Check if directory exists
    const targetDir = path.join(process.cwd(), projectName);
    if (fs.existsSync(targetDir)) {
      console.log(`Error: Directory '${projectName}' already exists`);
      process.exit(1);
    }

    // Get template
    let template = options.template;
    if (template) {
      if (template === 'react' || template === '1') template = 'reactjs';
      else if (template === 'next' || template === '2') template = 'nextjs';

      if (!TEMPLATES[template]) {
        console.log(`Error: Invalid template '${options.template}'`);
        console.log('Valid templates: react, next');
        process.exit(1);
      }
    } else {
      template = await askTemplateChoice();
    }

    // Create project
    const templateDir = path.join(__dirname, `template-${template}`);

    if (!fs.existsSync(templateDir)) {
      console.log(`Error: Template directory not found`);
      process.exit(1);
    }

    console.log(`\nCreating project...`);

    const start = Date.now();

    // Copy files
    fs.mkdirSync(targetDir, { recursive: true });
    copyRecursive(templateDir, targetDir);

    // Configure
    replacePlaceholders(targetDir, projectName);
    createGitignore(targetDir);

    const duration = Date.now() - start;

    // Done
    const pm = detectPackageManager();
    const cmds = getCommands(pm);

    console.log(`\nDone in ${duration}ms\n`);
    console.log('Next steps:');
    console.log(`  cd ${projectName}`);
    console.log(`  ${cmds.install}`);
    console.log(`  ${cmds.dev}\n`);

  } catch (error) {
    console.log(`\nError: ${error.message}\n`);
    process.exit(1);
  }
}

main();
