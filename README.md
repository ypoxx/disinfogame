# 🎮 Desinformation Network

An educational strategy game that teaches players about disinformation tactics through interactive gameplay. Players take the role of an Information Operations Strategist to understand vulnerabilities in information ecosystems.

> 📌 **Kanonische Projektwahrheit:** [`docs/VISION_LOCK.md`](docs/VISION_LOCK.md). Bei Widerspruch zwischen Dokumenten gewinnt diese Datei (bzw. die Spieldaten).

## 🎯 Overview

**Desinformation Network** is a web-based **narrative strategy game** — **Story Mode**:

- **Story Mode** *(the game)*: A narrative-driven campaign following an employee at a disinformation agency, featuring moral choices, NPC relationships, and multiple endings.
- *Pro Mode — the earlier abstract network-manipulation game — is **archived** under `archive/pro-mode/` (code + backend). See [`docs/VISION_LOCK.md`](docs/VISION_LOCK.md) §6 and [`START_HERE.md`](START_HERE.md).*

### Key Features

- 58 unique actors across categories (Media, Experts, Lobby Groups, Organizations)
- 110 story-mode actions with branching consequences
- Advanced AI systems: Betrayal tracking, Crisis moments, Arms race mechanics
- Multiple ending paths based on player choices
- Real-time network visualization with force-directed graph layout
- Comprehensive save/load system

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone https://github.com/ypoxx/disinfogame.git
cd disinfogame/desinformation-network

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` to play the game.

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run typecheck    # Run TypeScript type checking
npm run lint         # Run ESLint
npm run test         # Run unit tests
npm run test:coverage # Run tests with coverage
```

## 🏗️ Project Structure

```
desinformation-network/
├── src/
│   ├── components/          # React components
│   ├── game-logic/          # Pro mode game engine
│   ├── story-mode/          # Story mode engine & systems
│   │   ├── engine/          # Core systems (Betrayal, Ending, Crisis, AI)
│   │   ├── data/            # Game content (actions, dialogues, consequences)
│   │   └── components/      # Story mode UI components
│   ├── data/game/           # Pro mode game data (actors, abilities, events)
│   ├── hooks/               # React hooks
│   ├── utils/               # Utility functions
│   └── stores/              # Zustand state management
├── docs/                    # Documentation
│   ├── story-mode/          # Story mode documentation
│   ├── DAY_ONE_WALKTHROUGH.md
│   └── DUAL_INTERFACE_VISION.md
├── .claude/                 # AI assistant context
│   ├── ARCHITECTURE.md      # Technical architecture
│   └── GAME_DESIGN.md       # Game design documentation
└── ROADMAP.md               # Development roadmap
```

## 🎮 Game Modes

### Pro Mode
A strategic simulation where you manipulate an information network using psychological tactics:
- Deploy abilities like "Framing", "Emotional Appeal", "Authority"
- Build combos for enhanced effects
- Manage limited action points (AP)
- Navigate random world events
- Achieve victory by destabilizing the network or avoid detection

### Story Mode
A narrative campaign with moral complexity:
- Make choices as a disinformation agency employee
- Build relationships with NPCs (Direktor Volkov, Marina Petrova, Alexei Petrov, Katja Orlova, Igor Smirnov)
- Face betrayal scenarios based on personal red lines
- Navigate crisis moments with lasting consequences
- Unlock 8 ending categories with multiple tones

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Build Tool**: Vite
- **Testing**: Vitest, React Testing Library
- **Deployment**: Netlify

## 📚 Documentation

- [Architecture Overview](.claude/ARCHITECTURE.md) - Technical design and patterns
- [Game Design Document](.claude/GAME_DESIGN.md) - Gameplay mechanics and systems
- [Story Mode Guide](docs/story-mode/README.md) - Story mode features and systems
- [Development Roadmap](ROADMAP.md) - Feature planning and milestones
- [Audit Report](AUDIT_REPORT_2025-12-29.md) - Current project status and priorities

## 🎯 Current Status

The game is in active development with:
- ✅ Story mode ~75% complete with 4 major engine systems implemented
- ✅ Pro mode ~80% functional (secondary mode — being archived per [`docs/VISION_LOCK.md`](docs/VISION_LOCK.md))
- ⚠️ Accessibility improvements in progress (WCAG 2.1 AA compliance)
- ⚠️ Test coverage expansion ongoing

See [AUDIT_REPORT_2025-12-29.md](AUDIT_REPORT_2025-12-29.md) for detailed status.

## 🤝 Contributing

This is an educational project. While we're not actively seeking contributions, bug reports and suggestions are welcome via GitHub issues.

## 📄 License

This project is for educational purposes. All rights reserved.

## 🎓 Educational Purpose

This game is designed to:
- Demonstrate real-world disinformation tactics
- Educate players about information manipulation
- Foster critical thinking about media consumption
- Show the ethical implications of information warfare

**Note**: The game simulates harmful tactics for educational purposes only. The goal is to build awareness and resistance to real-world manipulation.

---

**Built with ❤️ for education and awareness**
