# Desinformation Network Game

An educational strategy game that simulates the spread of disinformation through a network of societal actors (media, experts, lobby groups, and organizations). Players learn about persuasion techniques while managing trust levels across the network.

## 🎮 Game Concept

- **Democracy-style complexity** - System-level strategy, not character POV
- **Educational focus** - Learn about real persuasion techniques through gameplay
- **Emergent complexity** - Feedback loops, unintended consequences, defensive mechanisms
- **Actor-centric design** - Each actor has specific abilities based on their role

**Objective:** Reduce 75% of actors' trust below 40% within 32 rounds (8 years)

## 🛠️ Tech Stack

- **Frontend:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS
- **State:** Zustand
- **Backend:** Netlify Functions (Serverless)
- **Database:** Upstash Redis + Neon Postgres
- **Deployment:** Netlify (Continuous Deployment via GitHub)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/desinformation-network.git
cd desinformation-network

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Available Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run typecheck  # Run TypeScript type checking
npm run lint       # Run ESLint
```

### Local Development with Netlify Functions

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Run local dev server with functions
netlify dev
```

## 📁 Project Structure

```
desinformation-network/
├── .claude/                 # Documentation for Claude Code
│   ├── CLAUDE.md           # Master documentation
│   ├── ARCHITECTURE.md     # Technical details
│   ├── GAME_DESIGN.md      # Mechanics & balance
│   ├── PERSUASION_INTEGRATION.md
│   ├── BACKEND_API.md
│   └── VISUAL_STYLE_GUIDE.md
│
├── netlify/
│   └── functions/          # Netlify serverless functions
│       ├── seed-create.ts
│       ├── seed-get.ts
│       ├── analytics-record.ts
│       └── leaderboard.ts
│
├── src/
│   ├── components/         # React UI components
│   ├── game-logic/         # Pure TypeScript (no React!)
│   ├── hooks/              # React hooks
│   ├── services/           # API communication
│   ├── stores/             # Zustand stores
│   ├── utils/              # Helper functions
│   └── data/               # JSON data files
│       ├── persuasion/     # Scientific taxonomy
│       └── game/           # Game definitions
│
├── public/                 # Static assets
├── netlify.toml           # Netlify configuration
└── package.json
```

## 🎯 Development Roadmap

### Phase 1: Must-Have (v1.0) - Week 1-2

Core gameplay mechanics:
- [ ] Network visualization (Canvas with 6-8 actors)
- [ ] Actor-specific abilities (8 core abilities)
- [ ] Trust propagation system
- [ ] Resource management
- [ ] Win/loss conditions
- [ ] Basic UI (Actor panel, status display, controls)
- [ ] Touch optimization for iPad
- [ ] Seed system for replay

### Phase 2: Should-Have (v1.1) - Week 3-4

Enhanced features:
- [ ] Event system (random & conditional)
- [ ] Difficulty scaling (diminishing returns + defensive spawns)
- [ ] Expanded abilities (16 total)
- [ ] Detailed statistics & history
- [ ] Tutorial system

### Phase 3: Excitement (v2.0) - Week 5+

Advanced features:
- [ ] Persuasion encyclopedia (all 27+ techniques)
- [ ] "Against Manipulation" mode (play as defender)
- [ ] Leaderboard
- [ ] Multiple scenarios
- [ ] Educational summaries
- [ ] Analytics dashboard

## 🧠 Persuasion Taxonomy

The game is based on a scientific taxonomy of 27+ persuasion techniques from `src/data/persuasion/taxonomy.json`:

- **Psychological:** framing, priming, anchoring, social proof, scarcity, reciprocity, authority, liking, consistency, reactance theory, illusory truth effect
- **Rhetorical:** ad hominem, false dichotomy, straw man, equivocation, emotional appeal, repetition, narrative persuasion
- **Neurolinguistic:** pacing and leading, embedded commands
- **Digital:** microtargeting, digital influence, dark patterns, AI persuasion
- **Visual:** visual manipulation, synthetic media
- **Behavioral Economics:** nudging

Each technique includes:
- Description & long description
- Real-world examples
- Manipulation potential score
- Empirical evidence
- Counter-strategies

## 🎨 Design System

**Style:** Infographic aesthetic (clean, modern, data-visualization)

**Key Principles:**
- Clarity - Information is easy to parse
- Minimalism - Remove visual noise
- Hierarchy - Clear visual priorities
- Data-First - Graphics serve information
- Accessibility - WCAG AA compliant

**Colors:**
- Trust scale: Red (low) → Yellow → Green (high)
- Actor categories: Blue (media), Purple (expert), Pink (lobby), Teal (organization)

## 📚 Documentation

All documentation is in the `.claude/` directory:

- **[CLAUDE.md](.claude/CLAUDE.md)** - Start here! Master documentation for the project
- **[ARCHITECTURE.md](.claude/ARCHITECTURE.md)** - Technical architecture deep-dive
- **[GAME_DESIGN.md](.claude/GAME_DESIGN.md)** - Game mechanics, balance, formulas
- **[PERSUASION_INTEGRATION.md](.claude/PERSUASION_INTEGRATION.md)** - How taxonomy maps to game
- **[BACKEND_API.md](.claude/BACKEND_API.md)** - API documentation
- **[VISUAL_STYLE_GUIDE.md](.claude/VISUAL_STYLE_GUIDE.md)** - Design system

## 🚢 Deployment

### Netlify Setup

1. Connect GitHub repository to Netlify
2. Configure environment variables:
   ```
   UPSTASH_REDIS_URL=...
   UPSTASH_REDIS_TOKEN=...
   DATABASE_URL=...  (Neon Postgres)
   ```
3. Deploy automatically on push to `main`

### Manual Deployment

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Login to Netlify
netlify login

# Deploy preview
netlify deploy

# Deploy to production
netlify deploy --prod
```

## 🤝 Contributing

1. Read `.claude/CLAUDE.md` for project overview
2. Follow TypeScript strict mode guidelines
3. Use conventional commits: `feat:`, `fix:`, `docs:`, etc.
4. Test thoroughly before committing
5. Update documentation when changing architecture

## 📄 License

[Add license here]

## 🙏 Acknowledgments

- Persuasion taxonomy based on scientific research (version9.json)
- Inspired by Democracy game series
- Design inspiration from Our World in Data, Observable, Notion

---

**Built with Claude Code & Netlify** 🚀
