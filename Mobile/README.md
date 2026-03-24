# iO Event Connect — Mobile

React Native mobiele app voor het iO Event Connect platform, gebouwd met [Expo](https://expo.dev) en TypeScript.

## Vereisten

- [Node.js](https://nodejs.org) (versie 20 of hoger)
- [Expo Go](https://expo.dev/go) app op je telefoon (voor ontwikkeling)
- Of een Android/iOS emulator

## Installatie

```bash
cd Mobile
npm install
```

## Starten

```bash
npm start
```

Scan de QR-code met Expo Go (Android) of de Camera-app (iOS).

## Omgevingsvariabelen

Maak een `.env.local` bestand aan in de `Mobile/` map:

```
EXPO_PUBLIC_API_BASE_URL=http://<jouw-lokale-ip>:5283/api
```

> Gebruik je lokale IP-adres in plaats van `localhost` wanneer je de app op een fysiek apparaat test.

Standaard gebruikt de app `http://localhost:5283/api`.

## Projectstructuur

```
Mobile/
├── app/                        # Expo Router — file-based routes
│   ├── _layout.tsx             # Root navigatie layout
│   ├── index.tsx               # Home screen
│   ├── (events)/               # Evenementen routes
│   ├── (rooms)/                # Ruimtes routes
│   └── (sessions)/             # Sessies routes
│
├── features/                   # Feature-gebaseerde business logic
│   ├── events/
│   │   ├── types.ts            # TypeScript types (gespiegeld van backend)
│   │   └── api.ts              # API calls
│   ├── rooms/
│   │   ├── types.ts
│   │   └── api.ts
│   └── sessions/
│       ├── types.ts
│       └── api.ts
│
├── lib/
│   └── api-client.ts           # Axios HTTP client
│
├── components/                 # Gedeelde UI componenten
│
└── constants/
    └── api.ts                  # API URL configuratie
```

De mappenstructuur in `features/` volgt hetzelfde patroon als de backend (`Backend.Web/Features`), zodat types en structuur consistent blijven over de hele applicatie.

## Gerelateerde projecten

- [Backend](../Backend/README.md) — C# .NET backend API
- [Backoffice](../Backoffice/README.md) — React web backoffice
