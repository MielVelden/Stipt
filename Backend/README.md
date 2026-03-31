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
