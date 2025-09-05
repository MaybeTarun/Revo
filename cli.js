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

function updateProgress(percentage, message) {
  const barLength = 20;
  const filledLength = Math.round((percentage / 100) * barLength);
  const bar = '█'.repeat(filledLength) + '░'.repeat(barLength - filledLength);
  
  // Clear the current line and move cursor to beginning
  process.stdout.write('\r\x1b[K');
  process.stdout.write(`[${bar}] ${percentage}% - ${message}`);
  
  if (percentage === 100) {
    process.stdout.write('\n');
  }
}

function copyTemplateFiles(templateType, projectName, targetDir) {
  const templateDir = path.join(__dirname, `template-${templateType}`);

  // Check if template directory exists
  if (!fs.existsSync(templateDir)) {
    console.error(`Template directory 'template-${templateType}' not found!`);
    process.exit(1);
  }

  console.log("\nSetting up project...");
  
  // Step 1: Create directory
  updateProgress(10, "Creating project directory...");
  fs.mkdirSync(targetDir, { recursive: true });

  // Step 2: Copy template files
  updateProgress(30, "Copying template files...");
  copyRecursive(templateDir, targetDir);

  // Step 3: Replace placeholders
  updateProgress(60, "Configuring project files...");
  replacePlaceholdersInDirectory(targetDir, { projectName });
  
  // Step 4: Create .gitignore file
  updateProgress(80, "Creating .gitignore file...");
  createGitignoreFile(targetDir);

  // Step 5: Finalizing
  updateProgress(100, "Project setup complete!");
  console.log(""); // New line after progress
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
        // Skip node_modules and other system directories
        if (file === 'node_modules' || file === '.git' || file === 'dist' || file === 'build' || file === '.next') {
          continue;
        }
        
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
      
      // Skip node_modules and other system directories
      if (file === 'node_modules' || file === '.git' || file === 'dist' || file === 'build' || file === '.next') {
        continue;
      }
      
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
    
    console.log("\nNext steps:");
    console.log("1. Run: npm install");
    console.log("2. Run: npm run dev");
  } catch (error) {
    console.error("Error creating project:", error.message);
    process.exit(1);
  }
}

main();
