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

## TypeGen generatie

Bij het builden van de backend, worden automatisch de types gegenereerd voor de frontend. Deze types worden opgeslagen in `app/generated-types`.

Voor meer informatie over TypeGen, zie de [TypeGen documentatie](https://typegen.readthedocs.io/). Hierin staat ook uitgelegd hoe de [Enums](https://typegen.readthedocs.io/en/latest/attributes.html#tsstringinitializersattribute) etc. worden gegenereerd.

## JWT Secret Key

In `appsettings.Development.json` staat een veld `Jwt:SecretKey`. Deze wordt leeg gelaten, en we gebruiken user-secrets om deze in te stellen. Dit is een veilige manier om gevoelige informatie op te slaan tijdens de ontwikkeling.

> Run in het project `Backend.Web` het volgende commando om de JWT Secret Key in te stellen:

```bash
dotnet user-secrets set "Jwt:SecretKey" "###YOUR_SECRET_KEY###"
```

Vervang `###YOUR_SECRET_KEY###` door een sterke geheime sleutel, van min. 35 karakters. Deze sleutel wordt gebruikt om JWT-tokens te ondertekenen en te verifiëren. Zorg ervoor dat deze sleutel geheim blijft en niet wordt gedeeld of gecommit naar versiebeheer.
