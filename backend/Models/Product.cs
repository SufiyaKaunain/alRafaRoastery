using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace AlRafaApi.Models;

public class Product
{
    public int Id { get; set; }

    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(200)]
    public string NameAr { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string Description { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string DescriptionAr { get; set; } = string.Empty;

    [Required]
    public decimal Price { get; set; }

    public decimal? OriginalPrice { get; set; }

    public int StockQuantity { get; set; } = 0;

    [MaxLength(100)]
    public string Category { get; set; } = string.Empty;

    [Column("category_Id")]
    [JsonPropertyName("category_Id")]
    public int? category_Id { get; set; }

    [NotMapped]
    [JsonIgnore]
    public int? Category_Id
    {
        get => category_Id;
        set => category_Id = value;
    }

    [MaxLength(2000)]
    public string ImageUrl { get; set; } = string.Empty;

    [MaxLength(2000)]
    public string ProdImg { get; set; } = string.Empty;

    [MaxLength(500)]
    public string Weight { get; set; } = string.Empty;

    [MaxLength(8000)]
    public string WeightPrices { get; set; } = string.Empty;

    [MaxLength(8000)]
    public string ProdVarients_Pricing { get; set; } = string.Empty;

    [NotMapped]
    [JsonIgnore]
    public string ProdVariants_Pricing
    {
        get => ProdVarients_Pricing;
        set { if (!string.IsNullOrWhiteSpace(value)) ProdVarients_Pricing = value; }
    }

    [MaxLength(100)]
    public string Tag { get; set; } = string.Empty;

    [MaxLength(100)]
    public string Highlight { get; set; } = string.Empty;

    public bool IsAvailable { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Normalizes and synchronizes field values between user-requested names and roastery schema.
    /// Ensures Name, NameAr, Category, ProdVarients_Pricing, ProdImg, Highlight, Description, DescriptionAr are always populated.
    /// </summary>
    public void NormalizeFields()
    {
        // 1. Image synchronization
        if (!string.IsNullOrWhiteSpace(ProdImg))
        {
            ImageUrl = ProdImg.Trim();
        }
        else if (!string.IsNullOrWhiteSpace(ImageUrl))
        {
            ProdImg = ImageUrl.Trim();
        }

        // 2. Highlight synchronization
        if (!string.IsNullOrWhiteSpace(Highlight))
        {
            Tag = Highlight.Trim();
        }
        else if (!string.IsNullOrWhiteSpace(Tag))
        {
            Highlight = Tag.Trim();
        }

        // 3. Variants & Pricing synchronization
        if (!string.IsNullOrWhiteSpace(ProdVarients_Pricing))
        {
            WeightPrices = ProdVarients_Pricing.Trim();
        }
        else if (!string.IsNullOrWhiteSpace(WeightPrices))
        {
            ProdVarients_Pricing = WeightPrices.Trim();
        }

        // 4. Auto-derive Price, OriginalPrice, StockQuantity, Weight if variants JSON is available
        var variantsJson = !string.IsNullOrWhiteSpace(ProdVarients_Pricing) ? ProdVarients_Pricing : WeightPrices;
        if (!string.IsNullOrWhiteSpace(variantsJson))
        {
            try
            {
                using var doc = System.Text.Json.JsonDocument.Parse(variantsJson);
                if (doc.RootElement.ValueKind == System.Text.Json.JsonValueKind.Array)
                {
                    var items = doc.RootElement.EnumerateArray().ToList();
                    if (items.Count > 0)
                    {
                        var weights = new List<string>();
                        decimal firstSellingPrice = 0m;
                        decimal? firstOrigPrice = null;
                        int totalStock = 0;

                        for (int i = 0; i < items.Count; i++)
                        {
                            var item = items[i];
                            string w = string.Empty;
                            if (item.TryGetProperty("size", out var sp) && sp.ValueKind == System.Text.Json.JsonValueKind.String)
                                w = sp.GetString() ?? "";
                            else if (item.TryGetProperty("weight", out var wp) && wp.ValueKind == System.Text.Json.JsonValueKind.String)
                                w = wp.GetString() ?? "";

                            if (!string.IsNullOrWhiteSpace(w))
                                weights.Add(w.Trim());

                            decimal priceVal = 0m;
                            if (item.TryGetProperty("sellingPrice", out var spp) && (spp.ValueKind == System.Text.Json.JsonValueKind.Number || spp.ValueKind == System.Text.Json.JsonValueKind.String))
                            {
                                if (spp.ValueKind == System.Text.Json.JsonValueKind.Number) priceVal = spp.GetDecimal();
                                else if (decimal.TryParse(spp.GetString(), out var dp)) priceVal = dp;
                            }
                            else if (item.TryGetProperty("price", out var pp) && (pp.ValueKind == System.Text.Json.JsonValueKind.Number || pp.ValueKind == System.Text.Json.JsonValueKind.String))
                            {
                                if (pp.ValueKind == System.Text.Json.JsonValueKind.Number) priceVal = pp.GetDecimal();
                                else if (decimal.TryParse(pp.GetString(), out var dp)) priceVal = dp;
                            }

                            if (i == 0 && priceVal > 0)
                            {
                                firstSellingPrice = priceVal;
                            }

                            if (i == 0 && item.TryGetProperty("originalPrice", out var opp) && opp.ValueKind != System.Text.Json.JsonValueKind.Null)
                            {
                                if (opp.ValueKind == System.Text.Json.JsonValueKind.Number) firstOrigPrice = opp.GetDecimal();
                                else if (opp.ValueKind == System.Text.Json.JsonValueKind.String && decimal.TryParse(opp.GetString(), out var dop)) firstOrigPrice = dop;
                            }

                            int stockVal = 0;
                            if (item.TryGetProperty("stockQuantity", out var sqp) && (sqp.ValueKind == System.Text.Json.JsonValueKind.Number || sqp.ValueKind == System.Text.Json.JsonValueKind.String))
                            {
                                if (sqp.ValueKind == System.Text.Json.JsonValueKind.Number) stockVal = sqp.GetInt32();
                                else if (int.TryParse(sqp.GetString(), out var parsedStock)) stockVal = parsedStock;
                            }
                            else if (item.TryGetProperty("stock", out var stp) && (stp.ValueKind == System.Text.Json.JsonValueKind.Number || stp.ValueKind == System.Text.Json.JsonValueKind.String))
                            {
                                if (stp.ValueKind == System.Text.Json.JsonValueKind.Number) stockVal = stp.GetInt32();
                                else if (int.TryParse(stp.GetString(), out var parsedStock)) stockVal = parsedStock;
                            }
                            totalStock += stockVal;
                        }

                        if (firstSellingPrice > 0)
                        {
                            Price = firstSellingPrice;
                        }
                        if (firstOrigPrice.HasValue)
                        {
                            OriginalPrice = firstOrigPrice;
                        }
                        if (totalStock > 0 || StockQuantity == 0)
                        {
                            StockQuantity = totalStock;
                        }
                        if (weights.Count > 0)
                        {
                            Weight = string.Join(", ", weights);
                        }
                    }
                }
            }
            catch { /* Keep existing values if custom format */ }
        }
    }
}
