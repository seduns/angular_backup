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
            // Validate input (optional but recommended)
            if (newSurveyItem == null)
            {
                return BadRequest("Survey item cannot be null.");
            }

            // Map the input to a new SurveyItems entity
            var surveyItem = new surveyItem
            {
                Name = newSurveyItem.Name,
                EmailAddress = newSurveyItem.EmailAddress,
                phoneNumber = newSurveyItem.phoneNumber,
                Comment = newSurveyItem.Comment,
                FinancingType = newSurveyItem.FinancingType,
                StarRating = newSurveyItem.StarRating,
                SubmissionDate = DateTime.Now, // Auto-generate submission date
                prodId = newSurveyItem.prodId // Assign Foreign Key (if applicable)
            };

            // Add the survey item to the database
            _context.surveyItems.Add(surveyItem);
            await _context.SaveChangesAsync(); // Save changes to the database

            // Return the created survey with a 201 status code
            return CreatedAtAction(
                nameof(GetSurveyDetail), // Method to get a single survey detail
                new { id = surveyItem.Id }, // Route values for the created item
                surveyItem // The created survey item
            );
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

    //FILE

    [ApiController]
[Route("[controller]")]
public class FileItemController : ControllerBase
{
    private readonly SurveyServiceDbContext _context;

    public FileItemController(SurveyServiceDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<fileEntity>>> GetFileDetails()
    {
        var file = await _context.FileEntitys.ToListAsync(); // Fetch all survey items from the database
        return Ok(file); // Return the survey items
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<fileEntity>> GetFileDetail(int id)
    {
        var newFile = await _context.FileEntitys.FindAsync(id); // Find the survey by ID

        if (newFile == null)
        {
            return NotFound(); // error 404 
        }

        return Ok(newFile); // Return the survey
    }

    [HttpPost]
    public async Task<IActionResult> UploadFile([FromForm] IFormFile file, [FromForm] string fileName, [FromForm] string fileType)
    {
        if (file == null || file.Length == 0)
            return BadRequest("Invalid file.");

        // Ensure the file is a .txt file
        if (Path.GetExtension(file.FileName).ToLower() != ".txt")
            return BadRequest("Only .txt files are allowed.");

        using var reader = new StreamReader(file.OpenReadStream());
        var content = await reader.ReadToEndAsync();
        var EditBy = await reader.ReadToEndAsync();
        var ReasonChanges = await reader.ReadToEndAsync();
        var ChangesMade = await reader.ReadToEndAsync();

        // Create the FileEntity with additional data
        var fileEntity = new fileEntity
        {
            FileName = fileName,  // Use the passed file name
            FileType = fileType,  // Use the passed file type
            Content = content,
            EditBy = EditBy,
            ReasonChanges = ReasonChanges,
            ChangesMade = ChangesMade,
            UploadedAt = DateTime.Now, // Server-side date (can be overridden with uploadedAt)
            EditedDate = null // Server-side date (can be overridden with uploadedAt)
        };

        _context.FileEntitys.Add(fileEntity);
        await _context.SaveChangesAsync();

        return Ok("File uploaded and saved successfully.");
    }

  [HttpPut("{id}")]
public async Task<IActionResult> UpdateFile(int id, [FromBody] UpdateFileRequest updatedFile)
{
    try
    {
        // Validate input
        if (string.IsNullOrEmpty(updatedFile.Content))
        {
            return BadRequest("File content cannot be empty.");
        }

        // Fetch the existing file entity
        var existingFile = await _context.FileEntitys.FindAsync(id);

        if (existingFile == null)
        {
            return NotFound($"File with ID {id} not found.");
        }

        // Update the file properties
        existingFile.Content = updatedFile.Content;
        existingFile.EditBy = updatedFile.EditBy;
        existingFile.ReasonChanges = updatedFile.ReasonChanges;
        existingFile.ChangesMade = updatedFile.ChangesMade;
        existingFile.EditedDate = DateTime.Now; // Update the timestamp

        // Save changes to the database
        _context.FileEntitys.Update(existingFile);
        await _context.SaveChangesAsync();

        return Ok(new { message = "File updated successfully." });
    }
    catch (Exception ex)
    {
        // Log the exception details (you can use a logger instead of Console.WriteLine)
        Console.WriteLine($"Error updating file with ID {id}: {ex.Message}");
        return StatusCode(500, "An error occurred while updating the file.");
    }
}

// DTO for the update request
public class UpdateFileRequest
{
    public string Content { get; set; }
    public string EditBy { get; set; }
    public string ReasonChanges { get; set; }
    public string ChangesMade { get; set; }
}



    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProductDetail(int id)
    {
        var file = await _context.FileEntitys.FindAsync(id);
        if (file == null)
        {
            return NotFound();
        }

        _context.FileEntitys.Remove(file); // Remove the file from the database
        await _context.SaveChangesAsync(); // Save changes

        return NoContent();
    }
}

    

   



}
