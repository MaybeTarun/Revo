#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectName = process.argv[2];

if (!projectName) {
  console.error("Please provide a project name: npx create-revo [project-name]");
  process.exit(1);
}

const targetDir = path.join(process.cwd(), projectName);

function replacePlaceholders(content, placeholderValues) {
  Object.keys(placeholderValues).forEach((key) => {
    const placeholder = `{{${key}}}`;
    content = content.replace(new RegExp(placeholder, "g"), placeholderValues[key]);
  });
  return content;
}

function copyTemplateFiles() {
  const templateDir = path.join(__dirname, "template");

  fs.mkdirSync(targetDir, { recursive: true });

  copyRecursive(templateDir, targetDir);

  replacePlaceholdersInDirectory(targetDir, { projectName });
}

function copyRecursive(source, target) {
  if (fs.statSync(source).isDirectory()) {
    fs.mkdirSync(target, { recursive: true });
    fs.readdirSync(source).forEach((file) => {
      copyRecursive(path.join(source, file), path.join(target, file));
    });
  } else {
    fs.copyFileSync(source, target);
  }
}

function sanitizeProjectName(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9-_~]/g, '-')
    .replace(/^-+|-+$/g, '');
}

function replacePlaceholdersInDirectory(directory, placeholderValues) {

  const sanitizedProjectName = sanitizeProjectName(placeholderValues.projectName);

  fs.readdirSync(directory).forEach((file) => {
    const filePath = path.join(directory, file);
    if (fs.statSync(filePath).isDirectory()) {
      replacePlaceholdersInDirectory(filePath, placeholderValues);
    } else {
      let content = fs.readFileSync(filePath, "utf8");

      if (file === "package.json" || file === "package-lock.json") {
        const jsonContent = JSON.parse(content);
        jsonContent.name = sanitizedProjectName;
        content = JSON.stringify(jsonContent, null, 2); 
      } else {
        Object.keys(placeholderValues).forEach((key) => {
          const placeholder = `{{${key}}}`;
          content = content.replace(new RegExp(placeholder, "g"), placeholderValues[key]);
        });
      }

      fs.writeFileSync(filePath, content);
    }
  });
}

try {
  console.log("Setting up project...");
  copyTemplateFiles();
  console.log(`Project created at ${targetDir}`);
  process.chdir(targetDir);
  console.log("Project setup complete!");
  console.log("Run npm install and you are set.");
} catch (error) {
  console.error("Error creating project:", error);
  process.exit(1);
}
