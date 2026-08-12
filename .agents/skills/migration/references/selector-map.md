# Selector Map

Maintain a running log mapping every migrated content element to its
source and target CSS selectors.

Location: `artifacts/source-vs-target/selector-map.json`

## Schema

```json
{
  "sourceUrl": "https://www.example.com/",
  "targetUrl": "http://localhost:3000/",
  "breakpoints": [360, 768, 1024, 1280, 1400],
  "entries": {
    "content/pages/home/_index.json blocks[\"home-hero\"]": {
      "source": ".home-hero",
      "target": ".home-hero",
      "viewport": "both",
      "notes": "eyebrow is an <img>, not text"
    }
  }
}
```

## Rules

- Append, don't overwrite. Add new entries as you inspect new elements.
- Both selectors must be precise.
- Add an entry the moment you inspect an element.
- Capture interactivity and animation in notes.
