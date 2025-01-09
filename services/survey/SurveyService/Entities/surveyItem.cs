namespace SurveyService.Entities
{
    public class surveyItem
    {
        public int Id { get; set; }
        public DateTime SubmissionDate { get; set; }
        public string Name { get; set; } = "";
        public string EmailAddress { get; set; } = "";
        public string phoneNumber { get; set; } = "";
        public string Comment { get; set; } = "";
        public string FinancingType { get; set; } = "";
        public int StarRating { get; set; }
        
        public int prodId { get; set; }  // FK
    }
} 