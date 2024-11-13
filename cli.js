#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const projectName = process.argv[2];

if (!projectName) {
  console.error('Please provide a project name: npx create-revo [project-name]');
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

  copyRecursive(templateDir, targetDir);

  replacePlaceholders(targetDir, { projectName });
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

function replacePlaceholders(directory, placeholderValues) {
  fs.readdirSync(directory).forEach((file) => {
    const filePath = path.join(directory, file);
    if (fs.statSync(filePath).isDirectory()) {
      replacePlaceholders(filePath, placeholderValues);
    } else {
      let content = fs.readFileSync(filePath, 'utf8');
      Object.keys(placeholderValues).forEach((key) => {
        const placeholder = `{{${key}}}`;
        content = content.replace(new RegExp(placeholder, 'g'), placeholderValues[key]);
      });
      fs.writeFileSync(filePath, content);
    }
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