// using Microsoft.AspNetCore.Mvc;
// using Microsoft.EntityFrameworkCore;
// using SurveyService.Data;
// using SurveyService.Entities;

// namespace ProductService.Controllers
// {
//     //for add new product
//     [ApiController]
//     [Route("[controller]")]
//     public class ProductServiceController : ControllerBase
//     {

//         private readonly SurveyServiceDbContext _context;

//         public ProductServiceController(SurveyServiceDbContext context)
//         {
//             _context = context;
//         }   

//         // Get all
//         [HttpGet]
//         public async Task<ActionResult<IEnumerable<productItem>>> GetSurveyDetails()
//         {
//             var products = await _context.productItems.ToListAsync(); // Fetch all survey items from the database
//             return Ok(products); // Return the survey items
//         }

//         // Get by id
//         [HttpGet("{id}")]
//         public async Task<ActionResult<productItem>> GetSurveyDetail(int id)
//         {
//             var product = await _context.productItems.FindAsync(id); // Find the survey by ID

//             if (product == null)
//             {
//                 return NotFound(); // error 404 
//             }

//             return Ok(product); // Return the survey
//         }

//         // Create
//         [HttpPost]
//         public async Task<ActionResult<productItem>> CreateSurveyDetail(productItem newProductItem)
//         {
//             _context.productItems.Add(newProductItem); // Add new survey to the database
//             await _context.SaveChangesAsync(); // Save changes

//             return CreatedAtAction(nameof(GetSurveyDetail), new { id = newProductItem.Id }, newProductItem); // Return the created survey with a 201 status code
//         } 

//         // Helper method to check if a survey exists
//         private bool SurveyItemExists(int id)
//         {
//             return _context.productItems.Any(e => e.Id == id);
//         }

//     }
// }
