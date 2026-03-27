# Healthier Choice

Healthier Choice is a React + Vite app that helps users scan packaged food labels, extract ingredients with OCR, and flag potentially harmful ingredients using Whole Foods’ banned ingredients list.

**Live Link**: https://healthier-choice.netlify.app/

## Features

- Camera-based label capture using the browser camera
- Image preprocessing for better OCR accuracy
- OCR text extraction with `tesseract.js`
- Ingredient parsing and editing UI
- Analysis against a curated Whole Foods banned ingredients list
- Client-side React routing with `react-router-dom`

## How it works

1. Start on the splash screen and tap “Let’s get started”.
2. Use the camera view to align the ingredient label and snap a photo.
3. Confirm the image and let the app convert it into text.
4. Review the parsed ingredient list and edit any OCR mistakes.
5. Analyze the ingredients to highlight items that match the banned list.

## Tech stack

- React 19
- Vite
- Tailwind CSS
- React Router DOM
- Tesseract.js

## Notes

- The ingredient check is currently based on the `wholeFoodsBannedList` data in `src/context/wholeFoodsBannedList.js`.
- OCR accuracy depends on photo quality, lighting, and label clarity.
- The app uses a simple exact / substring match strategy for banned ingredient detection.

## Project structure

- `src/App.jsx` — application routes and providers
- `src/Splash.jsx` — landing screen
- `src/CameraContainer.jsx` — camera capture and image preprocessing
- `src/GenerateText.jsx` — OCR, parsed ingredient display, and analysis
- `src/AnalyzeIngredients.js` — banned ingredient matching logic
- `src/context/wholeFoodsBannedList.js` — banned ingredient source list
- `src/context/ImageContext.jsx` — image file state management

