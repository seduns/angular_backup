using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SurveyService.Data;
using SurveyService.Entities;

namespace SurveyService.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class SurveyServiceController : ControllerBase
    {

        private readonly SurveyServiceDbContext _context;

        public SurveyServiceController(SurveyServiceDbContext context)
        {
            _context = context;
        }

        // Get all
        [HttpGet]
        public async Task<ActionResult<IEnumerable<surveyItem>>> GetSurveyDetails()
        {
            var surveys = await _context.surveyItems.ToListAsync(); // Fetch all survey items from the database
            return Ok(surveys); // Return the survey items
        }

        // Get by id
        [HttpGet("{id}")]
        public async Task<ActionResult<surveyItem>> GetSurveyDetail(int id)
        {
            var survey = await _context.surveyItems.FindAsync(id); // Find the survey by ID

            if (survey == null)
            {
                return NotFound(); // error 404 
            }

            return Ok(survey); // Return the survey
        }

        // Update
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSurveyDetail(int id, surveyItem updatedSurveyItem)
        {
            if (id != updatedSurveyItem.Id)
            {
                return BadRequest("Survey ID mismatch"); // Ensure the ID matches the object
            }

            _context.Entry(updatedSurveyItem).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync(); // Save the changes
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SurveyItemExists(id)) // Check if the item exists
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // Create
        [HttpPost]
        public async Task<ActionResult<surveyItem>> CreateSurveyDetail(surveyItem newSurveyItem)
        {
            _context.surveyItems.Add(newSurveyItem); // Add new survey to the database
            await _context.SaveChangesAsync(); // Save changes

            return CreatedAtAction(nameof(GetSurveyDetail), new { id = newSurveyItem.Id }, newSurveyItem); // Return the created survey with a 201 status code
        }

        // Delete by Id 
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSurveyDetail(int id)
        {
            var survey = await _context.surveyItems.FindAsync(id);
            if (survey == null)
            {
                return NotFound();
            }

            _context.surveyItems.Remove(survey); // Remove the survey from the database
            await _context.SaveChangesAsync(); // Save changes

            return NoContent();
        }

        // Delete multiple surveys by IDs
        [HttpPost("delete-multiple")]
        public async Task<IActionResult> DeleteMultipleSurveys([FromBody] int[] ids)
        {
            var surveysToDelete = await _context.surveyItems
                                                .Where(survey => ids.Contains(survey.Id))
                                                .ToListAsync();

            if (!surveysToDelete.Any())
            {
                return NotFound("No surveys found for the provided IDs.");
            }

            _context.surveyItems.RemoveRange(surveysToDelete); // Delete all matching surveys
            await _context.SaveChangesAsync(); // Save changes

            return NoContent(); // Return a success status
        }


        // Helper method to check if a survey exists
        private bool SurveyItemExists(int id)
        {
            return _context.surveyItems.Any(e => e.Id == id);
        }
    }

    //ALL PRODUCT

    [ApiController]
    [Route("[controller]")]
    public class AllProductController : ControllerBase
    {

        private readonly SurveyServiceDbContext _context;

        public AllProductController(SurveyServiceDbContext context)
        {
            _context = context;
        }

        // Get all
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AllProduct>>> GetProductDetails()
        {
            var product = await _context.AllProducts.ToListAsync(); // Fetch all survey items from the database
            return Ok(product); // Return the survey items
        }

        // Get by id
        [HttpGet("{id}")]
        public async Task<ActionResult<AllProduct>> GetProductDetail(int id)
        {
            var product = await _context.AllProducts.FindAsync(id); // Find the survey by ID

            if (product == null)
            {
                return NotFound(); // error 404 
            }

            return Ok(product); // Return the survey
        }

        // Update
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProductDetail(int id, AllProduct updatedProductItem)
        {
            if (id != updatedProductItem.prodId)
            {
                return BadRequest("Product ID mismatch"); // Ensure the ID matches the object
            }

            _context.Entry(updatedProductItem).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync(); // Save the changes
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProductItemExists(id)) // Check if the item exists
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // Create
        [HttpPost]
        public async Task<ActionResult<AllProduct>> CreateProductDetail(AllProduct newProductItem)
        {
            _context.AllProducts.Add(newProductItem); // Add new survey to the database
            await _context.SaveChangesAsync(); // Save changes

            return CreatedAtAction(nameof(GetProductDetail), new { id = newProductItem.prodId }, newProductItem); // Return the created survey with a 201 status code
        }

        // Delete by prodId 
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProductDetail(int id)
        {
            var product = await _context.AllProducts.FindAsync(id);
            if (product == null)
            {
                return NotFound();
            }

            _context.AllProducts.Remove(product); // Remove the product from the database
            await _context.SaveChangesAsync(); // Save changes

            return NoContent();
        }

        // Delete multiple products by IDs
        [HttpPost("delete-multiple")]
        public async Task<IActionResult> DeleteMultipleProducts([FromBody] int[] ids)
        {
            var productsToDelete = await _context.AllProducts
                                                .Where(product => ids.Contains(product.prodId))
                                                .ToListAsync();

            if (!productsToDelete.Any())
            {
                return NotFound("No product found for the provided IDs.");
            }

            _context.AllProducts.RemoveRange(productsToDelete); // Delete all matching surveys
            await _context.SaveChangesAsync(); // Save changes

            return NoContent(); // Return a success status
        }


        // Helper method to check if a survey exists
        private bool ProductItemExists(int id)
        {
            return _context.AllProducts.Any(e => e.prodId == id);
        }
    }

   



}
