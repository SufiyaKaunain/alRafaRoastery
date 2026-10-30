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
                Name = "Spanish Latte",
                NameAr = "سبانيش لاتيه",
                Description = "Espresso, fresh milk & sweet condensed milk, served over ice or hot.",
                DescriptionAr = "إسبريسو وحليب وحليب مكثف محلى",
                Price = 22.00m,
                Category = "Specialty Drinks",
                ImageUrl = "/assets/products/spanish-latte.jpg",
                Weight = "Single Cup",
                Tag = "bestseller",
                IsAvailable = true,
                CreatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                UpdatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            },
            new Product
            {
                Id = 2,
                Name = "Pistachio Latte",
                NameAr = "بيستاشيو لاتيه",
                Description = "Signature espresso blended with artisanal roasted pistachio sauce.",
                DescriptionAr = "إسبريسو مع الفستق المحمص",
                Price = 26.00m,
                Category = "Specialty Drinks",
                ImageUrl = "/assets/products/pistachio-latte.jpg",
                Weight = "Single Cup",
                Tag = "bestseller",
                IsAvailable = true,
                CreatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                UpdatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            },
            new Product
            {
                Id = 3,
                Name = "Saffron Latte",
                NameAr = "لاتيه الزعفران",
                Description = "Rich espresso infused with genuine Persian saffron threads and creamy textured milk.",
                DescriptionAr = "إسبريسو منقوع بالزعفران",
                Price = 28.00m,
                Category = "Specialty Drinks",
                ImageUrl = "/assets/products/saffron-latte.jpg",
                Weight = "Single Cup",
                Tag = "popular",
                IsAvailable = true,
                CreatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                UpdatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            },
            new Product
            {
                Id = 4,
                Name = "Espresso",
                NameAr = "إسبريسو",
                Description = "Double shot of single-origin roast, intense body with golden hazelnut crema.",
                DescriptionAr = "جرعة مزدوجة بكريمة غنية",
                Price = 14.00m,
                Category = "Specialty Drinks",
                ImageUrl = "/assets/products/espresso.jpg",
                Weight = "60ml",
                Tag = "",
                IsAvailable = true,
                CreatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                UpdatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            },
            new Product
            {
                Id = 5,
                Name = "V60 Specialty Pour Over",
                NameAr = "في ٦٠ تقطير",
                Description = "Slow-brewed filter coffee extracted to highlight delicate fruit and floral notes.",
                DescriptionAr = "تقطير بطيء لقهوة مختصة",
                Price = 20.00m,
                Category = "Specialty Drinks",
                ImageUrl = "/assets/products/v60-pour-over.jpg",
                Weight = "250ml",
                Tag = "signature",
                IsAvailable = true,
                CreatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                UpdatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            },
            new Product
            {
                Id = 6,
                Name = "Espresso Beans 250g",
                NameAr = "بن إسبريسو 250غ",
                Description = "Dark roast espresso blend with notes of dark chocolate, brown sugar, and toasted hazelnuts.",
                DescriptionAr = "تحميص داكن بنكهة الشوكولاتة",
                Price = 45.00m,
                Category = "Coffee Beans",
                ImageUrl = "/assets/products/espresso-beans.jpg",
                Weight = "250g",
                Tag = "popular",
                IsAvailable = true,
                CreatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                UpdatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            },
            new Product
            {
                Id = 7,
                Name = "Arabic Coffee 250g",
                NameAr = "قهوة عربية 250غ",
                Description = "Traditional Emirati light roast infused with cardamom and saffron essence.",
                DescriptionAr = "بالهيل والزعفران، تحميص خفيف أصيل",
                Price = 38.00m,
                Category = "Coffee Beans",
                ImageUrl = "/assets/products/arabic-coffee.jpg",
                Weight = "250g",
                Tag = "traditional",
                IsAvailable = true,
                CreatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                UpdatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            },
            new Product
            {
                Id = 8,
                Name = "Turkish Coffee 250g",
                NameAr = "قهوة تركية 250غ",
                Description = "Extra-finely ground arabica roasted to perfection with aromatic green cardamom.",
                DescriptionAr = "مطحونة ناعماً على الطريقة التقليدية",
                Price = 32.00m,
                Category = "Coffee Beans",
                ImageUrl = "/assets/products/turkish-coffee.jpg",
                Weight = "250g",
                Tag = "",
                IsAvailable = true,
                CreatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                UpdatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            },
            new Product
            {
                Id = 9,
                Name = "Specialty House Blend 250g",
                NameAr = "خلطة مختصة 250غ",
                Description = "Our signature house roast combining Ethiopian Yirgacheffe and Colombian Supremo.",
                DescriptionAr = "خلطتنا المميزة الخاصة برأس الخيمة",
                Price = 55.00m,
                Category = "Coffee Beans",
                ImageUrl = "/assets/products/house-blend.jpg",
                Weight = "250g",
                Tag = "signature",
                IsAvailable = true,
                CreatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                UpdatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            },
            new Product
            {
                Id = 10,
                Name = "Cold Brew Bottle",
                NameAr = "قارورة كولد برو",
                Description = "Cold extracted for 18 hours in small batches, naturally sweet and low acidity.",
                DescriptionAr = "منقوعة 18 ساعة، باردة ومنعشة",
                Price = 18.00m,
                Category = "Coffee Beans",
                ImageUrl = "/assets/products/cold-brew.jpg",
                Weight = "300ml",
                Tag = "",
                IsAvailable = true,
                CreatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                UpdatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            },
            new Product
            {
                Id = 11,
                Name = "Roasted Pistachios 500g",
                NameAr = "فستق حلبي محمص 500غ",
                Description = "Jumbo California pistachios, gently hot-air roasted and dusted with natural sea salt.",
                DescriptionAr = "محمص ومملح بخفة وبجودة فاخرة",
                Price = 45.00m,
                Category = "Premium Nuts",
                ImageUrl = "/assets/products/roasted-pistachios.jpg",
                Weight = "500g",
                Tag = "bestseller",
                IsAvailable = true,
                CreatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                UpdatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            },
            new Product
            {
                Id = 12,
                Name = "Golden Roasted Almonds 500g",
                NameAr = "لوز محمص ذهبي 500غ",
                Description = "Crunchy whole roasted almonds with a smoky aroma and light crispiness.",
                DescriptionAr = "لوز محمص ذهبي مقرمش",
                Price = 38.00m,
                Category = "Premium Nuts",
                ImageUrl = "/assets/products/roasted-almonds.jpg",
                Weight = "500g",
                Tag = "",
                IsAvailable = true,
                CreatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                UpdatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            },
            new Product
            {
                Id = 13,
                Name = "Roasted Cashews 500g",
                NameAr = "كاجو محمص 500غ",
                Description = "Premium whole cashews dry roasted to a rich buttery crunch.",
                DescriptionAr = "حبات كاملة بتحميص زبدي فاخر",
                Price = 42.00m,
                Category = "Premium Nuts",
                ImageUrl = "/assets/products/roasted-cashews.jpg",
                Weight = "500g",
                Tag = "",
                IsAvailable = true,
                CreatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                UpdatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            },
            new Product
            {
                Id = 14,
                Name = "Mixed Roasted Nuts 500g",
                NameAr = "مكسرات مشكلة فاخرة 500غ",
                Description = "Our house blend of roasted pistachios, cashews, almonds, and pecans with secret spices.",
                DescriptionAr = "خلطتنا الفاخرة من أشهى المكسرات المحمصة",
                Price = 48.00m,
                Category = "Premium Nuts",
                ImageUrl = "/assets/products/mixed-nuts.jpg",
                Weight = "500g",
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
