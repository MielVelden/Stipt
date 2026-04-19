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
De app gebruikt SignalR voor realtime communicatie. Deze communicatie verloopt via websockets waarbij de client en server methods op elkaar aanroepen.

Hiervoor moet er als eerst een Hub worden aangemaakt op de server:
```csharp
public class ExampleHub : Hub
{
}
```
Om de client een method op de server te laten aanroepen gebruik je: 
```csharp
public async Task ServerMethodName(data)
{
    //some code here
}
```
Om vanaf de server een method van de client aan te roepen (in dit geval op alle verbonden clients) gebruik je:
```csharp
await Clients.All.SendAsync("ClientMethod", data);
```

Het aanroepen van methodes op de client kan standaard alleen vanuit de Hub. Om vanuit een andere class een client method aan te roepen geef je door middel van de DI container een HubContext mee:
```csharp
public class ExampleController(IHubContext<ExampleHub> hubContext) : ControllerBase
```

Vanuit hier gebruik je:
```csharp
await hubContext.Clients.All.SendAsync("ClientMethod", data);
```

Om een Hub te registreren voor gebruik voeg je het volgende toe aan Backend.Web/Configuration/ApplicationBuilderExtention.cs in de methode AddHubs():
```csharp
app.MapHub<ExampleHub>("/api/hub/examplehub", options);
```
> Hub en server methods zijn op dezelfde manier te beveiligen met de ```[Authorize]``` tag als normale controllers en methods.

Verdere uitleg is te vinden in de [Microsoft documentatie](https://learn.microsoft.com/en-us/aspnet/core/signalr/introduction?view=aspnetcore-10.0)


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

