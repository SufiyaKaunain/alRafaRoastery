using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace AlRafaApi.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Products",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    NameAr = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    DescriptionAr = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    Price = table.Column<decimal>(type: "numeric(18,2)", nullable: false),
                    Category = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    ImageUrl = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    Weight = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Tag = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    IsAvailable = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "NOW()"),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "NOW()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Products", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    FullName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Email = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    PasswordHash = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "NOW()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "Products",
                columns: new[] { "Id", "Category", "CreatedAt", "Description", "DescriptionAr", "ImageUrl", "IsAvailable", "Name", "NameAr", "Price", "Tag", "UpdatedAt", "Weight" },
                values: new object[,]
                {
                    { 1, "Specialty Drinks", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Espresso, fresh milk & sweet condensed milk, served over ice or hot.", "إسبريسو وحليب وحليب مكثف محلى", "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=600&auto=format&fit=crop&q=80", true, "Spanish Latte", "سبانيش لاتيه", 22.00m, "bestseller", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Single Cup" },
                    { 2, "Specialty Drinks", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Signature espresso blended with artisanal roasted pistachio sauce.", "إسبريسو مع الفستق المحمص", "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=600&auto=format&fit=crop&q=80", true, "Pistachio Latte", "بيستاشيو لاتيه", 26.00m, "bestseller", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Single Cup" },
                    { 3, "Specialty Drinks", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Rich espresso infused with genuine Persian saffron threads and creamy textured milk.", "إسبريسو منقوع بالزعفران", "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=600&auto=format&fit=crop&q=80", true, "Saffron Latte", "لاتيه الزعفران", 28.00m, "popular", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Single Cup" },
                    { 4, "Specialty Drinks", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Double shot of single-origin roast, intense body with golden hazelnut crema.", "جرعة مزدوجة بكريمة غنية", "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=600&auto=format&fit=crop&q=80", true, "Espresso", "إسبريسو", 14.00m, "", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "60ml" },
                    { 5, "Specialty Drinks", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Slow-brewed filter coffee extracted to highlight delicate fruit and floral notes.", "تقطير بطيء لقهوة مختصة", "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&auto=format&fit=crop&q=80", true, "V60 Specialty Pour Over", "في ٦٠ تقطير", 20.00m, "signature", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "250ml" },
                    { 6, "Coffee Beans", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Dark roast espresso blend with notes of dark chocolate, brown sugar, and toasted hazelnuts.", "تحميص داكن بنكهة الشوكولاتة", "https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=600&auto=format&fit=crop&q=80", true, "Espresso Beans 250g", "بن إسبريسو 250غ", 45.00m, "popular", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "250g" },
                    { 7, "Coffee Beans", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Traditional Emirati light roast infused with cardamom and saffron essence.", "بالهيل والزعفران، تحميص خفيف أصيل", "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&auto=format&fit=crop&q=80", true, "Arabic Coffee 250g", "قهوة عربية 250غ", 38.00m, "traditional", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "250g" },
                    { 8, "Coffee Beans", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Extra-finely ground arabica roasted to perfection with aromatic green cardamom.", "مطحونة ناعماً على الطريقة التقليدية", "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80", true, "Turkish Coffee 250g", "قهوة تركية 250غ", 32.00m, "", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "250g" },
                    { 9, "Coffee Beans", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Our signature house roast combining Ethiopian Yirgacheffe and Colombian Supremo.", "خلطتنا المميزة الخاصة برأس الخيمة", "https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?w=600&auto=format&fit=crop&q=80", true, "Specialty House Blend 250g", "خلطة مختصة 250غ", 55.00m, "signature", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "250g" },
                    { 10, "Coffee Beans", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Cold extracted for 18 hours in small batches, naturally sweet and low acidity.", "منقوعة 18 ساعة، باردة ومنعشة", "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=600&auto=format&fit=crop&q=80", true, "Cold Brew Bottle", "قارورة كولد برو", 18.00m, "", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "300ml" },
                    { 11, "Premium Nuts", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Jumbo California pistachios, gently hot-air roasted and dusted with natural sea salt.", "محمص ومملح بخفة وبجودة فاخرة", "https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?w=600&auto=format&fit=crop&q=80", true, "Roasted Pistachios 500g", "فستق حلبي محمص 500غ", 45.00m, "bestseller", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "500g" },
                    { 12, "Premium Nuts", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Crunchy whole roasted almonds with a smoky aroma and light crispiness.", "لوز محمص ذهبي مقرمش", "https://images.unsplash.com/photo-1508061252445-5350f3ab0a55?w=600&auto=format&fit=crop&q=80", true, "Golden Roasted Almonds 500g", "لوز محمص ذهبي 500غ", 38.00m, "", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "500g" },
                    { 13, "Premium Nuts", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Premium whole cashews dry roasted to a rich buttery crunch.", "حبات كاملة بتحميص زبدي فاخر", "https://images.unsplash.com/photo-1536591375315-1b836835a519?w=600&auto=format&fit=crop&q=80", true, "Roasted Cashews 500g", "كاجو محمص 500غ", 42.00m, "", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "500g" },
                    { 14, "Premium Nuts", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Our house blend of roasted pistachios, cashews, almonds, and pecans with secret spices.", "خلطتنا الفاخرة من أشهى المكسرات المحمصة", "https://images.unsplash.com/photo-1608686207856-001b95cf60ca?w=600&auto=format&fit=crop&q=80", true, "Mixed Roasted Nuts 500g", "مكسرات مشكلة فاخرة 500غ", 48.00m, "popular", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "500g" },
                    { 15, "Luxury Chocolates", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Silky smooth 38% cocoa milk chocolate pralines crafted with Swiss cocoa butter.", "ناعمة على الطريقة البلجيكية الفاخرة", "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=600&auto=format&fit=crop&q=80", true, "Belgian Milk Chocolate Box", "علبة شوكولاتة بالحليب", 35.00m, "bestseller", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "350g" },
                    { 16, "Luxury Chocolates", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Intense single-origin Ecuadorian dark chocolate bonbons with roasted cocoa nib sprinkles.", "70% كاكاو، نكهة مركزة لعشاق الشوكولاتة الداكنة", "https://images.unsplash.com/photo-1548741487-18d363dc4469?w=600&auto=format&fit=crop&q=80", true, "Dark Chocolate Box 70%", "علبة شوكولاتة داكنة 70%", 38.00m, "signature", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "350g" },
                    { 17, "Luxury Chocolates", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Assorted artisan pralines with pistachio cream, salted caramel, hazelnut gianduja, and espresso ganache.", "حشوات فاخرة مشكلة بالفستق والكراميل والبندق", "https://images.unsplash.com/photo-1526081347589-7fa3cb41b4b2?w=600&auto=format&fit=crop&q=80", true, "Filled Chocolates Luxury Box", "علبة شوكولاتة محشوة مشكلة", 55.00m, "bestseller", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "500g" },
                    { 18, "Dates & Confections", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Select Medjool and Khalas dates generously stuffed with roasted almonds, walnuts, and candied orange peel.", "تمر فاخر محشو بالمكسرات واللوز المحمص", "https://images.unsplash.com/photo-1575377427642-087cf684f29d?w=600&auto=format&fit=crop&q=80", true, "Stuffed Dates Premium Box", "علبة تمر فاخر محشو", 48.00m, "traditional", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "450g" },
                    { 19, "Dates & Confections", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Succulent dates stuffed with roasted pistachio and enrobed in dark Belgian chocolate.", "تمر نخب أول مغطى بالشوكولاتة البلجيكية الفاخرة", "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=600&auto=format&fit=crop&q=80", true, "Chocolate Dipped Dates Box", "علبة تمر مغطى بالشوكولاتة", 52.00m, "signature", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "500g" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Users_Email",
                table: "Users",
                column: "Email",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Products");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
