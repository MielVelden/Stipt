# iO Event Connect — Mobile

React Native mobiele app voor het iO Event Connect platform, gebouwd met [Expo](https://expo.dev) en TypeScript.

## Vereisten

- [Node.js](https://nodejs.org) (versie 20 of hoger)
- [Expo Go](https://expo.dev/go) app op je telefoon (voor ontwikkeling)
- Of een Android/iOS emulator

## Installatie & starten

```bash
cd Mobile
npm install
npm start
```

Scan de QR-code met Expo Go (Android) of de Camera-app (iOS).

## Omgevingsvariabelen

Maak een `.env.local` bestand aan in de `Mobile/` map:

```
EXPO_PUBLIC_API_BASE_URL=http://<jouw-lokale-ip>:5283/api
```

> Gebruik je lokale IP-adres in plaats van `localhost` wanneer je de app op een fysiek apparaat test (`ipconfig` op Windows → IPv4-adres).

Standaard gebruikt de app `http://localhost:5283/api`.

## Projectstructuur

```
Mobile/
├── app/                          # Expo Router — file-based routes
│   ├── _layout.tsx               # Root Stack layout (redirect naar login)
│   ├── index.tsx                 # Entry point (redirect)
│   ├── (auth)/
│   │   ├── _layout.tsx           # Auth Stack layout
│   │   └── login.tsx             # Inlogscherm
│   └── (tabs)/
│       ├── _layout.tsx           # Tab navigator (4 tabs)
│       ├── index.tsx             # Evenementen overzicht
│       ├── schedule.tsx          # Mijn agenda
│       ├── qr.tsx                # QR scanner
│       ├── settings.tsx          # Instellingen
│
├── features/                     # Feature-gebaseerde business logic
│   ├── events/
│   │   ├── types.ts              # TypeScript types
│   │   └── api.ts                # API calls (getEvents, getEventById)
│   ├── rooms/
│   │   ├── types.ts
│   │   └── api.ts                # API calls (getRooms, getRoomById)
│   └── sessions/
│       ├── types.ts
│       └── api.ts                # API calls (getSessions, getSessionById)
│
├── lib/
│   ├── api-client.ts             # Axios HTTP client
│   └── utils.ts                  # cn() utility (clsx + tailwind-merge)
│
├── components/
│   └── ui/                       # React Native Reusables componenten
│
├── constants/
│   └── api.ts                    # API URL configuratie
│
├── assets/                       # App iconen en splash afbeeldingen
├── global.css                    # Tailwind directives + CSS kleurvariabelen
├── tailwind.config.js            # Tailwind configuratie
├── babel.config.js               # Babel configuratie (NativeWind)
└── metro.config.js               # Metro bundler configuratie (NativeWind)
```

De mappenstructuur in `features/` volgt hetzelfde patroon als de backend (`Backend.Web/Features`), zodat types en structuur consistent blijven over de hele applicatie.

## Navigatie

De app gebruikt [Expo Router](https://expo.github.io/router) voor file-based routing.

```
(auth)/login  →  inloggen (mock, auth volgt later)
      ↓
(tabs)/
  ├── index           Evenementen overzicht
  ├── schedule        Mijn agenda
  ├── qr              QR scanner
  ├── settings        Instellingen
```


## Styling

De app gebruikt [NativeWind v4](https://www.nativewind.dev) (Tailwind CSS voor React Native) voor styling, en [React Native Reusables](https://reactnativereusables.com) als component library — de React Native tegenhanger van shadcn/ui in de Backoffice.

Componenten worden toegevoegd via de CLI:
```bash
npx @react-native-reusables/cli@latest add <component>
```

## Gebruikte packages

| Package | Versie | Doel |
|---|---|---|
| `expo` | ~55.0.8 | Expo SDK |
| `expo-router` | ~55.0.7 | File-based routing |
| `nativewind` | ^4.2.3 | Tailwind CSS |
| `tailwindcss` | ^3.4.x | CSS engine |
| `react-native-reanimated` | ^4.2.1 | Animaties |
| `lucide-react-native` | ^1.7.0 | Iconen |
| `react-native-svg` | ^15.x | SVG ondersteuning |
| `axios` | ^1.x | HTTP client |
| `clsx` + `tailwind-merge` | latest | className utilities |

## Gerelateerde projecten

- [Backend](../Backend/README.md) — C# .NET backend API
- [Backoffice](../Backoffice/README.md) — React web backoffice
