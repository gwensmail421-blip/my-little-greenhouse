# My Little Greenhouse

A calm, friendly guide for families growing food in a small backyard kit greenhouse in a cold climate.

The home screen is a tiny isometric model of your greenhouse. It follows your real local time and weather, so it turns to dusk and night with your sunrise and sunset, and shows rain or snow when it's falling where you are. Only the plants you add show up on its shelves, in your care cards and in your reminders.

## What's in this first version

- **Live greenhouse scene.** Day, dusk and night from your sunrise and sunset, rain and snow from current weather, and the season from today's date. Weather comes from [Open-Meteo](https://open-meteo.com/) (free, no key). Without location access it uses Madison, Wisconsin.
- **This week.** What to sow, tend and harvest this season in an unheated kit greenhouse.
- **My Plants.** Search 11 plants and add the ones you grow. Your list is saved on the phone.
- **One plant at a time.** Tap a plant on the shelves, in Growing now or in a reminder, and a card slides up: what to do right now, then water, light, cold and pests, with the sources a tap away. Previous and Next flip through your plants.
- **Grouped reminders.** One pop-up per job, covering every plant that needs it, such as "Time to check the soil: tomato, basil and kale." It also warns on cold nights (40°F or below) and hot days (75°F or above).

Plant facts come from the fact-checked plant profiles (university extension sources), rewritten as one short sentence each.

## Run it on your phone

1. Install **Expo Go** from the App Store or Google Play.
2. On a computer with [Node.js](https://nodejs.org/) installed:
   ```bash
   npm install
   npx expo start
   ```
3. Scan the QR code with your phone's camera (iPhone) or with Expo Go (Android).

## For developers

- Expo SDK 57 with Expo Router. Screens live in `src/app`, the scene and cards in `src/components`, plant and season content in `src/data`, and weather, storage and reminder logic in `src/lib`.
- `npx tsc --noEmit` typechecks and `npx expo lint` lints.

## Not built yet

Push notifications, frost alerts while the app is closed, the wintering-indoors flow, organic product picks, the harvest log, more plants, and the subscription.
