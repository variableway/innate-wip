#!/usr/bin/env node
/**
 * AGENTS.md Fetcher Script
 * 
 * Fetches AGENTS.md files from all repositories in the organization.
 * Saves them locally for static site generation.
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');
const PROJECTS_DIR = path.join(DATA_DIR, 'projects');
const REPOS_FILE = path.join(DATA_DIR, 'repos.json');
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_ORG = process.env.GITHUB_ORG || 'variableway';

// Ensure directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(PROJECTS_DIR)) {
  fs.mkdirSync(PROJECTS_DIR, { recursive: true });
}

// GitHub API helper
async function githubFetch(url) {
  const headers = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'innate-agents-fetcher',
  };
  
  if (GITHUB_TOKEN) {
    headers['Authorization'] = `token ${GITHUB_TOKEN}`;
  }

  const response = await fetch(url, { headers });
  
  if (!response.ok) {
    if (response.status === 404) {
      return null; // File not found
    }
    const body = await response.text().catch(() => '');
    let detail = '';
    try {
      const json = JSON.parse(body);
      detail = json.message || '';
    } catch {}
    throw new Error(`GitHub API error: ${response.status} ${response.statusText}${detail ? ' - ' + detail : ''}`);
  }
  
  return response.json();
}

// Fetch file content from GitHub
async function fetchFileContent(org, repo, path) {
  const url = `https://api.github.com/repos/${org}/${repo}/contents/${path}`;
  const data = await githubFetch(url);
  
  if (!data || !data.content) {
    return null;
  }
  
  // Decode base64 content
  const content = Buffer.from(data.content, 'base64').toString('utf-8');
  return content;
}

// Load projects from repos.json
function loadProjects() {
  try {
    if (fs.existsSync(REPOS_FILE)) {
      const data = JSON.parse(fs.readFileSync(REPOS_FILE, 'utf-8'));
      return data.projects || [];
    }
  } catch (e) {
    console.error('Error loading projects:', e.message);
  }
  return [];
}

// Parse AGENTS.md content to extract structured information
function parseAgentsContent(content, projectName) {
  const lines = content.split('\n');
  
  let summary = '';
  let features = [];
  let strengths = [];
  let weaknesses = [];
  
  let currentSection = null;
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    // Detect sections
    if (trimmed.match(/^#{1,2}\s*(项目|Project|简介|Overview|介绍)/i)) {
      currentSection = 'summary';
      continue;
    }
    if (trimmed.match(/^#{1,2}\s*(功能|Features|功能特性|功能列表)/i)) {
      currentSection = 'features';
      continue;
    }
    if (trimmed.match(/^#{1,2}\s*(优势|Strengths|优点|Strength)/i)) {
      currentSection = 'strengths';
      continue;
    }
    if (trimmed.match(/^#{1,2}\s*(缺点|劣势|Weaknesses|改进|Improvements)/i)) {
      currentSection = 'weaknesses';
      continue;
    }
    
    // Skip empty lines and headers
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }
    
    // Extract content based on section
    if (currentSection === 'summary' && !summary) {
      summary = trimmed;
    } else if (currentSection === 'features' && trimmed.startsWith('-')) {
      features.push(trimmed.replace(/^-\s*/, ''));
    } else if (currentSection === 'strengths' && trimmed.startsWith('-')) {
      strengths.push(trimmed.replace(/^-\s*/, ''));
    } else if (currentSection === 'weaknesses' && trimmed.startsWith('-')) {
      weaknesses.push(trimmed.replace(/^-\s*/, ''));
    }
  }
  
  // If no structured data found, extract first paragraph as summary
  if (!summary) {
    const firstPara = lines.find(l => l.trim() && !l.startsWith('#'));
    if (firstPara) {
      summary = firstPara.trim();
    }
  }
  
  return {
    summary: summary || `${projectName} project`,
    features: features.slice(0, 5),
    strengths: strengths.slice(0, 3),
    weaknesses: weaknesses.slice(0, 3),
    rawContent: content
  };
}

// Main function
async function main() {
  console.log(`🚀 Fetching AGENTS.md files from ${GITHUB_ORG}...`);

  try {
    const projects = loadProjects();
    console.log(`📦 Found ${projects.length} projects`);

    const projectData = [];
    
    for (const project of projects) {
      const { id, name, description, repoUrl } = project;
      console.log(`🔍 Checking ${name}...`);
      
      try {
        // Try different possible file names
        const possiblePaths = [
          'AGENTS.md',
          'agents.md',
          'AGENT.md',
          'agent.md',
          'docs/AGENTS.md',
          '.github/AGENTS.md'
        ];
        
        let content = null;
        let foundPath = null;
        
        for (const filePath of possiblePaths) {
          content = await fetchFileContent(GITHUB_ORG, id, filePath);
          if (content) {
            foundPath = filePath;
            break;
          }
        }
        
        if (content) {
          console.log(`  ✅ Found AGENTS.md at ${foundPath}`);
          
          // Parse content
          const parsed = parseAgentsContent(content, name);
          
          // Save raw file
          const fileName = `${id}.md`;
          fs.writeFileSync(path.join(PROJECTS_DIR, fileName), content);
          
          projectData.push({
            id,
            name,
            description,
            repoUrl,
            hasAgents: true,
            agentsPath: foundPath,
            ...parsed
          });
        } else {
          console.log(`  ⚠️  No AGENTS.md found`);
          projectData.push({
            id,
            name,
            description,
            repoUrl,
            hasAgents: false,
            summary: description || `${name} project`,
            features: [],
            strengths: [],
            weaknesses: []
          });
        }
      } catch (error) {
        console.error(`  ❌ Error fetching ${name}:`, error.message);
        projectData.push({
          id,
          name,
          description,
          repoUrl,
          hasAgents: false,
          error: error.message
        });
      }
    }
    
    // Save projects data
    const output = {
      projects: projectData,
      lastUpdated: new Date().toISOString()
    };
    
    fs.writeFileSync(
      path.join(DATA_DIR, 'projects.json'),
      JSON.stringify(output, null, 2)
    );
    
    console.log(`\n✅ Fetched AGENTS.md for ${projectData.filter(p => p.hasAgents).length}/${projects.length} projects`);
    console.log('📁 Data saved to data/projects.json');
    console.log('📁 Raw files saved to data/projects/');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
