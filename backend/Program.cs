
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using AlRafaApi.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure PostgreSQL
var connectionString = builder.Configuration
    .GetConnectionString("DefaultConnection");

if (string.IsNullOrWhiteSpace(connectionString))
{
    throw new InvalidOperationException(
        "Connection string 'DefaultConnection' is missing. " +
        "Set ConnectionStrings__DefaultConnection in Render Environment.");
}

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

// Configure JWT Authentication
var jwtSettings = builder.Configuration.GetSection("Jwt");

var jwtKey = jwtSettings["Key"];
var jwtIssuer = jwtSettings["Issuer"];
var jwtAudience = jwtSettings["Audience"];

if (string.IsNullOrWhiteSpace(jwtKey) ||
    string.IsNullOrWhiteSpace(jwtIssuer) ||
    string.IsNullOrWhiteSpace(jwtAudience))
{
    throw new InvalidOperationException(
        "JWT configuration is missing. Set Jwt__Key, " +
        "Jwt__Issuer, and Jwt__Audience in Render Environment.");
}

var key = Encoding.UTF8.GetBytes(jwtKey);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme =
        JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme =
        JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtIssuer,
        ValidAudience = jwtAudience,
        IssuerSigningKey = new SymmetricSecurityKey(key)
    };
});

builder.Services.AddAuthorization();

// Configure CORS
var configuredOrigins = builder.Configuration
    .GetSection("Cors:AllowedOrigins")
    .Get<string[]>() ?? Array.Empty<string>();

var defaultOrigins = new HashSet<string>(StringComparer.OrdinalIgnoreCase)
{
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:3000",
    "https://al-rafa-roastery-afhyb7jjp-sufiya3.vercel.app"
};

foreach (var origin in configuredOrigins)
{
    defaultOrigins.Add(origin);
}

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.SetIsOriginAllowed(origin =>
        {
            if (string.IsNullOrWhiteSpace(origin)) return false;
            if (defaultOrigins.Contains(origin)) return true;

            // Allow any Vercel deployment preview or production domain
            if (Uri.TryCreate(origin, UriKind.Absolute, out var uri))
            {
                if (uri.Host.Equals("localhost", StringComparison.OrdinalIgnoreCase) ||
                    uri.Host.EndsWith(".vercel.app", StringComparison.OrdinalIgnoreCase))
                {
                    return true;
                }
            }

            return false;
        })
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials();
    });
});

var app = builder.Build();

// Apply EF Core migrations and synchronize PostgreSQL sequences on startup
using (var scope = app.Services.CreateScope())
{
    try
    {
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        db.Database.Migrate();

        // Ensure PostgreSQL identity sequences match seeded data and required columns exist
        db.Database.ExecuteSqlRaw(@"
            DO $$
            BEGIN
                IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'Products') THEN
                    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Products' AND column_name = 'WeightPrices') THEN
                        ALTER TABLE ""Products"" ADD COLUMN ""WeightPrices"" VARCHAR(8000) DEFAULT '';
                    ELSE
                        ALTER TABLE ""Products"" ALTER COLUMN ""WeightPrices"" TYPE VARCHAR(8000);
                    END IF;
                    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Products' AND column_name = 'ProdVarients_Pricing') THEN
                        ALTER TABLE ""Products"" ADD COLUMN ""ProdVarients_Pricing"" VARCHAR(8000) DEFAULT '';
                    ELSE
                        ALTER TABLE ""Products"" ALTER COLUMN ""ProdVarients_Pricing"" TYPE VARCHAR(8000);
                    END IF;
                    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Products' AND column_name = 'ProdImg') THEN
                        ALTER TABLE ""Products"" ADD COLUMN ""ProdImg"" VARCHAR(2000) DEFAULT '';
                    END IF;
                    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Products' AND column_name = 'Highlight') THEN
                        ALTER TABLE ""Products"" ADD COLUMN ""Highlight"" VARCHAR(100) DEFAULT '';
                    END IF;
                    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Products' AND column_name = 'OriginalPrice') THEN
                        ALTER TABLE ""Products"" ADD COLUMN ""OriginalPrice"" NUMERIC(18,2) NULL;
                    END IF;
                    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Products' AND column_name = 'StockQuantity') THEN
                        ALTER TABLE ""Products"" ADD COLUMN ""StockQuantity"" INTEGER DEFAULT 0;
                    END IF;
                    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Products' AND column_name = 'category_Id') THEN
                        ALTER TABLE ""Products"" ADD COLUMN ""category_Id"" INTEGER NULL;
                    END IF;

                    -- Ensure Categories table exists with category_Id primary key and category_name
                    CREATE TABLE IF NOT EXISTS ""Categories"" (
                        ""category_Id"" integer GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
                        ""category_name"" character varying(150) NOT NULL,
                        ""category_nameAr"" character varying(150) NULL,
                        ""created_at"" timestamp with time zone NOT NULL DEFAULT NOW(),
                        CONSTRAINT ""UQ_Categories_category_name"" UNIQUE (""category_name"")
                    );

                    -- Populate Categories with unique categories from Products if empty
                    INSERT INTO ""Categories"" (""category_name"")
                    SELECT DISTINCT ""Category""
                    FROM ""Products""
                    WHERE ""Category"" IS NOT NULL AND ""Category"" <> ''
                    ON CONFLICT (""category_name"") DO NOTHING;

                    -- Link category_Id in Products from Categories table
                    UPDATE ""Products"" p
                    SET ""category_Id"" = c.""category_Id""
                    FROM ""Categories"" c
                    WHERE p.""category_Id"" IS NULL AND LOWER(p.""Category"") = LOWER(c.""category_name"");

                    -- Sync existing fields between legacy and newly requested property names
                    UPDATE ""Products"" SET ""ProdVarients_Pricing"" = ""WeightPrices"" WHERE (""ProdVarients_Pricing"" IS NULL OR ""ProdVarients_Pricing"" = '') AND (""WeightPrices"" IS NOT NULL AND ""WeightPrices"" <> '');
                    UPDATE ""Products"" SET ""WeightPrices"" = ""ProdVarients_Pricing"" WHERE (""WeightPrices"" IS NULL OR ""WeightPrices"" = '') AND (""ProdVarients_Pricing"" IS NOT NULL AND ""ProdVarients_Pricing"" <> '');
                    UPDATE ""Products"" SET ""ProdImg"" = ""ImageUrl"" WHERE (""ProdImg"" IS NULL OR ""ProdImg"" = '') AND (""ImageUrl"" IS NOT NULL AND ""ImageUrl"" <> '');
                    UPDATE ""Products"" SET ""ImageUrl"" = ""ProdImg"" WHERE (""ImageUrl"" IS NULL OR ""ImageUrl"" = '') AND (""ProdImg"" IS NOT NULL AND ""ProdImg"" <> '');
                    UPDATE ""Products"" SET ""Highlight"" = ""Tag"" WHERE (""Highlight"" IS NULL OR ""Highlight"" = '') AND (""Tag"" IS NOT NULL AND ""Tag"" <> '');
                    UPDATE ""Products"" SET ""Tag"" = ""Highlight"" WHERE (""Tag"" IS NULL OR ""Tag"" = '') AND (""Highlight"" IS NOT NULL AND ""Highlight"" <> '');

                    PERFORM setval(
                        pg_get_serial_sequence('""Products""', 'Id'),
                        COALESCE((SELECT MAX(""Id"") FROM ""Products""), 1),
                        true
                    );
                    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'Categories') THEN
                        PERFORM setval(
                            pg_get_serial_sequence('""Categories""', 'category_Id'),
                            COALESCE((SELECT MAX(""category_Id"") FROM ""Categories""), 1),
                            true
                        );
                    END IF;
                END IF;
                IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'Users') THEN
                    PERFORM setval(
                        pg_get_serial_sequence('""Users""', 'Id'),
                        COALESCE((SELECT MAX(""Id"") FROM ""Users""), 1),
                        true
                    );
                END IF;
            END $$;
        ");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"[Startup] Database initialization note: {ex.Message}");
    }
}

// Configure pipeline
// if (app.Environment.IsDevelopment())
// {
//     app.UseSwagger();
//     app.UseSwaggerUI();
// }
app.UseSwagger();
app.UseSwaggerUI();
app.UseCors("AllowReactApp");
app.UseStaticFiles();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
