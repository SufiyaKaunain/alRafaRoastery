using Microsoft.EntityFrameworkCore;
using AlRafaApi.Models;

namespace AlRafaApi.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Product> Products => Set<Product>();
    public DbSet<User> Users => Set<User>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Product>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Price).HasColumnType("decimal(18,2)");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("NOW()");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("NOW()");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Email).IsUnique();
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("NOW()");
        });

        // Seed data with authentic Al Rafa Roastery items
        modelBuilder.Entity<Product>().HasData(
            new Product
            {
                Id = 1,
                Name = "Emirati Heritage Arabic Coffee",
                NameAr = "قهوة عربية تراثية بالهيل والزعفران",
                Description = "Traditional Emirati light roast infused with green cardamom and genuine Persian saffron threads.",
                DescriptionAr = "قهوة عربية أصيلة بالهيل الأخضر والزعفران الفاخر",
                Price = 38.00m,
                Category = "Arabic & Gulf Heritage Roasts",
                ImageUrl = "https://d2ali9088mrhe3.cloudfront.net/stores/71f6a9e9-a144-4c34-9b52-59fba49ee5ec/category/a2f7b52b-9258-47e5-b135-99ecf60447c3/md.webp",
                Weight = "250g, 500g, 1kg",
                Tag = "bestseller",
                IsAvailable = true,
                CreatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                UpdatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            },
            new Product
            {
                Id = 2,
                Name = "Ethiopian Yirgacheffe Single Origin",
                NameAr = "بن إثيوبي يرغاتشيفي مختص",
                Description = "High-altitude African single origin with delicate floral jasmine aromas and bright bergamot citrus notes.",
                DescriptionAr = "بن إثيوبي مختص بنكهات زهرية وحمضيات متوازنة",
                Price = 55.00m,
                Category = "African Single Origin Roasts",
                ImageUrl = "https://d2ali9088mrhe3.cloudfront.net/stores/71f6a9e9-a144-4c34-9b52-59fba49ee5ec/category/af664982-dd99-408c-bf42-0f0718fb0fce/md.webp",
                Weight = "250g, 500g, 1kg",
                Tag = "signature",
                IsAvailable = true,
                CreatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                UpdatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            },
            new Product
            {
                Id = 3,
                Name = "Turkish Specialty Roast with Cardamom",
                NameAr = "قهوة تركية مختصة بالهيل",
                Description = "Extra-finely stone ground Arabica roasted medium-dark to deliver a thick velvety crema and intense flavor.",
                DescriptionAr = "مطحونة على الحجر بنعومة فائقة مع حب الهيل الفاخر",
                Price = 32.00m,
                Category = "Turkish Specialty Roasts",
                ImageUrl = "https://d2ali9088mrhe3.cloudfront.net/stores/71f6a9e9-a144-4c34-9b52-59fba49ee5ec/category/83c47d88-7dd4-430c-a06c-22e8de44c250/md.webp",
                Weight = "250g, 500g",
                Tag = "popular",
                IsAvailable = true,
                CreatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                UpdatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            },
            new Product
            {
                Id = 4,
                Name = "Premium Jumbo Pistachios – USA",
                NameAr = "فستق حلبي جامبو أمريكي – حجم كبير ومقرمش",
                Description = "Extra large California pistachios, gently dry roasted and dusted with natural sea salt.",
                DescriptionAr = "فستق حلبي فاخر ومقرمش محمص بالهواء الساخن",
                Price = 17.25m,
                Category = "Premium Nuts & Dry Fruits",
                ImageUrl = "https://d2ali9088mrhe3.cloudfront.net/stores/71f6a9e9-a144-4c34-9b52-59fba49ee5ec/product/28e67c2a-351e-4125-9bed-334e253919cc/md.webp",
                Weight = "250g, 500g, 1kg",
                Tag = "bestseller",
                IsAvailable = true,
                CreatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                UpdatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            },
            new Product
            {
                Id = 5,
                Name = "Premium Raw Chile Walnuts",
                NameAr = "عين جمل شيلي نيء فاخر – طازج وغني",
                Description = "Fresh, naturally rich whole walnut halves imported from Chile, packed with omega-3 nutrients.",
                DescriptionAr = "جوز شيلي نخب أول طازج وغني بالفوائد الصحية",
                Price = 16.50m,
                Category = "Premium Nuts & Dry Fruits",
                ImageUrl = "https://d2ali9088mrhe3.cloudfront.net/stores/71f6a9e9-a144-4c34-9b52-59fba49ee5ec/product/179f6430-bb6a-4342-8009-9245bc9072b4/md.webp",
                Weight = "250g, 500g, 1kg",
                Tag = "popular",
                IsAvailable = true,
                CreatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                UpdatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            },
            new Product
            {
                Id = 6,
                Name = "BBQ Almonds – Smoky & Crunchy",
                NameAr = "لوز مدخن بنكهة الباربيكيو – مقرمش ولذيذ",
                Description = "Smoky, crunchy roasted whole almonds with barbecue spices.",
                DescriptionAr = "لوز محمص بنكهة الباربيكيو المدخنة اللذيذة",
                Price = 12.50m,
                Category = "Premium Nuts & Dry Fruits",
                ImageUrl = "https://d2ali9088mrhe3.cloudfront.net/stores/71f6a9e9-a144-4c34-9b52-59fba49ee5ec/product/585d93ba-f13a-49ff-a184-8f8d8a21687c/md.webp",
                Weight = "250g, 500g, 1kg",
                Tag = "bestseller",
                IsAvailable = true,
                CreatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                UpdatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            },
            new Product
            {
                Id = 7,
                Name = "Golden Roasted Cashews",
                NameAr = "كاجو محمص ذهبي – قرمشة ونكهة زبدية غنية",
                Description = "Premium whole jumbo cashews dry roasted to a rich buttery crunch.",
                DescriptionAr = "حبات كاجو كاملة بتحميص ذهبي وقرمشة رائعة",
                Price = 12.00m,
                Category = "Premium Nuts & Dry Fruits",
                ImageUrl = "https://d2ali9088mrhe3.cloudfront.net/stores/71f6a9e9-a144-4c34-9b52-59fba49ee5ec/product/058742ad-5b69-4563-9737-f7078b51fac4/md.webp",
                Weight = "250g, 500g, 1kg",
                Tag = "popular",
                IsAvailable = true,
                CreatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                UpdatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            },
            new Product
            {
                Id = 8,
                Name = "Jumbo Lemon Pistachios – USA",
                NameAr = "فستق ليمون جامبو أمريكي – منعش ومقرمش",
                Description = "Zesty and crunchy roasted pistachios coated with refreshing lemon salt.",
                DescriptionAr = "فستق أمريكي محمص بنكهة الليمون المنعشة",
                Price = 17.25m,
                Category = "Premium Nuts & Dry Fruits",
                ImageUrl = "https://d2ali9088mrhe3.cloudfront.net/stores/71f6a9e9-a144-4c34-9b52-59fba49ee5ec/product/8210d982-94e9-47d0-b153-57b39b67c77c/md.webp",
                Weight = "250g, 500g, 1kg",
                Tag = "",
                IsAvailable = true,
                CreatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                UpdatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            },
            new Product
            {
                Id = 9,
                Name = "Spicy Coated Peanuts",
                NameAr = "فول سوداني حار مقرمش – نكهة مميزة",
                Description = "Crunchy crispy coated peanuts infused with red chili and oriental spices.",
                DescriptionAr = "فول سوداني مغطى بطبقة مقرمشة وحارة غنية بالنكهة",
                Price = 7.50m,
                Category = "Premium Nuts & Dry Fruits",
                ImageUrl = "https://d2ali9088mrhe3.cloudfront.net/stores/71f6a9e9-a144-4c34-9b52-59fba49ee5ec/product/de1ae015-bc57-41e6-961d-c183850cd7f6/md.webp",
                Weight = "250g, 500g",
                Tag = "",
                IsAvailable = true,
                CreatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                UpdatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            },
            new Product
            {
                Id = 10,
                Name = "BBQ Coated Peanuts",
                NameAr = "فول سوداني مقرمش بنكهة الباربيكيو",
                Description = "Crunchy peanuts enveloped in a savory barbecue crust.",
                DescriptionAr = "فول سوداني بنكهة الباربيكيو اللذيذة",
                Price = 7.50m,
                Category = "Premium Nuts & Dry Fruits",
                ImageUrl = "https://d2ali9088mrhe3.cloudfront.net/stores/71f6a9e9-a144-4c34-9b52-59fba49ee5ec/product/49a53b00-0444-45d2-96fb-8a1283ef9e5c/md.webp",
                Weight = "250g, 500g",
                Tag = "",
                IsAvailable = true,
                CreatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                UpdatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            },
            new Product
            {
                Id = 11,
                Name = "Luxury Belgian Chocolates Gift Box",
                NameAr = "علبة شوكولاتة بلجيكية فاخرة مشكلة",
                Description = "Handcrafted Belgian pralines with hazelnut gianduja, pistachio cream, and salted caramel.",
                DescriptionAr = "تشكيلة حبات شوكولاتة بلجيكية فاخرة بحشوات الفستق والكراميل والبندق",
                Price = 55.00m,
                Category = "Premium Chocolates",
                ImageUrl = "https://d2ali9088mrhe3.cloudfront.net/stores/71f6a9e9-a144-4c34-9b52-59fba49ee5ec/category/fbf2e333-806c-4031-abe7-56e7b85c12e8/md.webp",
                Weight = "500g, 1kg",
                Tag = "signature",
                IsAvailable = true,
                CreatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                UpdatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            },
            new Product
            {
                Id = 12,
                Name = "Royal Stuffed Dates with Pistachio & Almond",
                NameAr = "تمور ملكية محشوة بالفستق واللوز",
                Description = "Selected premium Medjool dates stuffed with crunchy California almonds and roasted pistachios.",
                DescriptionAr = "تمر مجدول فاخر محشو بالفستق الحلبي واللوز المقرمش",
                Price = 48.00m,
                Category = "Premium Dates",
                ImageUrl = "https://d2ali9088mrhe3.cloudfront.net/stores/71f6a9e9-a144-4c34-9b52-59fba49ee5ec/category/7ac1928e-4e6a-4d2d-b71e-e87e9e97c52d/md.webp",
                Weight = "500g, 1kg",
                Tag = "bestseller",
                IsAvailable = true,
                CreatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                UpdatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            },
            new Product
            {
                Id = 13,
                Name = "Traditional Arabic Sweets Assortment",
                NameAr = "تشكيلة حلويات عربية وبقلاوة فاخرة",
                Description = "Delicate golden crispy baklava layers filled with premium pistachios and pure clarified butter.",
                DescriptionAr = "بقلاوة وحلويات شرقية مقرمشة محشوة بالفستق والسمن الأصيل",
                Price = 65.00m,
                Category = "Premium Arabic Sweets",
                ImageUrl = "https://d2ali9088mrhe3.cloudfront.net/stores/71f6a9e9-a144-4c34-9b52-59fba49ee5ec/category/40db9c49-8070-4886-bdba-e8aab95c6686/md.webp",
                Weight = "500g, 1kg",
                Tag = "signature",
                IsAvailable = true,
                CreatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                UpdatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            },
            new Product
            {
                Id = 14,
                Name = "Gourmet Emirati Spices & Saffron Blend",
                NameAr = "بهارات إماراتية وتوابل عربية فاخرة بالزعفران",
                Description = "Aromatic master blend of cardamom, cloves, cinnamon, and pure saffron threads.",
                DescriptionAr = "خلطة بهارات تراثية منتقاة بعناية لنكهة طهي عربية أصيلة",
                Price = 35.00m,
                Category = "Premium Spices",
                ImageUrl = "https://d2ali9088mrhe3.cloudfront.net/stores/71f6a9e9-a144-4c34-9b52-59fba49ee5ec/category/da1bc9d0-9ea4-48dc-910a-a041792a41f7/md.webp",
                Weight = "250g, 500g",
                Tag = "popular",
                IsAvailable = true,
                CreatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                UpdatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            },
            new Product
            {
                Id = 15,
                Name = "Belgian Milk Chocolate Box",
                NameAr = "علبة شوكولاتة بالحليب",
                Description = "Silky smooth 38% cocoa milk chocolate pralines crafted with Swiss cocoa butter.",
                DescriptionAr = "ناعمة على الطريقة البلجيكية الفاخرة",
                Price = 35.00m,
                Category = "Luxury Chocolates",
                ImageUrl = "/assets/products/milk-chocolate.jpg",
                Weight = "350g",
                Tag = "bestseller",
                IsAvailable = true,
                CreatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                UpdatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            },
            new Product
            {
                Id = 16,
                Name = "Dark Chocolate Box 70%",
                NameAr = "علبة شوكولاتة داكنة 70%",
                Description = "Intense single-origin Ecuadorian dark chocolate bonbons with roasted cocoa nib sprinkles.",
                DescriptionAr = "70% كاكاو، نكهة مركزة لعشاق الشوكولاتة الداكنة",
                Price = 38.00m,
                Category = "Luxury Chocolates",
                ImageUrl = "/assets/products/dark-chocolate.jpg",
                Weight = "350g",
                Tag = "signature",
                IsAvailable = true,
                CreatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                UpdatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            },
            new Product
            {
                Id = 17,
                Name = "Filled Chocolates Luxury Box",
                NameAr = "علبة شوكولاتة محشوة مشكلة",
                Description = "Assorted artisan pralines with pistachio cream, salted caramel, hazelnut gianduja, and espresso ganache.",
                DescriptionAr = "حشوات فاخرة مشكلة بالفستق والكراميل والبندق",
                Price = 55.00m,
                Category = "Luxury Chocolates",
                ImageUrl = "/assets/products/filled-chocolates.jpg",
                Weight = "500g",
                Tag = "bestseller",
                IsAvailable = true,
                CreatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                UpdatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            },
            new Product
            {
                Id = 18,
                Name = "Stuffed Dates Premium Box",
                NameAr = "علبة تمر فاخر محشو",
                Description = "Select Medjool and Khalas dates generously stuffed with roasted almonds, walnuts, and candied orange peel.",
                DescriptionAr = "تمر فاخر محشو بالمكسرات واللوز المحمص",
                Price = 48.00m,
                Category = "Dates & Confections",
                ImageUrl = "/assets/products/stuffed-dates.jpg",
                Weight = "450g",
                Tag = "traditional",
                IsAvailable = true,
                CreatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                UpdatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            },
            new Product
            {
                Id = 19,
                Name = "Chocolate Dipped Dates Box",
                NameAr = "علبة تمر مغطى بالشوكولاتة",
                Description = "Succulent dates stuffed with roasted pistachio and enrobed in dark Belgian chocolate.",
                DescriptionAr = "تمر نخب أول مغطى بالشوكولاتة البلجيكية الفاخرة",
                Price = 52.00m,
                Category = "Dates & Confections",
                ImageUrl = "/assets/products/chocolate-dates.jpg",
                Weight = "500g",
                Tag = "signature",
                IsAvailable = true,
                CreatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                UpdatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            }
        );
    }
}
