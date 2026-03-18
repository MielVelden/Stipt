FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

COPY ["Backend.sln", "./"]
COPY ["Backend.Application/Backend.Application.csproj", "Backend.Application/"]
COPY ["Backend.Common/Backend.Common.csproj", "Backend.Common/"]
COPY ["Backend.Database/Backend.Database.csproj", "Backend.Database/"]
COPY ["Backend.Domain/Backend.Domain.csproj", "Backend.Domain/"]
COPY ["Backend.Web/Backend.Web.csproj", "Backend.Web/"]
RUN dotnet restore "Backend.sln"

COPY . .
RUN dotnet build "Backend.Web/Backend.Web.csproj" -c $BUILD_CONFIGURATION -o /app/build --no-restore

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "Backend.Web/Backend.Web.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false --no-restore

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Backend.Web.dll"]
