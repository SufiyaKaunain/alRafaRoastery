FROM ://microsoft.com AS build
WORKDIR /src
COPY *.csproj ./
RUN dotnet restore
COPY . .
RUN dotnet publish -c Release -o /app

FROM ://microsoft.com AS final
WORKDIR /app
COPY --from=build /app .
ENTRYPOINT ["dotnet", "AlRafaApi.dll"]