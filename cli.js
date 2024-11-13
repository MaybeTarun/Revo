#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const projectName = process.argv[2];

if (!projectName) {
  console.error('Please provide a project name: npx create-project [project-name]');
  process.exit(1);
}

const targetDir = path.join(process.cwd(), projectName);

function replacePlaceholders(content, placeholderValues) {
  Object.keys(placeholderValues).forEach((key) => {
    const placeholder = `{{${key}}}`;
    content = content.replace(new RegExp(placeholder, 'g'), placeholderValues[key]);
  });
  return content;
}

function copyTemplateFiles() {
  const templateDir = path.join(__dirname, 'template');

  fs.mkdirSync(targetDir, { recursive: true });
  fs.readdirSync(templateDir).forEach((file) => {
    const origFilePath = path.join(templateDir, file);
    const targetFilePath = path.join(targetDir, file);

    let content = fs.readFileSync(origFilePath, 'utf8');
    content = replacePlaceholders(content, { projectName });
    fs.writeFileSync(targetFilePath, content);
  });
}

try {
  copyTemplateFiles();
  console.log(`Project created at ${targetDir}`);

  process.chdir(targetDir);
  execSync('npm install');
  execSync('git init');
  console.log('Project setup complete!');
  
} catch (error) {
  console.error('Error creating project:', error);
  process.exit(1);
}
