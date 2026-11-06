using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AlRafaApi.Data;
using AlRafaApi.Models;

namespace AlRafaApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly AppDbContext _context;

    public ProductsController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/products
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Product>>> GetProducts(
        [FromQuery] string? category,
        [FromQuery] string? search,
        [FromQuery] string? sortBy)
    {
        var query = _context.Products.AsQueryable();

        if (!string.IsNullOrWhiteSpace(category) && !category.Equals("ALL", StringComparison.OrdinalIgnoreCase))
        {
            query = query.Where(p => p.Category == category);
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            var s = search.Trim().ToLower();
            query = query.Where(p =>
                p.Name.ToLower().Contains(s) ||
                p.NameAr.Contains(s) ||
                p.Description.ToLower().Contains(s) ||
                p.Category.ToLower().Contains(s));
        }

        query = sortBy switch
        {
            "price-asc" => query.OrderBy(p => p.Price),
            "price-desc" => query.OrderByDescending(p => p.Price),
            "newest" => query.OrderByDescending(p => p.CreatedAt),
            _ => query.OrderByDescending(p => p.Tag == "bestseller" || p.Tag == "popular" || p.Highlight == "bestseller" || p.Highlight == "popular")
                      .ThenByDescending(p => p.CreatedAt)
        };

        var list = await query.ToListAsync();
        foreach (var p in list)
        {
            p.NormalizeFields();
        }
        return list;
    }

    // GET: api/products/categories
    [HttpGet("categories")]
    public async Task<ActionResult<IEnumerable<object>>> GetCategories()
    {
        var categories = await _context.Products
            .Where(p => !string.IsNullOrEmpty(p.Category))
            .GroupBy(p => p.Category)
            .Select(g => new
            {
                name = g.Key,
                count = g.Count()
            })
            .OrderBy(c => c.name)
            .ToListAsync();

        return Ok(categories);
    }

    // GET: api/products/5
    [HttpGet("{id}", Name = "GetProduct")]
    public async Task<ActionResult<Product>> GetProduct(int id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null)
            return NotFound();

        product.NormalizeFields();
        return product;
    }

    // POST: api/products/upload
    [Authorize]
    [HttpPost("upload")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> UploadImage([FromForm] IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest(new { message = "No image file provided." });

        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".webp", ".svg", ".gif" };
        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!allowedExtensions.Contains(extension))
            return BadRequest(new { message = "Invalid file type. Allowed formats: JPG, PNG, WEBP, SVG, GIF." });

        if (file.Length > 10 * 1024 * 1024)
            return BadRequest(new { message = "File size cannot exceed 10MB." });

        var safeFileName = $"{Guid.NewGuid():N}{extension}";

        var webRoot = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
        var productsDir = Path.Combine(webRoot, "assets", "products");
        Directory.CreateDirectory(productsDir);

        var filePath = Path.Combine(productsDir, safeFileName);
        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        // Also sync locally to frontend-admin and frontend public directories if present
        try
        {
            var baseDir = Directory.GetCurrentDirectory();
            var parentDir = Directory.GetParent(baseDir)?.FullName;
            if (parentDir != null)
            {
                var adminAssets = Path.Combine(parentDir, "frontend-admin", "public", "assets", "products");
                if (Directory.Exists(adminAssets))
                {
                    System.IO.File.Copy(filePath, Path.Combine(adminAssets, safeFileName), true);
                }

                var frontAssets = Path.Combine(parentDir, "frontend", "public", "assets", "products");
                if (Directory.Exists(frontAssets))
                {
                    System.IO.File.Copy(filePath, Path.Combine(frontAssets, safeFileName), true);
                }
            }
        }
        catch { /* Non-critical if running in isolated container */ }

        var request = HttpContext.Request;
        var baseUrl = $"{request.Scheme}://{request.Host}";
        var fullUrl = $"{baseUrl}/assets/products/{safeFileName}";
        var relativeUrl = $"/assets/products/{safeFileName}";

        return Ok(new
        {
            url = fullUrl,
            relativeUrl = relativeUrl,
            fileName = safeFileName
        });
    }

    // POST: api/products
    [Authorize]
    [HttpPost]
    public async Task<ActionResult<Product>> CreateProduct(Product product)
    {
        try
        {
            product.Id = 0;
            product.NormalizeFields();
            product.CreatedAt = DateTime.UtcNow;
            product.UpdatedAt = DateTime.UtcNow;

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            product.NormalizeFields();
            return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, product);
        }
        catch (DbUpdateException ex)
        {
            // If primary key collision occurs due to out-of-sync sequence from seeded data:
            try
            {
                await _context.Database.ExecuteSqlRawAsync(@"
                    SELECT setval(pg_get_serial_sequence('""Products""', 'Id'), COALESCE((SELECT MAX(""Id"") FROM ""Products""), 1), true);
                ");
                product.NormalizeFields();
                await _context.SaveChangesAsync();
                return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, product);
            }
            catch (Exception innerEx)
            {
                return StatusCode(500, new { message = "Database error while saving product: " + (innerEx.InnerException?.Message ?? innerEx.Message ?? ex.Message) });
            }
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Failed to create product: " + ex.Message });
        }
    }

    // PUT: api/products/5
    [Authorize]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateProduct(int id, Product product)
    {
        if (product.Id == 0) product.Id = id;
        if (id != product.Id)
            return BadRequest(new { message = "Product ID mismatch." });

        var existing = await _context.Products.FindAsync(id);
        if (existing == null)
            return NotFound(new { message = $"Product #{id} not found." });

        product.NormalizeFields();

        existing.Name = product.Name?.Trim() ?? string.Empty;
        existing.NameAr = product.NameAr?.Trim() ?? string.Empty;
        existing.Description = product.Description?.Trim() ?? string.Empty;
        existing.DescriptionAr = product.DescriptionAr?.Trim() ?? string.Empty;
        existing.Category = product.Category?.Trim() ?? string.Empty;
        existing.Price = product.Price;
        existing.OriginalPrice = product.OriginalPrice;
        existing.StockQuantity = product.StockQuantity;
        existing.Weight = product.Weight ?? string.Empty;
        existing.ProdVarients_Pricing = product.ProdVarients_Pricing ?? string.Empty;
        existing.WeightPrices = product.WeightPrices ?? string.Empty;
        existing.ProdImg = product.ProdImg ?? string.Empty;
        existing.ImageUrl = product.ImageUrl ?? string.Empty;
        existing.Highlight = product.Highlight ?? string.Empty;
        existing.Tag = product.Tag ?? string.Empty;
        existing.IsAvailable = product.IsAvailable;
        existing.UpdatedAt = DateTime.UtcNow;

        existing.NormalizeFields();

        await _context.SaveChangesAsync();

        return Ok(existing);
    }

    // DELETE: api/products/5
    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProduct(int id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null)
            return NotFound();

        _context.Products.Remove(product);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
