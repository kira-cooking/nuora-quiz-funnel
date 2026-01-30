# Nuora Quiz Funnel - Technical Setup

## Files Included

```
/nuora-quiz-funnel/
├── index.html          # Main quiz page (15 steps)
├── styles.css          # All styling
├── quiz.js             # Quiz logic + conditional routing
├── SETUP.md            # This file
├── assets/             # Product images (add these)
│   ├── nuora-logo.png
│   ├── feminine-balance-gummies.png
│   └── gut-ritual-capsules.png
├── research/
│   ├── avatar-research.md
│   └── mechanism-research.md
└── copy/
    └── quiz-copy-full.md
```

---

## Local Testing

### Option 1: Python (recommended)

```bash
cd /Users/kiralenova/Documents/nuora/quiz-funnel
python3 -m http.server 8000
```

Then open: http://localhost:8000

### Option 2: Node.js

```bash
npx serve .
```

### Option 3: VS Code Live Server

1. Install "Live Server" extension
2. Right-click index.html → "Open with Live Server"

---

## Before Deploying

### Add Product Images

Add these images to the `/assets/` folder:
- `nuora-logo.png` - Brand logo
- `feminine-balance-gummies.png` - Product shot
- `gut-ritual-capsules.png` - Gut product shot

### Update Bundle URL

In `index.html`, find `[BUNDLE_URL_PLACEHOLDER]` and replace with actual bundle product URL from Shopify.

Current: `https://mynuora.com/products/feminine-balance-gummies-1`
Bundle URL: (need to add when bundle product is created in Shopify)

### Add Analytics Tracking

The quiz.js already has placeholder integrations for:
- Klaviyo (`_learnq`)
- Meta Pixel (`fbq`)
- Google Analytics (`gtag`)

These will auto-detect if the scripts are loaded on the page.

---

## GitHub Pages Deployment

### Step 1: Create Repository

```bash
cd /Users/kiralenova/Documents/nuora/quiz-funnel

# Initialize git (if not already)
git init

# Add files
git add index.html styles.css quiz.js assets/ SETUP.md

# Commit
git commit -m "Nuora quiz funnel initial build"
```

### Step 2: Push to GitHub

```bash
# Add remote (replace with your repo)
git remote add origin https://github.com/YOUR_USERNAME/nuora-quiz.git

# Push
git push -u origin main
```

### Step 3: Enable GitHub Pages

1. Go to repo Settings → Pages
2. Source: Deploy from a branch
3. Branch: main, / (root)
4. Save

Your quiz will be live at: `https://YOUR_USERNAME.github.io/nuora-quiz/`

---

## Custom Domain (Optional)

To use a custom domain like `quiz.mynuora.com`:

1. Add CNAME file with: `quiz.mynuora.com`
2. In DNS settings, add CNAME record:
   - Name: `quiz`
   - Value: `YOUR_USERNAME.github.io`

---

## Conditional Routing Logic

### How It Works

**Step 5 (Gut Issues)** determines the offer shown:

| Answer | Offer Type | Price |
|--------|-----------|-------|
| "Yes, pretty often" | Bundle | $79/mo |
| "Sometimes, here and there" | Bundle | $79/mo |
| "Rarely" | Gummies Only | $39/mo |
| "No, my digestion is fine" | Gummies Only | $39/mo |

The routing affects:
- Step 11: Results page (shows different product cards)
- Step 15: Final CTA (shows different offer summary)

### Testing Routing

1. Go through quiz selecting "Yes, pretty often" for gut issues
2. Verify you see "Complete Balance" bundle offer at results
3. Go through again selecting "No, my digestion is fine"
4. Verify you see "Feminine Balance" gummies only offer

---

## Probiotics Conditional Section

If user selects "Probiotics" in Step 3, Step 13 shows an extra section explaining why probiotics alone didn't work.

---

## Verification Checklist

Before deploying to production:

- [ ] Quiz loads without console errors
- [ ] All 15 steps advance correctly
- [ ] Progress bar updates each step
- [ ] Back button works (except on step 1 and analysis)
- [ ] Multi-select (step 3) saves multiple values
- [ ] Gut issues routing works (bundle vs gummies)
- [ ] Analysis animation completes and auto-advances
- [ ] Results show correct offer based on routing
- [ ] Final CTA shows correct offer
- [ ] Probiotics conditional shows if selected
- [ ] Email capture validates format
- [ ] Skip email button works
- [ ] All CTAs link to correct checkout URL
- [ ] Mobile responsive (test at 375px width)
- [ ] Product images load (or gracefully hide if missing)

---

## Performance

The quiz is built with vanilla HTML/CSS/JS:
- No framework dependencies
- Single page (no page loads between steps)
- CSS animations are hardware-accelerated
- Total size: ~30KB (excluding images)

---

## Support

If issues arise, check:
1. Browser console for JavaScript errors
2. Network tab for failed resource loads
3. Responsive mode for mobile layout issues

---

*Do NOT deploy to production without Kira's approval.*
