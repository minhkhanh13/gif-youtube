<p align="center">
  <img src="icons/icon-128.png" width="96" height="96" alt="MemeTube icon">
</p>

<h1 align="center">MemeTube</h1>

<p align="center">
  <strong>Post Tenor GIFs, ASCII art, and Kaomoji in YouTube comments from desktop browsers.</strong>
</p>

<p align="center">
  <a href="https://github.com/minhkhanh13/gif-youtube/releases/latest"><img src="https://img.shields.io/github/v/release/minhkhanh13/gif-youtube?color=ff0033&label=version" alt="Latest Version"></a>
  <img src="https://img.shields.io/badge/Chrome-110%2B-4285F4?logo=googlechrome&logoColor=white" alt="Chrome 110+">
  <img src="https://img.shields.io/badge/Brave%20%2F%20Edge-Supported-FF1B2D?logo=brave&logoColor=white" alt="Brave / Edge">
  <img src="https://img.shields.io/badge/Manifest-V3-34A853" alt="Manifest V3">
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT"></a>
</p>

<p align="center">
  <a href="#demo">Demo</a> ·
  <a href="#why-this-exists">Why this exists</a> ·
  <a href="#features">Features</a> ·
  <a href="#install">Install</a> ·
  <a href="#use">Use</a> ·
  <a href="#troubleshooting">Troubleshooting</a> ·
  <a href="#limits">Limits</a> ·
  <a href="#how-it-works">How it works</a> ·
  <a href="#privacy">Privacy</a>
</p>

---

## Demo

<div align="center">
  <video src="https://github.com/user-attachments/assets/7f4807b3-c133-4d66-bf13-e6641c2b8eee" controls width="100%"></video>
</div>

---

## Why this exists

Since mid-October 2026, YouTube began rejecting GIF comments submitted from desktop browsers with `HTTP 400 (INVALID_ARGUMENT)`. Legacy extensions that attempted to spoof YouTube's internal mobile API endpoints broke down completely.

MemeTube approaches this problem differently. Instead of relying on YouTube's server-side GIF attachment field, it embeds GIF identifiers invisibly into the comment text using zero-width unicode characters, then resolves and renders them client-side:

- **Users with MemeTube:** The extension detects the zero-width metadata and automatically renders the animated GIF directly under the comment.
- **Users without the extension (Mobile or stock desktop):** YouTube renders the comment as normal plain text. The embedded payload is completely invisible—no raw URLs, no broken BBCode, and no markup tags.

---

## Features

- **Search or paste:** Search Tenor directly, or paste any Tenor URL / media link / ID into the search input.
- **Live attachment preview:** An inline preview card locks below your input box once a GIF is selected. You can freely edit, retype, or delete your text without detaching the GIF.
- **Zero-width encoding:** Metadata is serialized into invisible characters (`\u200B`, `\u200C`, `\u200D`). It passes YouTube's comment length validation without altering visible text.
- **ASCII & Kaomoji collection:** Built-in picker for popular ASCII comment art templates and emoticons formatted specifically for YouTube's line spacing.
- **Desktop & Shorts support:** Injects cleanly into both standard watch page comment threads and Shorts comment panels.
- **Zero tracking:** Runs completely locally in the browser with no telemetry or external proxy servers.

---

## Install

MemeTube is loaded as an unpacked developer extension from a release ZIP.

<p>
  <a href="https://github.com/minhkhanh13/gif-youtube/releases/latest/download/memetube.zip">
    <img src="https://img.shields.io/badge/Download-memetube.zip-4285F4?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Download memetube.zip">
  </a>
</p>

### Chrome, Edge, Brave, Cốc Cốc

1. Download [`memetube.zip`](https://github.com/minhkhanh13/gif-youtube/releases/latest/download/memetube.zip) and extract it to a local folder.
2. Open your browser and navigate to `chrome://extensions` (or `brave://extensions` / `edge://extensions`).
3. Toggle on **Developer mode** in the top-right corner.
4. Click **Load unpacked** and select the extracted folder (the one containing `manifest.json`).
5. Reload any active YouTube tabs.

### Updating

When a new version is released:
1. Download the new `memetube.zip` and extract its files over your existing extension folder, overwriting old files.
2. Go to `chrome://extensions` and click the reload icon on the MemeTube card.
3. Refresh your YouTube tabs.

---

## Use

1. Click **Add a comment...** or **Reply** on any YouTube video or Short.
2. Click the **⚡ Meme / GIF** button located next to YouTube's comment action buttons.
3. Search for a GIF, paste a Tenor link, or select an ASCII meme from the tabs.
4. Clicking a GIF attaches it to the comment box and displays an inline preview card.
5. Write your comment text, then click **Comment** (or press <kbd>Ctrl</kbd>+<kbd>Enter</kbd>).

To remove an attached GIF before posting, click the **×** button in the top-right corner of the preview card.

| Key | What it does |
| --- | --- |
| <kbd>Enter</kbd> | Submits search query or resolves pasted Tenor link |
| <kbd>Ctrl</kbd>+<kbd>Enter</kbd> | Submits the comment with the attached GIF |
| <kbd>Esc</kbd> | Closes the picker modal |

---

## Troubleshooting

| Problem | Cause | Solution |
| --- | --- | --- |
| No button appears in comment box | Dynamic page navigation did not fire observer | Refresh the YouTube tab once. |
| Search returns "No GIFs found" for a URL | The full URL was treated as a raw search query | Paste the clean Tenor link (`tenor.com/view/...`) or ensure you are running the latest version which includes direct link parsing. |
| GIF preview is blank | Tenor media CDN was blocked by network or adblocker | Check if your browser or adblock extension is blocking `media.tenor.com`. |
| Comment text disappeared after posting | Input node was cleared before zero-width concatenation | Update to the latest release; text preservation is handled before form dispatch. |
| Extension error: `Manifest file is missing or unreadable` | Wrong directory selected during installation | Select the folder that directly contains `manifest.json`, not the parent wrapper folder. |

---

## Limits

- **Unofficial:** This project is not affiliated with YouTube, Google, or Tenor.
- **Client-side rendering requirement:** Because YouTube's backend rejects native desktop GIF attachments, animated GIFs posted via MemeTube are only rendered as images for viewers who also have MemeTube installed. Viewers without the extension see clean, standard text.
- **Tenor only:** Search and direct parsing currently support Tenor CDN endpoints. Local file uploads from disk are not supported.
- **New comments and replies only:** Adding GIFs while editing an already published comment is not supported.

---

## How it works

When a GIF is selected, MemeTube holds the payload in memory and mounts an inline preview element inside the comment editor DOM.

When the user submits the comment, MemeTube serializes the GIF metadata payload into a binary string and converts it into invisible zero-width unicode characters (`\u200B` for `0`, `\u200C` for `1`, and `\u200D` as a delimiter). This string is appended to the user's text. Because these characters are valid unicode, YouTube accepts and stores the comment without error.

On page render, a `MutationObserver` monitors comment thread nodes. When a comment contains the delimiter sequence, MemeTube extracts the zero-width segment, decodes the original GIF URL, and injects a sanitized image container directly below the comment body.

| File | Runs in | Responsibility |
| --- | --- | --- |
| `src/content.js` | YouTube page (isolated world) | Injects UI buttons, manages modal state, encodes zero-width payloads on submit, and scans DOM to render incoming GIF comments |
| `src/content.css` | YouTube page | Styles the modal dialog, tab switches, preview cards, and responsive rendered GIF containers |
| `manifest.json` | Browser extension runtime | Declares permissions, host permissions for Tenor APIs, and content script registration |

---

## Privacy

- **No analytics or data collection:** MemeTube does not track users, log comment text, or collect personal information.
- **Direct network requests only:** All search queries are sent directly from your browser to Tenor's public endpoints. No intermediary proxy servers are used.
- **No credential access:** MemeTube never reads, stores, or transmits your YouTube account credentials, cookies, or session tokens.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
