# Story Mode - Hybrid AI Background Implementation

## Overview

The Story Mode uses a **hybrid approach** combining AI-generated artwork with interactive clickable areas. This provides professional visuals while maintaining simple, maintainable code.

## How It Works

### Architecture
```
AI Background Image (static)
    └─> Transparent Clickable Areas (interactive)
        └─> Existing Modal System (content)
```

**Benefits:**
- ✅ Professional appearance with AI artwork
- ✅ Easy to implement (no 3D rendering needed)
- ✅ Performant (single background image)
- ✅ Fully interactive (all elements clickable)
- ✅ Easy to maintain and iterate

## Setup Instructions

### 1. Generate the AI Image

Use Google Imagen or similar AI image generator with this prompt:

```
Isometric brutalist office interior desk scene, top-down 45-degree angle perspective.
Soviet Cold War intelligence agency aesthetic. Concrete gray walls with dark shadows.
On desk surface: modern flatscreen computer monitor showing blue interface with red
notification badge, black office telephone on left side, modern smartphone on right
side. Wall-mounted TV screen displaying bar charts in cyan and red. Military
olive-green door visible on side wall. Desk made of dark industrial concrete.
Color palette: Soviet red (#C41E3A), concrete grays (#3D3D3D, #5A5A5A), CIA agency
blue (#003366), military olive green (#4A5D23), warning gold accents. Harsh lighting,
thick geometric borders, brutalist architecture style, no soft gradients, sharp
shadows. Minimalist, utilitarian, authoritarian atmosphere. High contrast, matte
surfaces, institutional government office. Pixel-perfect clarity, geometric precision.
```

### 2. Add the Image to Your Project

1. Save your AI-generated image as: **`office-brutalist-scene.jpg`**
2. Place it in: **`/desinformation-network/public/`**
3. Path should be: `/desinformation-network/public/office-brutalist-scene.jpg`

### 3. Verify It Works

1. Start the dev server: `npm run dev`
2. Click "📖 Story Mode Test" from the main menu
3. You should see your AI image with interactive areas

**If image doesn't load:**
- You'll see a placeholder message with instructions
- Clickable areas still work!
- Check the image path and filename

## Interactive Elements

### Clickable Areas (with hover effects):

1. **📺 TV Screen** (top left)
   - Shows campaign analytics
   - Blue glow on hover
   - Click → Campaign dashboard placeholder

2. **💻 Computer Monitor** (center)
   - Email system with notification badge (pulsing red "1")
   - Red glow on hover
   - Click → Email inbox placeholder

3. **☎️ Telephone** (left side)
   - Call NPCs (Volkov, Chen, Kessler)
   - Gold glow on hover
   - Click → Speed dial menu

4. **📱 Smartphone** (right side)
   - Live news feed
   - Red glow on hover
   - Click → Breaking news ticker

5. **🚪 Door** (right side)
   - Event NPC entrance
   - Olive-green glow on hover
   - Click → Event system explanation

6. **📕 Soviet Folder** (on desk)
   - Mission briefing
   - Red glow on hover
   - Click → Classified dossier

### Visual Feedback:

- **Hover**: Colored glow around element + label tooltip
- **Click**: Opens modal with detailed placeholder content
- **Badge**: Email notification pulses on computer monitor

## Customization

### Adjusting Clickable Area Positions

If your AI image has elements in different positions, edit `OfficeScreen.tsx`:

```typescript
// Example: Computer Monitor position
style={{
  top: '38%',    // Adjust vertical position
  left: '35%',   // Adjust horizontal position
  width: '30%',  // Adjust width
  height: '32%', // Adjust height
}}
```

Use percentage-based positioning for responsive design.

### Changing Hover Colors

Edit the hover effects in `OfficeScreen.tsx`:

```typescript
backgroundColor: hoverArea === 'computer'
  ? 'rgba(196, 30, 58, 0.3)'  // Soviet Red with 30% opacity
  : 'transparent'
```

Colors are defined in `theme.ts`.

## Color Scheme

See `theme.ts` for the full brutalist color palette:

- **Soviet Red**: `#C41E3A` - Urgency, important actions
- **Concrete Gray**: `#3D3D3D, #5A5A5A` - Background, surfaces
- **Agency Blue**: `#003366` - Intelligence, secure systems
- **Military Olive**: `#4A5D23` - Security, events
- **Warning Gold**: `#D4A017` - Resources, alerts

## File Structure

```
/src/story-mode/
├── StoryModeTest.tsx    # Container component
├── OfficeScreen.tsx     # Main hybrid implementation ⭐
├── theme.ts             # Brutalist color scheme
└── README.md            # This file
```

## Next Steps (Future Development)

When ready to build the full Story Mode:

1. **Replace placeholders** with real game logic
2. **Connect to game engine** (same engine as Pro Mode)
3. **Implement AP system** (action points)
4. **Add real email/event system**
5. **Build NPC dialogue trees**
6. **Create day transition animations**
7. **Add actual sound effects** (currently console.log placeholders)

## Troubleshooting

**Q: Image not showing?**
- Check path: `/public/office-brutalist-scene.jpg`
- Check filename spelling
- Try hard refresh (Ctrl+F5)

**Q: Clickable areas misaligned?**
- AI image dimensions may differ
- Adjust percentages in `OfficeScreen.tsx`
- Use browser DevTools to inspect element positions

**Q: Want to use a different image?**
- Change `backgroundImage` path in `OfficeScreen.tsx` line 92
- Or keep same filename and replace the file

## Development Tips

- **DevTools**: Use browser inspect to see clickable area boundaries
- **Hover debugging**: Areas show colored overlays on hover
- **Sound placeholder**: Check console for `🔊 [SOUND: ...]` messages
- **Modal testing**: All areas open detailed placeholders when clicked

---

**Developed with Brutalist/Soviet/Intelligence Agency aesthetic** 🏛️🔴🔵
