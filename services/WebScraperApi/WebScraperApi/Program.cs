// //using HtmlAgilityPack;
// //using System;
// //using System.Linq;
// //using System.Net.Http;
// //using System.Threading.Tasks;

// //public class WebScraper
// //{
// //    public static async Task Main(string[] args)
// //    {
// //        var url = "https://en.wikipedia.org/wiki/OpenAi"; // URL to scrape
// //        var httpClient = new HttpClient();

// //        try
// //        {
// //            // Fetch the HTML content of the URL
// //            var html = await httpClient.GetStringAsync(url);

// //            // Load the HTML content into HtmlAgilityPack
// //            var htmlDocument = new HtmlDocument();
// //            htmlDocument.LoadHtml(html);

// //            // Find all <div> elements with a specific class
// //            var divs = htmlDocument.DocumentNode.Descendants("div")
// //                .Where(node => node.GetAttributeValue("class", "")
// //                .Contains("mw-parser-output")) // Adjust class name as needed
// //                .ToList();

// //            // Print the inner text of each matching <div>
// //            foreach (var div in divs)
// //            {
// //                Console.WriteLine(div.InnerText.Trim());
// //            }
// //        }
// //        catch (HttpRequestException e)
// //        {
// //            Console.WriteLine($"Request error: {e.Message}");
// //        }
// //        catch (Exception e)
// //        {
// //            Console.WriteLine($"An error occurred: {e.Message}");
// //        }
// //        finally
// //        {
// //            httpClient.Dispose();
// //        }

// //        // Pause the console to prevent it from closing immediately
// //        Console.WriteLine("Press any key to exit...");
// //        Console.ReadKey();
// //    }
// //}

// // using OpenQA.Selenium;
// // using OpenQA.Selenium.Chrome;
// // using OpenQA.Selenium.Support.UI;
// // using SeleniumExtras.WaitHelpers;
// // using System;

// // public class WebScraper
// // {
// //     public static void Main(string[] args)
// //     {
// //         // Set up ChromeDriver options
// //         var options = new ChromeOptions();
// //         options.AddArgument("--headless");
// //         options.AddArgument("--disable-gpu");
// //         options.AddArgument("--no-sandbox");

// //         using (var driver = new ChromeDriver(options))
// //         {
// //             try
// //             {
// //                 string url = "https://www.w3schools.com/";
// //                 driver.Navigate().GoToUrl(url);

// //                 // Wait for the page to fully load
// //                 var wait = new WebDriverWait(driver, TimeSpan.FromSeconds(10));
// //                 wait.Until(ExpectedConditions.ElementExists(By.TagName("body")));

// //                 // Find all elements in the body
// //                 var allElements = driver.FindElements(By.CssSelector("body *"));

// //                 Console.WriteLine($"Number of elements found: {allElements.Count}");

// //                 // Loop through each element and extract attributes
// //                 foreach (var element in allElements)
// //                 {
// //                     Console.WriteLine("Element: " + element.TagName);

// //                     // Get all attributes of the element
// //                     var attributes = driver.ExecuteScript(
// //                         "let items = {}; " +
// //                         "for (let attr of arguments[0].attributes) { " +
// //                         "items[attr.name] = attr.value; } return items;",
// //                         element
// //                     ) as IDictionary<string, object>;

// //                     if (attributes != null)
// //                     {
// //                         foreach (var attribute in attributes)
// //                         {
// //                             Console.WriteLine($"  {attribute.Key}: {attribute.Value}");
// //                         }
// //                     }

// //                     Console.WriteLine();
// //                 }
// //             }
// //             catch (Exception ex)
// //             {
// //                 Console.WriteLine($"An error occurred: {ex.Message}");
// //             }
// //             finally
// //             {
// //                 driver.Quit();
// //             }
// //         }

// //         Console.WriteLine("Scraping complete. Press any key to exit...");
// //         Console.ReadKey();
// //     }
// // }

// //OPTION 3

// // using OpenQA.Selenium;
// // using OpenQA.Selenium.Chrome;
// // using OpenQA.Selenium.Support.UI;
// // using SeleniumExtras.WaitHelpers;
// // using System;

// // public class WebScraper
// // {
// //     public static void Main(string[] args)
// //     {
// //         // Set up ChromeDriver options
// //         var options = new ChromeOptions();
// //         options.AddArgument("--headless");
// //         options.AddArgument("--disable-gpu");
// //         options.AddArgument("--no-sandbox");

// //         using (var driver = new ChromeDriver(options))
// //         {
// //             try
// //             {
// //                 string url = "https://brick.bankrakyat.com.my/product?productMain=1";
// //                 driver.Navigate().GoToUrl(url);

// //                 // Wait for the iframe to load
// //                 var wait = new WebDriverWait(driver, TimeSpan.FromSeconds(10));
// //                 wait.Until(ExpectedConditions.FrameToBeAvailableAndSwitchToIt(By.TagName("iframe")));

// //                 // Now within the iframe context
// //                 Console.WriteLine("Switched to iframe context.");

// //                 // Find all elements within the iframe
// //                 var allElements = driver.FindElements(By.CssSelector("body *"));

// //                 Console.WriteLine($"Number of elements found inside iframe: {allElements.Count}");

// //                 // Loop through each element and extract text
// //                 foreach (var element in allElements)
// //                 {
// //                     Console.WriteLine("Element: " + element.TagName);

// //                     // Get the text content of the element
// //                     string text = element.Text;
// //                     if (!string.IsNullOrWhiteSpace(text))
// //                     {
// //                         Console.WriteLine($"  Text: {text}");
// //                     }
// //                 }

// //                 // Switch back to the main page context if needed
// //                 driver.SwitchTo().DefaultContent();
// //                 Console.WriteLine("Switched back to main page context.");
// //             }
// //             catch (Exception ex)
// //             {
// //                 Console.WriteLine($"An error occurred: {ex.Message}");
// //             }
// //             finally
// //             {
// //                 driver.Quit();
// //             }
// //         }

// //         Console.WriteLine("Scraping complete. Press any key to exit...");
// //         Console.ReadKey();
// //     }
// // }

// using System;
// using HtmlAgilityPack;
// using System.Collections.Generic;
// using System.Linq;

// class Program
// {
//     static void Main()
//     {
//         // Simulated multiple HTML contents (add as many as needed)
//         List<string> htmlDocuments = new List<string>
//         {
//             @"<html> <!-- Your first HTML content here --> </html>",
//             @"<html> <!-- Your second HTML content here --> </html>",
//             @"<html> <!-- Your third HTML content here --> </html>"
//         };

//         int docIndex = 1;
//         foreach (var htmlContent in htmlDocuments)
//         {
//             Console.WriteLine($"Processing Document {docIndex}...\n");

//             // Parse the HTML content
//             var htmlDoc = new HtmlDocument();
//             htmlDoc.LoadHtml(htmlContent);

//             // Extract text content
//             var textNodes = htmlDoc.DocumentNode.Descendants()
//                 .Where(node =>
//                     node.NodeType == HtmlNodeType.Text &&
//                     !string.IsNullOrWhiteSpace(node.InnerText) &&
//                     node.ParentNode.Name != "script" &&
//                     node.ParentNode.Name != "style"
//                 )
//                 .Select(node => node.InnerText.Trim());

//             // Print extracted text
//             int textIndex = 1;
//             foreach (var text in textNodes)
//             {
//                 Console.WriteLine($"{textIndex}: {text}");
//                 textIndex++;
//             }

//             Console.WriteLine(new string('-', 50)); // Separator between documents
//             docIndex++;
//         }
//     }
// }

using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers(); // Adds controller support for API endpoints
builder.Services.AddEndpointsApiExplorer(); // Enables Swagger generation
builder.Services.AddSwaggerGen(); // Adds Swagger for API testing

builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", builder =>
    {
        builder.WithOrigins("http://localhost:4200") // Adjust as needed
               .AllowAnyHeader()
               .AllowAnyMethod()
               .AllowCredentials();
    });
}); 

var app = builder.Build();

// Enable Swagger for development
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "WebScraperApi"));
}


 app.Use(async (context, next) =>
    {
        if (context.Request.Path == "/")
        {
            context.Response.Redirect("/swagger/index.html", permanent: false);
            return;
        }

        await next();
    });

    
app.UseHttpsRedirection();
app.UseAuthorization();

app.MapControllers(); // Maps controller routes to API endpoints

// Optional: Serve JSON directly for testing purposes
app.MapGet("/json-test", () =>
{
    var jsonFilePath = "./Resources/investmentProduct.json"; // Ensure the file path is correct
    if (System.IO.File.Exists(jsonFilePath))
    {
        var jsonData = System.IO.File.ReadAllText(jsonFilePath);
        var products = JsonSerializer.Deserialize<List<object>>(jsonData);
        return Results.Json(products);
    }
    else
    {
        return Results.NotFound("JSON file not found.");
    }
});

app.Run();
