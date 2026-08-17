# Build stage
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
COPY backend.csproj ./
RUN dotnet restore
COPY . ./

RUN dotnet publish backend.csproj --configuration Release --output /dist


# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
COPY --from=build /dist ./
WORKDIR /app
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production
ENTRYPOINT ["dotnet", "backend.dll"]