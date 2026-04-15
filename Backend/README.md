# iO Event Connect - Backend

## Database aanmaken

```bash
docker run --name stipt-db \
  -e POSTGRES_USER=myuser \
  -e POSTGRES_PASSWORD=mypassword \
  -e POSTGRES_DB=stipt_backend \
  -p 5432:5432 \
  -d postgres
```

## Database migraties

```bash
# Nieuwe migratie maken
dotnet ef migrations add <MigrationName> --project Backend.Database --startup-project Backend.Web
```

```bash
# Migratie uitvoeren
dotnet ef database update --project Backend.Database --startup-project Backend.Web
```

# SignalR
- 2 richting verkeer tussen client en server. Maakt gebruik van Hubs die de connecties beheren. Sessionshub bevat 1 method die wordt aangeroepen door de mobiele app en vervolgens een bericht stuurt naar alle aangesloten clients.
- Sessionscontroller bevat de method SendMessage, die op basis van een post request eenzelfde message stuurt naar alle clients. Dit middels de IHubContext die automatisch al injected kan worden zolang de hub geregistreerd staat.
- Program bevat een call om signalR toe te voegen en een mapping voor de route van de sessionhub

## Extra overwegingen
- Niet voor elke call direct updates sturen naar signalR clients, gezien dit op schaal resource en dataverkeer inensief wordt. Mogelijkheid bekijken voor een achtergrondproces voor rate limitted mobile updates
- Probeer niet steeds de zelfde data naar clients te sturen, om dataverkeer op grotere schaal te besparen kan er gekeken worden naar enkel weizigingen sturen.

Voor meet uitleg over hoe signalR werkt, zie de microsoft docs. 

## TypeGen generatie

Bij het builden van de backend, worden automatisch de types gegenereerd voor de frontend. Deze types worden opgeslagen in `app/generated-types`.

Voor meer informatie over TypeGen, zie de [TypeGen documentatie](https://typegen.readthedocs.io/). Hierin staat ook uitgelegd hoe de [Enums](https://typegen.readthedocs.io/en/latest/attributes.html#tsstringinitializersattribute) etc. worden gegenereerd.

## JWT Secret Key

In `appsettings.Development.json` staat een veld `Jwt:SecretKey`. Deze wordt leeg gelaten, en we gebruiken user-secrets om deze in te stellen. Dit is een veilige manier om gevoelige informatie op te slaan tijdens de ontwikkeling.

> Run in het project `Backend.Web` het volgende commando om de JWT Secret Key in te stellen:

```bash
dotnet user-secrets set "Jwt:SecretKey" "###YOUR_SECRET_KEY###"
```

Vervang `###YOUR_SECRET_KEY###` door een sterke geheime sleutel. Deze sleutel wordt gebruikt om JWT-tokens te ondertekenen en te verifiëren. Zorg ervoor dat deze sleutel geheim blijft en niet wordt gedeeld of gecommit naar versiebeheer.

## Seed wachtwoord
In `appsettings.Development.json` staat een veld `Seeder:SeedUserPassword`. Deze wordt leeg gelaten, en we gebruiken user-secrets om deze in te stellen. Dit wachtwoord wordt gebruikt voor de seed gebruiker (`deelnemer@test.nl`) die bij het opstarten van de applicatie aangemaakt wordt.

> Run in het project `Backend.Web` het volgende commando om het seed wachtwoord in te stellen:

```bash
dotnet user-secrets set "Seeder:SeedUserPassword" "###YOUR_SEED_PASSWORD###"
```

Vervang `###YOUR_SEED_PASSWORD###` door een wachtwoord dat voldoet aan de ASP.NET Identity vereisten (minimaal 6 tekens, hoofdletter, cijfer en speciaal teken). Zorg ervoor dat dit wachtwoord geheim blijft en niet wordt gedeeld of gecommit naar versiebeheer.

