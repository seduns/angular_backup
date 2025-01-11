using ChatbotAPI_1.Models;
using ChatbotAPI_2.Models;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

[ApiController]
[Route("api/scraper")]
public class ScraperController : ControllerBase
{
    private readonly string _jsonFilePath_1 = "./Resources/brickData.json"; // Path to your JSON file
    private readonly string _jsonFilePath_2 = "./Resources/PFData.json"; // Path to your JSON file
    private readonly string _txtFilePath = "./Resources/brickData.txt"; // Path to your JSON file

    [HttpGet]
     public IActionResult GetProducts()
        {
            try
            {
                // Check if the JSON file exists
                if (System.IO.File.Exists(_jsonFilePath_1))
                {
                    // Read the JSON file content
                    var jsonData = System.IO.File.ReadAllText(_jsonFilePath_1);

                    // Deserialize the JSON content into a Root object
                    var rootObject = JsonSerializer.Deserialize<Root>(jsonData, new JsonSerializerOptions
                    {
                        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                        WriteIndented = true
                    });

                    return Ok(rootObject); // Return the deserialized object as JSON
                }
                else
                {
                    return NotFound("JSON file not found.");
                }
            }
            catch (JsonException ex)
            {
                return BadRequest($"JSON Deserialization error: {ex.Message}");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("notes")]
        public IActionResult GetNotes()
        {
            try
            {
                // Check if the TXT file exists
                if (System.IO.File.Exists(_txtFilePath))
                {
                    // Read the TXT file content
                    var textData = System.IO.File.ReadAllText(_txtFilePath);

                    return Ok(textData); // Return the text content
                }
                else
                {
                    return NotFound("TXT file not found.");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        

       
}
