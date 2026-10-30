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
    public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
    {
        return await _context.Products
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();
    }

    // GET: api/products/5
    [HttpGet("{id}", Name = "GetProduct")]
    public async Task<ActionResult<Product>> GetProduct(int id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null)
            return NotFound();

        return product;
    }

    // POST: api/products
    [Authorize]
    [HttpPost]
    public async Task<ActionResult<Product>> CreateProduct(Product product)
    {
        try
        {
            product.Id = 0;
            product.CreatedAt = DateTime.UtcNow;
            product.UpdatedAt = DateTime.UtcNow;

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

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
        if (id != product.Id)
            return BadRequest();

        var existing = await _context.Products.FindAsync(id);
        if (existing == null)
            return NotFound();

        existing.Name = product.Name;
        existing.NameAr = product.NameAr;
        existing.Description = product.Description;
        existing.DescriptionAr = product.DescriptionAr;
        existing.Price = product.Price;
        existing.Category = product.Category;
        existing.ImageUrl = product.ImageUrl;
        existing.Weight = product.Weight;
        existing.Tag = product.Tag;
        existing.IsAvailable = product.IsAvailable;
        existing.UpdatedAt = DateTime.UtcNow;

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
