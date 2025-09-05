#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import readline from "readline";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectName = process.argv[2];

function askProjectName() {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question('Enter project name: ', (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

function askTemplateChoice() {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    console.log('\nChoose your template:');
    console.log('1. React.js + Typescript + TailwindCSS + Vite');
    console.log('2. Next.js + Typescript + TailwindCSS');

    const askQuestion = () => {
      rl.question('Enter your choice (1 or 2): ', (answer) => {
        const choice = answer.trim().toLowerCase();
        
        if (choice === '1' || choice === 'react' || choice === 'reactjs') {
          rl.close();
          resolve('reactjs');
        } else if (choice === '2' || choice === 'next' || choice === 'nextjs') {
          rl.close();
          resolve('nextjs');
        } else {
          console.log('Invalid choice. Please enter 1 or 2.');
          askQuestion();
        }
      });
    };

    askQuestion();
  });
}

function replacePlaceholders(content, placeholderValues) {
  Object.keys(placeholderValues).forEach((key) => {
    const placeholder = `{{${key}}}`;
    content = content.replace(new RegExp(placeholder, "g"), placeholderValues[key]);
  });
  return content;
}

function copyTemplateFiles(templateType, projectName, targetDir) {
  const templateDir = path.join(__dirname, `template-${templateType}`);

  // Check if template directory exists
  if (!fs.existsSync(templateDir)) {
    console.error(`Template directory 'template-${templateType}' not found!`);
    process.exit(1);
  }

  fs.mkdirSync(targetDir, { recursive: true });

  copyRecursive(templateDir, targetDir);

  replacePlaceholdersInDirectory(targetDir, { projectName });
  
  // Create .gitignore file
  createGitignoreFile(targetDir);
}

function createGitignoreFile(projectDir) {
  const gitignoreContent = `# dependencies
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

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*

# env files (can opt-in for committing if needed)
.env*

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
`;

  try {
    const gitignorePath = path.join(projectDir, '.gitignore');
    fs.writeFileSync(gitignorePath, gitignoreContent);
  } catch (error) {
    //
  }
}

function copyRecursive(source, target) {
  try {
    if (fs.statSync(source).isDirectory()) {
      fs.mkdirSync(target, { recursive: true });
      const files = fs.readdirSync(source);
      
      for (const file of files) {
        const sourcePath = path.join(source, file);
        const targetPath = path.join(target, file);
        copyRecursive(sourcePath, targetPath);
      }
    } else {
      fs.copyFileSync(source, target);
    }
  } catch (error) {
    console.error(`Error copying ${source} to ${target}:`, error.message);
    throw error;
  }
}

function sanitizeProjectName(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9-_~]/g, '-')
    .replace(/^-+|-+$/g, '');
}

function replacePlaceholdersInDirectory(directory, placeholderValues) {
  try {
    const sanitizedProjectName = sanitizeProjectName(placeholderValues.projectName);
    const files = fs.readdirSync(directory);

    for (const file of files) {
      const filePath = path.join(directory, file);
      
      if (fs.statSync(filePath).isDirectory()) {
        replacePlaceholdersInDirectory(filePath, placeholderValues);
      } else {
        let content = fs.readFileSync(filePath, "utf8");

        if (file === "package.json" || file === "package-lock.json") {
          try {
            const jsonContent = JSON.parse(content);
            jsonContent.name = sanitizedProjectName;
            
            // Update all dependencies to latest versions
            if (jsonContent.dependencies) {
              Object.keys(jsonContent.dependencies).forEach(dep => {
                jsonContent.dependencies[dep] = "latest";
              });
            }
            if (jsonContent.devDependencies) {
              Object.keys(jsonContent.devDependencies).forEach(dep => {
                jsonContent.devDependencies[dep] = "latest";
              });
            }
            
            content = JSON.stringify(jsonContent, null, 2);
          } catch (jsonError) {
            console.warn(`Warning: Could not parse JSON in ${filePath}:`, jsonError.message);
            // Fallback to string replacement
            content = content.replace(/\{\{projectName\}\}/g, sanitizedProjectName);
          }
        } else if (file === "index.html" || file.endsWith(".html")) {
          // Replace project name in HTML title and meta tags
          content = content.replace(/\{\{projectName\}\}/g, placeholderValues.projectName);
          // Also replace common placeholders like "Revo" with project name
          content = content.replace(/Revo/g, placeholderValues.projectName);
        } else if (file.endsWith(".tsx") || file.endsWith(".ts") || file.endsWith(".jsx") || file.endsWith(".js")) {
          // Replace project name in React/Next.js files
          content = content.replace(/\{\{projectName\}\}/g, placeholderValues.projectName);
          // Replace common placeholders
          content = content.replace(/Create Next App/g, placeholderValues.projectName);
          content = content.replace(/Generated by create next app/g, `Generated by ${placeholderValues.projectName}`);
        } else {
          // Use the optimized replacePlaceholders function for other files
          content = replacePlaceholders(content, placeholderValues);
        }

        fs.writeFileSync(filePath, content);
      }
    }
  } catch (error) {
    console.error(`Error processing directory ${directory}:`, error.message);
    throw error;
  }
}

async function main() {
  try {
    let finalProjectName = projectName;
    
    // If no project name provided, ask for it
    if (!finalProjectName) {
      finalProjectName = await askProjectName();
    }
    
    // Validate project name
    if (!/^[a-zA-Z0-9-_~]+$/.test(finalProjectName)) {
      console.error("Project name can only contain letters, numbers, hyphens, underscores, and tildes");
      process.exit(1);
    }
    
    const finalTargetDir = path.join(process.cwd(), finalProjectName);
    
    // Check if target directory already exists
    if (fs.existsSync(finalTargetDir)) {
      console.error(`Directory '${finalProjectName}' already exists! Please choose a different name.`);
      process.exit(1);
    }
    
    // Ask user to choose template
    const templateType = await askTemplateChoice();
    
    copyTemplateFiles(templateType, finalProjectName, finalTargetDir);
    
    console.log(`Project created successfully at ${finalTargetDir}`);
    process.chdir(finalTargetDir);
    
    console.log("\nProject setup complete!");
    console.log("\nNext steps:");
    console.log("1. Run: npm install");
    console.log("2. Run: npm run dev");
  } catch (error) {
    console.error("Error creating project:", error.message);
    process.exit(1);
  }
}

main();
