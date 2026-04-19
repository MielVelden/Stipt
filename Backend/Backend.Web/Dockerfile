FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

COPY ["Backend/Backend.Web/Backend.Web.csproj", "Backend/Backend.Web/"]
COPY ["Backend/Backend.Database/Backend.Database.csproj", "Backend/Backend.Database/"]
COPY ["Backend/dotnet-tools.json", "Backend/"]

RUN dotnet restore "Backend/Backend.Web/Backend.Web.csproj"

COPY Backend/ Backend/
COPY Backoffice/app/generated-types/ Backoffice/app/generated-types/
COPY Mobile/generated-types/ Mobile/generated-types/

WORKDIR /src/Backend/Backend.Web
RUN dotnet publish "Backend.Web.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
ENV ASPNETCORE_URLS=http://+:8080
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "Backend.Web.dll"]
