using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Text.Json;
using UserActivityApi.Models;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace UserActivityApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserActivityController : ControllerBase
    {
        private readonly string _baseDirectory;

        public UserActivityController (IConfiguration configuration)
        {
            _baseDirectory = configuration["BaseDirectoryPath"] ?? "Data";
        }

        [HttpPost]
        public IActionResult SaveActivities([FromBody] List<UserActivityModel> activities)
        {
            try
            {
                var userDir = Path.Combine(_baseDirectory, "Users", "IN");

                if (!Directory.Exists(userDir))
                {
                    Directory.CreateDirectory(userDir);
                }

                var fileName = $"activities_{Guid.NewGuid()}.json";

                var filePath = Path.Combine(userDir, fileName);

                var options = new JsonSerializerOptions { WriteIndented = true };

                var json = JsonSerializer.Serialize(activities, options);

                System.IO.File.WriteAllText(filePath, json);

                return Ok(new { Message = "Activities saved successfully.", File = filePath });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Error = "An error occurred", Details = ex.Message });
            }
        }
    }
}
