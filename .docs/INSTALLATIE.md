# iO Event Connect — Installatiehandleiding

Deze handleiding beschrijft hoe je het project lokaal opzet. Het project bestaat uit vier onderdelen:

| Onderdeel      | Technologie                  |
|----------------|------------------------------|
| **Database**   | PostgreSQL 18                |
| **Backend**    | C# / .NET 10 (ASP.NET Core)  |
| **Backoffice** | React (Vite, React Router)   |
| **Mobile**     | React Native + Expo (SDK 55) |

---

## 1. Vereisten

Installeer de volgende software voordat je begint:

- **.NET SDK 10** — [download](https://dotnet.microsoft.com/download)
- **Node.js LTS 20 of hoger** — [download](https://nodejs.org)
- **Docker** (voor de PostgreSQL-database) — [download](https://www.docker.com/products/docker-desktop)
- **Emulator** Voor mobiel testen: de **Expo Go** app op je telefoon, of een Android/iOS emulator

Daarnaast heb je een API-key van [Resend](https://resend.com/) nodig om de mailing service te configureren.

---

## 2. Repository clonen

```bash
git clone https://github.com/LamaFna/Stipt.git
cd Stipt
```

---

## 3. Database opzetten

De backend gebruikt PostgreSQL. Start een database-container met Docker:

```bash
docker run --name stipt-db \
  -e POSTGRES_USER=myuser \
  -e POSTGRES_PASSWORD=mypassword \
  -e POSTGRES_DB=stipt_backend \
  -p 5432:5432 \
  -d postgres
```

> De standaard connection string in `appsettings.Development.json` verwacht deze credentials. Pas deze gegevens aan als je andere waarden gebruikt.

---

## 4. Backend opzetten

Ga naar de backend-map:

```bash
cd Backend
```

### 4.1 Secrets instellen

Enkele gevoelige velden in `appsettings.Development.json` worden leeg gelaten en via **user-secrets** ingesteld. Voer de onderstaande commando's uit in het project `Backend.Web`:

```bash
cd Backend.Web
```

**JWT Secret Key** — gebruikt om JWT-tokens te ondertekenen en te verifiëren:

```bash
dotnet user-secrets set "Jwt:SecretKey" "###YOUR_SECRET_KEY###"
```

**Seed wachtwoord** — voor de seed-gebruiker (`deelnemer@test.nl`) die bij het opstarten wordt aangemaakt. Moet voldoen aan de ASP.NET Identity-vereisten (minimaal 6 tekens, hoofdletter, cijfer en speciaal teken):

```bash
dotnet user-secrets set "Seeder:SeedUserPassword" "###YOUR_SEED_PASSWORD###"
```

**Email API Key** — de API key die je hebt ontvangen voor de e-maildienst:

```bash
dotnet user-secrets set "ApiKeys:Email" "###YOUR_API_KEY###"
```

> Vervang de placeholders door echte waarden. Deel of commit deze waarden nooit naar versiebeheer.

### 4.2 Database migreren

Voer de migraties uit zodat het databaseschema wordt aangemaakt:

```bash
dotnet ef database update --project Backend.Database --startup-project Backend.Web
```

> Heb je het `dotnet ef`-commando nog niet? Installeer de EF Core tools met `dotnet tool install --global dotnet-ef`. Een nieuwe migratie maak je met `dotnet ef migrations add <MigrationName> --project Backend.Database --startup-project Backend.Web`.

### 4.3 Backend starten

```bash
dotnet run --project Backend.Web
```

De API draait nu op `http://localhost:5283`. Bij het builden worden automatisch de TypeScript-types voor de frontend gegenereerd (via TypeGen).

---

## 5. Backoffice (web) opzetten

Open een nieuwe terminal en ga naar de backoffice-map:

```bash
cd Backoffice
npm install
```

### 5.1 Omgevingsvariabelen

Maak een `.env`-bestand aan op basis van `.env.example`:

```
VITE_API_BASE_URL="http://localhost:5283/api"
VITE_MOBILE_APP_LINK_BASE="exp://[IP_ADDRESS]/:8081/--/"
```

> Vervang `[IP_ADDRESS]` door je lokale IP-adres als je de deep-link naar de mobiele app gebruikt.

### 5.2 Starten

```bash
npm run dev
```

De backoffice draait nu op `http://localhost:5173`. Dit adres is al toegestaan in de CORS-configuratie van de backend.

---

## 6. Mobile (app) opzetten

Open een nieuwe terminal en ga naar de mobile-map:

```bash
cd Mobile
npm install
```

### 6.1 Omgevingsvariabelen

Maak een `.env.local`-bestand aan in de `Mobile/`-map:

```
EXPO_PUBLIC_API_BASE_URL=http://<jouw-lokale-ip>:5283/api
```

> Gebruik je **lokale IP-adres** in plaats van `localhost` wanneer je test op een fysiek apparaat (op Windows: `ipconfig` → IPv4-adres). Zonder waarde gebruikt de app standaard `http://localhost:5283/api`.

### 6.2 Starten

```bash
npm start
```

---

## 7. Controle

Wanneer alles draait:

1. De backend is bereikbaar op `http://localhost:5283`.
2. De backoffice opent op `http://localhost:5173` en kan met de backend communiceren.
3. De mobiele app draait via Expo Go op een emulator of fysieke telefoon.
4. Inloggen kan met de seed-gebruiker `deelnemer@test.nl` en het seed-wachtwoord dat je hebt ingesteld.
