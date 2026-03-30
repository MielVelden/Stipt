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