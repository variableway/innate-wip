# Innate - Personal Website & Project Tracking

A modern personal website built with Next.js, featuring project tracking, GitHub Issues integration, and weekly progress summaries.

## What is this website?

**Innate** is a personal portfolio and project tracking platform that:

1. **Tracks GitHub Issues** - Automatically fetches and displays issues from multiple repositories
2. **Project Analysis** - Shows project documentation (AGENTS.md) and AI-generated analysis
3. **Weekly Summaries** - Generates weekly progress reports with AI evaluation
4. **Knowledge Base** - Collects tutorials and learning resources

## Data Collection

This website collects and displays the following information:

### GitHub Data
- **Issues** from GitHub repositories (title, description, status, labels)
- **Projects** metadata (name, description, repository URL)
- Data is fetched via GitHub API and stored in `apps/web/data/`

### Project Documentation
- **AGENTS.md** files from each project repository
- AI-generated analysis (features, strengths, weaknesses)

### Weekly Data
- Completed issues per week
- AI-generated evaluations and mindset analysis
- Bilingual content (Chinese & English)

## Project Structure

```
innate-websites/
├── apps/
│   └── web/                 # Main Next.js application
│       ├── app/making/      # Issues, Projects, Weekly summaries
│       ├── data/            # JSON data files
│       └── scripts/         # Data fetching scripts
├── packages/
│   ├── ui/                  # Shared UI component library
│   ├── utils/               # Shared utility functions
│   └── tsconfig/            # Shared TypeScript configs
└── package.json
```

## Website Sections

### /making
- **Issues** - Browse and filter GitHub issues from all projects
- **Projects** - View project details with AGENTS.md documentation
- **Weekly** - Weekly progress summaries with AI analysis

### Other Pages
- Tutorials, feeds, and other content collections

## Technology Stack

- **Framework:** Next.js 16 with React 19
- **Language:** TypeScript 6
- **Package Manager:** pnpm with workspaces
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI primitives
- **Icons:** Lucide React
- **Deployment:** GitHub Pages

## Available Scripts

```bash
pnpm install              # Install dependencies
pnpm dev                  # Start development server
pnpm build                # Build all packages
pnpm lint                 # Lint all packages
./run.sh web dev          # Run web app specifically
```

### Data Management

```bash
# Fetch latest issues from GitHub
cd apps/web && node scripts/fetch-issues.js

# Generate weekly summary
cd apps/web && node scripts/generate-weekly.js

# Fetch project AGENTS.md
cd apps/web && node scripts/fetch-agents.js
```

## GitHub Pages Deployment

The website is automatically deployed to GitHub Pages via GitHub Actions:

```
https://qdriven.github.io/innate-websites/
```

To enable deployment:
1. Go to repository Settings → Pages
2. Set Source to "GitHub Actions"
3. Push to main branch to trigger deployment

## License

Private project
