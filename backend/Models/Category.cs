using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace AlRafaApi.Models;

[Table("Categories")]
public class Category
{
    [Key]
    [Column("category_Id")]
    [JsonPropertyName("category_Id")]
    public int category_Id { get; set; }

    [Required]
    [MaxLength(150)]
    [Column("category_name")]
    [JsonPropertyName("category_name")]
    public string category_name { get; set; } = string.Empty;

    [MaxLength(150)]
    [Column("category_nameAr")]
    [JsonPropertyName("category_nameAr")]
    public string? category_nameAr { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Casing aliases for compatibility with both PascalCase and lowercase
    [NotMapped]
    [JsonIgnore]
    public int Category_Id
    {
        get => category_Id;
        set => category_Id = value;
    }

    [NotMapped]
    [JsonIgnore]
    public string Category_Name
    {
        get => category_name;
        set => category_name = value ?? string.Empty;
    }
}

