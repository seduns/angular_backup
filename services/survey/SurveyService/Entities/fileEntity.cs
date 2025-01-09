namespace SurveyService.Entities
{
    public class fileEntity
    {
            public int Id { get; set; }                // Unique identifier for the file
            public string FileName { get; set; }       // Name of the file, e.g., "example.txt"
            public string FileType { get; set; }       // Type of the file, e.g., "text/plain"
            public string Content { get; set; }        // Full content of the .txt file
            public DateTime UploadedAt { get; set; }   // Timestamp for when the file was uploadedimestamp for when the file was uploaded
        
    }
} 