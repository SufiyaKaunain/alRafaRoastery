using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AlRafaApi.Migrations
{
    /// <inheritdoc />
    public partial class AddProductVariantsAndDetails : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Weight",
                table: "Products",
                type: "character varying(500)",
                maxLength: 500,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(50)",
                oldMaxLength: 50);

            migrationBuilder.AlterColumn<string>(
                name: "Tag",
                table: "Products",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(50)",
                oldMaxLength: 50);

            migrationBuilder.AlterColumn<string>(
                name: "ImageUrl",
                table: "Products",
                type: "character varying(2000)",
                maxLength: 2000,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(500)",
                oldMaxLength: 500);

            migrationBuilder.AddColumn<string>(
                name: "Highlight",
                table: "Products",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<decimal>(
                name: "OriginalPrice",
                table: "Products",
                type: "numeric",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ProdImg",
                table: "Products",
                type: "character varying(2000)",
                maxLength: 2000,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ProdVarients_Pricing",
                table: "Products",
                type: "character varying(8000)",
                maxLength: 8000,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "StockQuantity",
                table: "Products",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "WeightPrices",
                table: "Products",
                type: "character varying(8000)",
                maxLength: 8000,
                nullable: false,
                defaultValue: "");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Category", "Description", "DescriptionAr", "Highlight", "ImageUrl", "Name", "NameAr", "OriginalPrice", "Price", "ProdImg", "ProdVarients_Pricing", "StockQuantity", "Weight", "WeightPrices" },
                values: new object[] { "Arabic & Gulf Heritage Roasts", "Traditional Emirati light roast infused with green cardamom and genuine Persian saffron threads.", "قهوة عربية أصيلة بالهيل الأخضر والزعفران الفاخر", "", "https://d2ali9088mrhe3.cloudfront.net/stores/71f6a9e9-a144-4c34-9b52-59fba49ee5ec/category/a2f7b52b-9258-47e5-b135-99ecf60447c3/md.webp", "Emirati Heritage Arabic Coffee", "قهوة عربية تراثية بالهيل والزعفران", null, 38.00m, "", "", 0, "250g, 500g, 1kg", "" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "Category", "Description", "DescriptionAr", "Highlight", "ImageUrl", "Name", "NameAr", "OriginalPrice", "Price", "ProdImg", "ProdVarients_Pricing", "StockQuantity", "Tag", "Weight", "WeightPrices" },
                values: new object[] { "African Single Origin Roasts", "High-altitude African single origin with delicate floral jasmine aromas and bright bergamot citrus notes.", "بن إثيوبي مختص بنكهات زهرية وحمضيات متوازنة", "", "https://d2ali9088mrhe3.cloudfront.net/stores/71f6a9e9-a144-4c34-9b52-59fba49ee5ec/category/af664982-dd99-408c-bf42-0f0718fb0fce/md.webp", "Ethiopian Yirgacheffe Single Origin", "بن إثيوبي يرغاتشيفي مختص", null, 55.00m, "", "", 0, "signature", "250g, 500g, 1kg", "" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "Category", "Description", "DescriptionAr", "Highlight", "ImageUrl", "Name", "NameAr", "OriginalPrice", "Price", "ProdImg", "ProdVarients_Pricing", "StockQuantity", "Weight", "WeightPrices" },
                values: new object[] { "Turkish Specialty Roasts", "Extra-finely stone ground Arabica roasted medium-dark to deliver a thick velvety crema and intense flavor.", "مطحونة على الحجر بنعومة فائقة مع حب الهيل الفاخر", "", "https://d2ali9088mrhe3.cloudfront.net/stores/71f6a9e9-a144-4c34-9b52-59fba49ee5ec/category/83c47d88-7dd4-430c-a06c-22e8de44c250/md.webp", "Turkish Specialty Roast with Cardamom", "قهوة تركية مختصة بالهيل", null, 32.00m, "", "", 0, "250g, 500g", "" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "Category", "Description", "DescriptionAr", "Highlight", "ImageUrl", "Name", "NameAr", "OriginalPrice", "Price", "ProdImg", "ProdVarients_Pricing", "StockQuantity", "Tag", "Weight", "WeightPrices" },
                values: new object[] { "Premium Nuts & Dry Fruits", "Extra large California pistachios, gently dry roasted and dusted with natural sea salt.", "فستق حلبي فاخر ومقرمش محمص بالهواء الساخن", "", "https://d2ali9088mrhe3.cloudfront.net/stores/71f6a9e9-a144-4c34-9b52-59fba49ee5ec/product/28e67c2a-351e-4125-9bed-334e253919cc/md.webp", "Premium Jumbo Pistachios – USA", "فستق حلبي جامبو أمريكي – حجم كبير ومقرمش", null, 17.25m, "", "", 0, "bestseller", "250g, 500g, 1kg", "" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "Category", "Description", "DescriptionAr", "Highlight", "ImageUrl", "Name", "NameAr", "OriginalPrice", "Price", "ProdImg", "ProdVarients_Pricing", "StockQuantity", "Tag", "Weight", "WeightPrices" },
                values: new object[] { "Premium Nuts & Dry Fruits", "Fresh, naturally rich whole walnut halves imported from Chile, packed with omega-3 nutrients.", "جوز شيلي نخب أول طازج وغني بالفوائد الصحية", "", "https://d2ali9088mrhe3.cloudfront.net/stores/71f6a9e9-a144-4c34-9b52-59fba49ee5ec/product/179f6430-bb6a-4342-8009-9245bc9072b4/md.webp", "Premium Raw Chile Walnuts", "عين جمل شيلي نيء فاخر – طازج وغني", null, 16.50m, "", "", 0, "popular", "250g, 500g, 1kg", "" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 6,
                columns: new[] { "Category", "Description", "DescriptionAr", "Highlight", "ImageUrl", "Name", "NameAr", "OriginalPrice", "Price", "ProdImg", "ProdVarients_Pricing", "StockQuantity", "Tag", "Weight", "WeightPrices" },
                values: new object[] { "Premium Nuts & Dry Fruits", "Smoky, crunchy roasted whole almonds with barbecue spices.", "لوز محمص بنكهة الباربيكيو المدخنة اللذيذة", "", "https://d2ali9088mrhe3.cloudfront.net/stores/71f6a9e9-a144-4c34-9b52-59fba49ee5ec/product/585d93ba-f13a-49ff-a184-8f8d8a21687c/md.webp", "BBQ Almonds – Smoky & Crunchy", "لوز مدخن بنكهة الباربيكيو – مقرمش ولذيذ", null, 12.50m, "", "", 0, "bestseller", "250g, 500g, 1kg", "" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 7,
                columns: new[] { "Category", "Description", "DescriptionAr", "Highlight", "ImageUrl", "Name", "NameAr", "OriginalPrice", "Price", "ProdImg", "ProdVarients_Pricing", "StockQuantity", "Tag", "Weight", "WeightPrices" },
                values: new object[] { "Premium Nuts & Dry Fruits", "Premium whole jumbo cashews dry roasted to a rich buttery crunch.", "حبات كاجو كاملة بتحميص ذهبي وقرمشة رائعة", "", "https://d2ali9088mrhe3.cloudfront.net/stores/71f6a9e9-a144-4c34-9b52-59fba49ee5ec/product/058742ad-5b69-4563-9737-f7078b51fac4/md.webp", "Golden Roasted Cashews", "كاجو محمص ذهبي – قرمشة ونكهة زبدية غنية", null, 12.00m, "", "", 0, "popular", "250g, 500g, 1kg", "" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 8,
                columns: new[] { "Category", "Description", "DescriptionAr", "Highlight", "ImageUrl", "Name", "NameAr", "OriginalPrice", "Price", "ProdImg", "ProdVarients_Pricing", "StockQuantity", "Weight", "WeightPrices" },
                values: new object[] { "Premium Nuts & Dry Fruits", "Zesty and crunchy roasted pistachios coated with refreshing lemon salt.", "فستق أمريكي محمص بنكهة الليمون المنعشة", "", "https://d2ali9088mrhe3.cloudfront.net/stores/71f6a9e9-a144-4c34-9b52-59fba49ee5ec/product/8210d982-94e9-47d0-b153-57b39b67c77c/md.webp", "Jumbo Lemon Pistachios – USA", "فستق ليمون جامبو أمريكي – منعش ومقرمش", null, 17.25m, "", "", 0, "250g, 500g, 1kg", "" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 9,
                columns: new[] { "Category", "Description", "DescriptionAr", "Highlight", "ImageUrl", "Name", "NameAr", "OriginalPrice", "Price", "ProdImg", "ProdVarients_Pricing", "StockQuantity", "Tag", "Weight", "WeightPrices" },
                values: new object[] { "Premium Nuts & Dry Fruits", "Crunchy crispy coated peanuts infused with red chili and oriental spices.", "فول سوداني مغطى بطبقة مقرمشة وحارة غنية بالنكهة", "", "https://d2ali9088mrhe3.cloudfront.net/stores/71f6a9e9-a144-4c34-9b52-59fba49ee5ec/product/de1ae015-bc57-41e6-961d-c183850cd7f6/md.webp", "Spicy Coated Peanuts", "فول سوداني حار مقرمش – نكهة مميزة", null, 7.50m, "", "", 0, "", "250g, 500g", "" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 10,
                columns: new[] { "Category", "Description", "DescriptionAr", "Highlight", "ImageUrl", "Name", "NameAr", "OriginalPrice", "Price", "ProdImg", "ProdVarients_Pricing", "StockQuantity", "Weight", "WeightPrices" },
                values: new object[] { "Premium Nuts & Dry Fruits", "Crunchy peanuts enveloped in a savory barbecue crust.", "فول سوداني بنكهة الباربيكيو اللذيذة", "", "https://d2ali9088mrhe3.cloudfront.net/stores/71f6a9e9-a144-4c34-9b52-59fba49ee5ec/product/49a53b00-0444-45d2-96fb-8a1283ef9e5c/md.webp", "BBQ Coated Peanuts", "فول سوداني مقرمش بنكهة الباربيكيو", null, 7.50m, "", "", 0, "250g, 500g", "" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 11,
                columns: new[] { "Category", "Description", "DescriptionAr", "Highlight", "ImageUrl", "Name", "NameAr", "OriginalPrice", "Price", "ProdImg", "ProdVarients_Pricing", "StockQuantity", "Tag", "Weight", "WeightPrices" },
                values: new object[] { "Premium Chocolates", "Handcrafted Belgian pralines with hazelnut gianduja, pistachio cream, and salted caramel.", "تشكيلة حبات شوكولاتة بلجيكية فاخرة بحشوات الفستق والكراميل والبندق", "", "https://d2ali9088mrhe3.cloudfront.net/stores/71f6a9e9-a144-4c34-9b52-59fba49ee5ec/category/fbf2e333-806c-4031-abe7-56e7b85c12e8/md.webp", "Luxury Belgian Chocolates Gift Box", "علبة شوكولاتة بلجيكية فاخرة مشكلة", null, 55.00m, "", "", 0, "signature", "500g, 1kg", "" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 12,
                columns: new[] { "Category", "Description", "DescriptionAr", "Highlight", "ImageUrl", "Name", "NameAr", "OriginalPrice", "Price", "ProdImg", "ProdVarients_Pricing", "StockQuantity", "Tag", "Weight", "WeightPrices" },
                values: new object[] { "Premium Dates", "Selected premium Medjool dates stuffed with crunchy California almonds and roasted pistachios.", "تمر مجدول فاخر محشو بالفستق الحلبي واللوز المقرمش", "", "https://d2ali9088mrhe3.cloudfront.net/stores/71f6a9e9-a144-4c34-9b52-59fba49ee5ec/category/7ac1928e-4e6a-4d2d-b71e-e87e9e97c52d/md.webp", "Royal Stuffed Dates with Pistachio & Almond", "تمور ملكية محشوة بالفستق واللوز", null, 48.00m, "", "", 0, "bestseller", "500g, 1kg", "" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 13,
                columns: new[] { "Category", "Description", "DescriptionAr", "Highlight", "ImageUrl", "Name", "NameAr", "OriginalPrice", "Price", "ProdImg", "ProdVarients_Pricing", "StockQuantity", "Tag", "Weight", "WeightPrices" },
                values: new object[] { "Premium Arabic Sweets", "Delicate golden crispy baklava layers filled with premium pistachios and pure clarified butter.", "بقلاوة وحلويات شرقية مقرمشة محشوة بالفستق والسمن الأصيل", "", "https://d2ali9088mrhe3.cloudfront.net/stores/71f6a9e9-a144-4c34-9b52-59fba49ee5ec/category/40db9c49-8070-4886-bdba-e8aab95c6686/md.webp", "Traditional Arabic Sweets Assortment", "تشكيلة حلويات عربية وبقلاوة فاخرة", null, 65.00m, "", "", 0, "signature", "500g, 1kg", "" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 14,
                columns: new[] { "Category", "Description", "DescriptionAr", "Highlight", "ImageUrl", "Name", "NameAr", "OriginalPrice", "Price", "ProdImg", "ProdVarients_Pricing", "StockQuantity", "Weight", "WeightPrices" },
                values: new object[] { "Premium Spices", "Aromatic master blend of cardamom, cloves, cinnamon, and pure saffron threads.", "خلطة بهارات تراثية منتقاة بعناية لنكهة طهي عربية أصيلة", "", "https://d2ali9088mrhe3.cloudfront.net/stores/71f6a9e9-a144-4c34-9b52-59fba49ee5ec/category/da1bc9d0-9ea4-48dc-910a-a041792a41f7/md.webp", "Gourmet Emirati Spices & Saffron Blend", "بهارات إماراتية وتوابل عربية فاخرة بالزعفران", null, 35.00m, "", "", 0, "250g, 500g", "" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 15,
                columns: new[] { "Highlight", "ImageUrl", "OriginalPrice", "ProdImg", "ProdVarients_Pricing", "StockQuantity", "WeightPrices" },
                values: new object[] { "", "/assets/products/milk-chocolate.jpg", null, "", "", 0, "" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 16,
                columns: new[] { "Highlight", "ImageUrl", "OriginalPrice", "ProdImg", "ProdVarients_Pricing", "StockQuantity", "WeightPrices" },
                values: new object[] { "", "/assets/products/dark-chocolate.jpg", null, "", "", 0, "" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 17,
                columns: new[] { "Highlight", "ImageUrl", "OriginalPrice", "ProdImg", "ProdVarients_Pricing", "StockQuantity", "WeightPrices" },
                values: new object[] { "", "/assets/products/filled-chocolates.jpg", null, "", "", 0, "" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 18,
                columns: new[] { "Highlight", "ImageUrl", "OriginalPrice", "ProdImg", "ProdVarients_Pricing", "StockQuantity", "WeightPrices" },
                values: new object[] { "", "/assets/products/stuffed-dates.jpg", null, "", "", 0, "" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 19,
                columns: new[] { "Highlight", "ImageUrl", "OriginalPrice", "ProdImg", "ProdVarients_Pricing", "StockQuantity", "WeightPrices" },
                values: new object[] { "", "/assets/products/chocolate-dates.jpg", null, "", "", 0, "" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Highlight",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "OriginalPrice",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "ProdImg",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "ProdVarients_Pricing",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "StockQuantity",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "WeightPrices",
                table: "Products");

            migrationBuilder.AlterColumn<string>(
                name: "Weight",
                table: "Products",
                type: "character varying(50)",
                maxLength: 50,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(500)",
                oldMaxLength: 500);

            migrationBuilder.AlterColumn<string>(
                name: "Tag",
                table: "Products",
                type: "character varying(50)",
                maxLength: 50,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(100)",
                oldMaxLength: 100);

            migrationBuilder.AlterColumn<string>(
                name: "ImageUrl",
                table: "Products",
                type: "character varying(500)",
                maxLength: 500,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(2000)",
                oldMaxLength: 2000);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Category", "Description", "DescriptionAr", "ImageUrl", "Name", "NameAr", "Price", "Weight" },
                values: new object[] { "Specialty Drinks", "Espresso, fresh milk & sweet condensed milk, served over ice or hot.", "إسبريسو وحليب وحليب مكثف محلى", "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=600&auto=format&fit=crop&q=80", "Spanish Latte", "سبانيش لاتيه", 22.00m, "Single Cup" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "Category", "Description", "DescriptionAr", "ImageUrl", "Name", "NameAr", "Price", "Tag", "Weight" },
                values: new object[] { "Specialty Drinks", "Signature espresso blended with artisanal roasted pistachio sauce.", "إسبريسو مع الفستق المحمص", "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=600&auto=format&fit=crop&q=80", "Pistachio Latte", "بيستاشيو لاتيه", 26.00m, "bestseller", "Single Cup" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "Category", "Description", "DescriptionAr", "ImageUrl", "Name", "NameAr", "Price", "Weight" },
                values: new object[] { "Specialty Drinks", "Rich espresso infused with genuine Persian saffron threads and creamy textured milk.", "إسبريسو منقوع بالزعفران", "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=600&auto=format&fit=crop&q=80", "Saffron Latte", "لاتيه الزعفران", 28.00m, "Single Cup" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "Category", "Description", "DescriptionAr", "ImageUrl", "Name", "NameAr", "Price", "Tag", "Weight" },
                values: new object[] { "Specialty Drinks", "Double shot of single-origin roast, intense body with golden hazelnut crema.", "جرعة مزدوجة بكريمة غنية", "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=600&auto=format&fit=crop&q=80", "Espresso", "إسبريسو", 14.00m, "", "60ml" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "Category", "Description", "DescriptionAr", "ImageUrl", "Name", "NameAr", "Price", "Tag", "Weight" },
                values: new object[] { "Specialty Drinks", "Slow-brewed filter coffee extracted to highlight delicate fruit and floral notes.", "تقطير بطيء لقهوة مختصة", "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&auto=format&fit=crop&q=80", "V60 Specialty Pour Over", "في ٦٠ تقطير", 20.00m, "signature", "250ml" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 6,
                columns: new[] { "Category", "Description", "DescriptionAr", "ImageUrl", "Name", "NameAr", "Price", "Tag", "Weight" },
                values: new object[] { "Coffee Beans", "Dark roast espresso blend with notes of dark chocolate, brown sugar, and toasted hazelnuts.", "تحميص داكن بنكهة الشوكولاتة", "https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=600&auto=format&fit=crop&q=80", "Espresso Beans 250g", "بن إسبريسو 250غ", 45.00m, "popular", "250g" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 7,
                columns: new[] { "Category", "Description", "DescriptionAr", "ImageUrl", "Name", "NameAr", "Price", "Tag", "Weight" },
                values: new object[] { "Coffee Beans", "Traditional Emirati light roast infused with cardamom and saffron essence.", "بالهيل والزعفران، تحميص خفيف أصيل", "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&auto=format&fit=crop&q=80", "Arabic Coffee 250g", "قهوة عربية 250غ", 38.00m, "traditional", "250g" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 8,
                columns: new[] { "Category", "Description", "DescriptionAr", "ImageUrl", "Name", "NameAr", "Price", "Weight" },
                values: new object[] { "Coffee Beans", "Extra-finely ground arabica roasted to perfection with aromatic green cardamom.", "مطحونة ناعماً على الطريقة التقليدية", "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80", "Turkish Coffee 250g", "قهوة تركية 250غ", 32.00m, "250g" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 9,
                columns: new[] { "Category", "Description", "DescriptionAr", "ImageUrl", "Name", "NameAr", "Price", "Tag", "Weight" },
                values: new object[] { "Coffee Beans", "Our signature house roast combining Ethiopian Yirgacheffe and Colombian Supremo.", "خلطتنا المميزة الخاصة برأس الخيمة", "https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?w=600&auto=format&fit=crop&q=80", "Specialty House Blend 250g", "خلطة مختصة 250غ", 55.00m, "signature", "250g" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 10,
                columns: new[] { "Category", "Description", "DescriptionAr", "ImageUrl", "Name", "NameAr", "Price", "Weight" },
                values: new object[] { "Coffee Beans", "Cold extracted for 18 hours in small batches, naturally sweet and low acidity.", "منقوعة 18 ساعة، باردة ومنعشة", "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=600&auto=format&fit=crop&q=80", "Cold Brew Bottle", "قارورة كولد برو", 18.00m, "300ml" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 11,
                columns: new[] { "Category", "Description", "DescriptionAr", "ImageUrl", "Name", "NameAr", "Price", "Tag", "Weight" },
                values: new object[] { "Premium Nuts", "Jumbo California pistachios, gently hot-air roasted and dusted with natural sea salt.", "محمص ومملح بخفة وبجودة فاخرة", "https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?w=600&auto=format&fit=crop&q=80", "Roasted Pistachios 500g", "فستق حلبي محمص 500غ", 45.00m, "bestseller", "500g" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 12,
                columns: new[] { "Category", "Description", "DescriptionAr", "ImageUrl", "Name", "NameAr", "Price", "Tag", "Weight" },
                values: new object[] { "Premium Nuts", "Crunchy whole roasted almonds with a smoky aroma and light crispiness.", "لوز محمص ذهبي مقرمش", "https://images.unsplash.com/photo-1508061252445-5350f3ab0a55?w=600&auto=format&fit=crop&q=80", "Golden Roasted Almonds 500g", "لوز محمص ذهبي 500غ", 38.00m, "", "500g" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 13,
                columns: new[] { "Category", "Description", "DescriptionAr", "ImageUrl", "Name", "NameAr", "Price", "Tag", "Weight" },
                values: new object[] { "Premium Nuts", "Premium whole cashews dry roasted to a rich buttery crunch.", "حبات كاملة بتحميص زبدي فاخر", "https://images.unsplash.com/photo-1536591375315-1b836835a519?w=600&auto=format&fit=crop&q=80", "Roasted Cashews 500g", "كاجو محمص 500غ", 42.00m, "", "500g" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 14,
                columns: new[] { "Category", "Description", "DescriptionAr", "ImageUrl", "Name", "NameAr", "Price", "Weight" },
                values: new object[] { "Premium Nuts", "Our house blend of roasted pistachios, cashews, almonds, and pecans with secret spices.", "خلطتنا الفاخرة من أشهى المكسرات المحمصة", "https://images.unsplash.com/photo-1608686207856-001b95cf60ca?w=600&auto=format&fit=crop&q=80", "Mixed Roasted Nuts 500g", "مكسرات مشكلة فاخرة 500غ", 48.00m, "500g" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 15,
                column: "ImageUrl",
                value: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=600&auto=format&fit=crop&q=80");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 16,
                column: "ImageUrl",
                value: "https://images.unsplash.com/photo-1548741487-18d363dc4469?w=600&auto=format&fit=crop&q=80");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 17,
                column: "ImageUrl",
                value: "https://images.unsplash.com/photo-1526081347589-7fa3cb41b4b2?w=600&auto=format&fit=crop&q=80");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 18,
                column: "ImageUrl",
                value: "https://images.unsplash.com/photo-1575377427642-087cf684f29d?w=600&auto=format&fit=crop&q=80");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 19,
                column: "ImageUrl",
                value: "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=600&auto=format&fit=crop&q=80");
        }
    }
}
