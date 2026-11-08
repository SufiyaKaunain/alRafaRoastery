using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AlRafaApi.Data;
using AlRafaApi.Models;

namespace AlRafaApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly AppDbContext _context;

    public CategoriesController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/categories
    [HttpGet]
    public async Task<ActionResult<IEnumerable<object>>> GetCategories()
    {
        var categories = await _context.Categories
            .OrderBy(c => c.category_name)
            .ToListAsync();

        // Also get product count per category
        var productCounts = await _context.Products
            .Where(p => !string.IsNullOrEmpty(p.Category))
            .GroupBy(p => p.Category)
            .Select(g => new { CategoryName = g.Key, Count = g.Count() })
            .ToDictionaryAsync(x => x.CategoryName, x => x.Count, StringComparer.OrdinalIgnoreCase);

        var result = categories.Select(c => new
        {
            category_Id = c.category_Id,
            category_name = c.category_name,
            category_nameAr = c.category_nameAr,
            name = c.category_name,
            count = productCounts.ContainsKey(c.category_name) ? productCounts[c.category_name] : 0,
            created_at = c.CreatedAt
        });

        return Ok(result);
    }

    // GET: api/categories/5
    [HttpGet("{id}")]
    public async Task<ActionResult<object>> GetCategory(int id)
    {
        var category = await _context.Categories.FindAsync(id);
        if (category == null)
            return NotFound(new { message = $"Category with ID {id} not found." });

        var count = await _context.Products
            .CountAsync(p => p.Category == category.category_name || p.category_Id == category.category_Id);

        return Ok(new
        {
            category_Id = category.category_Id,
            category_name = category.category_name,
            category_nameAr = category.category_nameAr,
            name = category.category_name,
            count = count,
            created_at = category.CreatedAt
        });
    }

    // POST: api/categories
    [HttpPost]
    public async Task<ActionResult<Category>> CreateCategory(Category category)
    {
        var name = (category.category_name ?? category.Category_Name ?? string.Empty).Trim();
        if (string.IsNullOrWhiteSpace(name))
        {
            return BadRequest(new { message = "Category name (category_name) is required." });
        }

        // Check for duplicates (case-insensitive)
        var exists = await _context.Categories
            .AnyAsync(c => c.category_name.ToLower() == name.ToLower());
        if (exists)
        {
            return Conflict(new { message = $"Category '{name}' already exists." });
        }

        category.category_Id = 0;
        category.category_name = name;
        if (!string.IsNullOrWhiteSpace(category.category_nameAr))
            category.category_nameAr = category.category_nameAr.Trim();
        category.CreatedAt = DateTime.UtcNow;

        _context.Categories.Add(category);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetCategory), new { id = category.category_Id }, category);
    }

    // PUT: api/categories/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCategory(int id, Category category)
    {
        var existing = await _context.Categories.FindAsync(id);
        if (existing == null)
            return NotFound(new { message = $"Category #{id} not found." });

        var newName = (category.category_name ?? category.Category_Name ?? string.Empty).Trim();
        if (string.IsNullOrWhiteSpace(newName))
            return BadRequest(new { message = "Category name cannot be empty." });

        // Check duplicate name on another category
        var duplicate = await _context.Categories
            .AnyAsync(c => c.category_Id != id && c.category_name.ToLower() == newName.ToLower());
        if (duplicate)
        {
            return Conflict(new { message = $"Another category named '{newName}' already exists." });
        }

        var oldName = existing.category_name;
        existing.category_name = newName;
        existing.category_nameAr = !string.IsNullOrWhiteSpace(category.category_nameAr)
            ? category.category_nameAr.Trim()
            : existing.category_nameAr;

        // Also update products that referenced the old name
        if (!string.Equals(oldName, newName, StringComparison.OrdinalIgnoreCase))
        {
            var affectedProducts = await _context.Products
                .Where(p => p.Category == oldName || p.category_Id == id)
                .ToListAsync();

            foreach (var prod in affectedProducts)
            {
                prod.Category = newName;
                prod.category_Id = id;
            }
        }

        await _context.SaveChangesAsync();
        return Ok(new
        {
            category_Id = existing.category_Id,
            category_name = existing.category_name,
            category_nameAr = existing.category_nameAr,
            name = existing.category_name,
            created_at = existing.CreatedAt
        });
    }

    // DELETE: api/categories/5?deleteProducts=true
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCategory(
        int id,
        [FromQuery] bool deleteProducts = false,
        [FromQuery] bool? delete_products = null,
        [FromQuery] string? cascade = null)
    {
        var category = await _context.Categories.FindAsync(id);
        if (category == null)
            return NotFound(new { message = $"Category #{id} not found." });

        bool shouldDelete = deleteProducts
            || (delete_products.HasValue && delete_products.Value)
            || string.Equals(cascade, "true", StringComparison.OrdinalIgnoreCase);

        var catName = (category.category_name ?? string.Empty).Trim().ToLower();
        var catNameAr = (category.category_nameAr ?? string.Empty).Trim().ToLower();

        // Find products belonging to this category (match category_Id OR English/Arabic name case-insensitively)
        var allProducts = await _context.Products.ToListAsync();
        var productsUsingCategory = allProducts.Where(p =>
            p.category_Id == id ||
            (!string.IsNullOrEmpty(p.Category) && (
                p.Category.Trim().Equals(catName, StringComparison.OrdinalIgnoreCase) ||
                (catNameAr != "" && p.Category.Trim().Equals(catNameAr, StringComparison.OrdinalIgnoreCase))
            ))
        ).ToList();

        int affectedCount = productsUsingCategory.Count;

        if (shouldDelete && affectedCount > 0)
        {
            // Permanently delete all products under this category
            _context.Products.RemoveRange(productsUsingCategory);
        }
        else
        {
            // Unlink products safely from this category
            foreach (var p in productsUsingCategory)
            {
                p.category_Id = null;
                p.Category = string.Empty;
            }
        }

        _context.Categories.Remove(category);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = shouldDelete
                ? $"Category '{category.category_name}' and {affectedCount} product(s) were deleted."
                : $"Category '{category.category_name}' was deleted and {affectedCount} product(s) were unlinked.",
            deletedProducts = shouldDelete,
            productsAffected = affectedCount
        });
    }
}

