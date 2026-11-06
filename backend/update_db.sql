-- 1. Ensure __EFMigrationsHistory exists with proper casing
CREATE TABLE IF NOT EXISTS "__EFMigrationsHistory" (
    "MigrationId" character varying(150) NOT NULL,
    "ProductVersion" character varying(32) NOT NULL,
    CONSTRAINT "PK___EFMigrationsHistory" PRIMARY KEY ("MigrationId")
);

-- 2. Alter column types on Products table
ALTER TABLE "Products" ALTER COLUMN "Weight" TYPE character varying(500);
ALTER TABLE "Products" ALTER COLUMN "Tag" TYPE character varying(100);
ALTER TABLE "Products" ALTER COLUMN "ImageUrl" TYPE character varying(2000);

-- 3. Add columns to Products table if they don't already exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Products' AND column_name = 'ProdVarients_Pricing') THEN
        ALTER TABLE "Products" ADD COLUMN "ProdVarients_Pricing" character varying(8000) NOT NULL DEFAULT '';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Products' AND column_name = 'WeightPrices') THEN
        ALTER TABLE "Products" ADD COLUMN "WeightPrices" character varying(8000) NOT NULL DEFAULT '';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Products' AND column_name = 'ProdImg') THEN
        ALTER TABLE "Products" ADD COLUMN "ProdImg" character varying(2000) NOT NULL DEFAULT '';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Products' AND column_name = 'Highlight') THEN
        ALTER TABLE "Products" ADD COLUMN "Highlight" character varying(100) NOT NULL DEFAULT '';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Products' AND column_name = 'OriginalPrice') THEN
        ALTER TABLE "Products" ADD COLUMN "OriginalPrice" numeric(18,2) NULL;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Products' AND column_name = 'StockQuantity') THEN
        ALTER TABLE "Products" ADD COLUMN "StockQuantity" integer NOT NULL DEFAULT 0;
    END IF;
END $$;

-- 4. Sync values between newly requested column names and roastery columns
UPDATE "Products"
SET "ProdVarients_Pricing" = "WeightPrices"
WHERE ("ProdVarients_Pricing" IS NULL OR "ProdVarients_Pricing" = '') AND ("WeightPrices" IS NOT NULL AND "WeightPrices" <> '');

UPDATE "Products"
SET "WeightPrices" = "ProdVarients_Pricing"
WHERE ("WeightPrices" IS NULL OR "WeightPrices" = '') AND ("ProdVarients_Pricing" IS NOT NULL AND "ProdVarients_Pricing" <> '');

UPDATE "Products"
SET "ProdImg" = "ImageUrl"
WHERE ("ProdImg" IS NULL OR "ProdImg" = '') AND ("ImageUrl" IS NOT NULL AND "ImageUrl" <> '');

UPDATE "Products"
SET "ImageUrl" = "ProdImg"
WHERE ("ImageUrl" IS NULL OR "ImageUrl" = '') AND ("ProdImg" IS NOT NULL AND "ProdImg" <> '');

UPDATE "Products"
SET "Highlight" = "Tag"
WHERE ("Highlight" IS NULL OR "Highlight" = '') AND ("Tag" IS NOT NULL AND "Tag" <> '');

UPDATE "Products"
SET "Tag" = "Highlight"
WHERE ("Tag" IS NULL OR "Tag" = '') AND ("Highlight" IS NOT NULL AND "Highlight" <> '');

-- 5. Record migrations in __EFMigrationsHistory
INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20261025185650_InitialCreate', '10.0.14')
ON CONFLICT DO NOTHING;

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20261106120254_AddProductVariantsAndDetails', '10.0.14')
ON CONFLICT DO NOTHING;

-- 6. Synchronize sequence for Products Id
SELECT setval(pg_get_serial_sequence('"Products"', 'Id'), COALESCE((SELECT MAX("Id") FROM "Products"), 1), true);

