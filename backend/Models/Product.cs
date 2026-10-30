using System.ComponentModel.DataAnnotations;

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

    [MaxLength(100)]
    public string Category { get; set; } = string.Empty;

    [MaxLength(2000)]
    public string ImageUrl { get; set; } = string.Empty;

    [MaxLength(50)]
    public string Weight { get; set; } = string.Empty;

    [MaxLength(50)]
    public string Tag { get; set; } = string.Empty;

    public bool IsAvailable { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
