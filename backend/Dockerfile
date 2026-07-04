FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY backend.csproj .
RUN dotnet restore


COPY . .
RUN dotnet tool install --global dotnet-ef
ENV PATH="${PATH}:/root/.dotnet/tools"
# use this when new migrations are added to the project, it will automatically apply them during the docker build process
ENV JWT_TOKEN="DockerBuildTemporaryTokenValue123456!"
RUN dotnet ef migrations add AutoMigration_$(date +%s) --output-dir Migrations --context AppDbContext || true

RUN dotnet publish -c Release -o /app
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
COPY --from=build /app .

EXPOSE 8080

ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production

ENTRYPOINT ["dotnet", "backend.dll"]
