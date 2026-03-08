# Browser Extension Icons

This directory should contain the extension icons in different sizes.

## Required Icon Sizes

According to the manifest.json, the extension needs:
- `icon16.png` - 16x16 pixels (small toolbar icon)
- `icon48.png` - 48x48 pixels (extension management page)
- `icon128.png` - 128x128 pixels (Chrome Web Store)

## Creating Icons

### Option 1: Using an Online Tool
1. Go to https://www.favicon-generator.org/ or similar
2. Create a simple shield logo (recommended for security extension)
3. Generate PNG files in required sizes
4. Save them as icon16.png, icon48.png, icon128.png

### Option 2: Using ImageMagick
```bash
convert icon.svg -resize 16x16 icon16.png
convert icon.svg -resize 48x48 icon48.png
convert icon.svg -resize 128x128 icon128.png
```

### Option 3: Using Python PIL
```python
from PIL import Image

img = Image.open('icon_large.png')
img.thumbnail((16, 16))
img.save('icon16.png')
# Repeat for 48 and 128
```

## Design Recommendations

For a phishing detection extension:
- **Style**: Shield with checkmark or warning symbol
- **Colors**: Blue (trust) or Red (danger)
- **Simplicity**: Should be recognizable at all sizes
- **Contrast**: Clear at 16x16 pixels

## Example Design

```
Shield (outline blue) with:
- ✓ for safe mode
- ⚠️ for alert mode
- Red glow when threat detected
```

## Icon States

Consider different visual states:
- **Normal**: Gray/blue shield (no threats)
- **Alert**: Red shield with exclamation mark
- **Badge**: Shows threat count (1-9+)

## Testing

After adding icons:
1. Reload extension in browser
2. Icons should appear in toolbar
3. Verify visibility at different zoom levels

---

Note: If icons are missing, the extension will still work but display a default icon.

To enable the icons in manifest.json, place them in this `icons/` directory.
