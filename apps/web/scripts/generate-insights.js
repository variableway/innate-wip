#!/usr/bin/env node
/**
 * Generate insights data with embedded content for static export
 * 
 * This script reads markdown files and generates a JSON file with
 * embedded content for static site generation.
 */

const fs = require('fs')
const path = require('path')

const INSIGHTS_DIR = path.join(__dirname, '..', '..', '..', 'docs', 'insights')
const OUTPUT_FILE = path.join(__dirname, '..', 'data', 'insights.json')

// Read all markdown files from insights directory
function generateInsightsData() {
  console.log('📝 Generating insights data for static export...')
  
  const insights = []
  
  // Check if directory exists
  if (!fs.existsSync(INSIGHTS_DIR)) {
    console.error(`❌ Insights directory not found: ${INSIGHTS_DIR}`)
    process.exit(1)
  }
  
  // Get all markdown files
  const files = fs.readdirSync(INSIGHTS_DIR)
    .filter(file => file.endsWith('.md') && file !== 'README.md')
    .sort()
  
  for (const file of files) {
    const filePath = path.join(INSIGHTS_DIR, file)
    const content = fs.readFileSync(filePath, 'utf-8')
    
    // Extract title from first h1
    const titleMatch = content.match(/^#\s+(.+)$/m)
    const title = titleMatch ? titleMatch[1] : file.replace('.md', '')
    
    // Extract summary from first paragraph after title
    const lines = content.split('\n')
    let summary = ''
    let foundTitle = false
    
    for (const line of lines) {
      if (line.startsWith('# ')) {
        foundTitle = true
        continue
      }
      if (foundTitle && line.trim() && !line.startsWith('#')) {
        summary = line.trim().substring(0, 200)
        if (summary.length >= 200) summary += '...'
        break
      }
    }
    
    // Generate id from filename
    const id = file.replace('.md', '')
    
    // Determine category based on content
    let category = 'practice'
    if (content.includes('可行性分析') || content.includes('可行性')) {
      category = 'analysis'
    } else if (content.includes('指南') || content.includes('Guide')) {
      category = 'guide'
    }
    
    // Extract date from file content or use file modified date
    const dateMatch = content.match(/\*\*日期\*\*[:\s]+(\d{4}-\d{2}-\d{2})/)
    const date = dateMatch ? dateMatch[1] : new Date().toISOString().split('T')[0]
    
    insights.push({
      id,
      title,
      date,
      summary,
      category,
      content, // Embedded content for static export - this is key!
    })
    
    console.log(`  ✅ Processed: ${file} -> ${id}`)
  }
  
  const data = {
    insights,
    lastUpdated: new Date().toISOString(),
  }
  
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(data, null, 2))
  console.log(`\n✅ Generated ${insights.length} insights to data/insights.json`)
  console.log('📦 Content is now embedded for static export')
}

generateInsightsData()
