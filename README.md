# SuperCSV

SuperCSV is a browser-based CSV viewer and exporter. Data is processed client-side.

## Run Locally

1. Install dependencies:

```bash
npm install
```

2. Create your local env file:

```bash
cp .env.example .env
```

3. Start dev server:

```bash
npm start
```

## Google AdSense Setup

The app now includes reusable ad slots and an AdSense script hook. To enable ads:

1. Open `.env`.
2. Set `REACT_APP_ENABLE_ADS=true`.
3. Set `REACT_APP_ADSENSE_CLIENT_ID` to your publisher ID (for example, `ca-pub-1234567890123456`).
4. Set each slot ID:
	- `REACT_APP_ADSENSE_TOP_BANNER_SLOT`
	- `REACT_APP_ADSENSE_BOTTOM_BANNER_SLOT`
	- `REACT_APP_ADSENSE_LEFT_RAIL_SLOT`
	- `REACT_APP_ADSENSE_RIGHT_RAIL_SLOT`
5. Restart the dev server after changing `.env` values.

Notes:

- AdSense often does not show live ads on localhost or for unapproved ad units.
- When ads are disabled or config is missing, placeholder cards are shown so layout is easy to tune.

## Build

```bash
npm run build
```
