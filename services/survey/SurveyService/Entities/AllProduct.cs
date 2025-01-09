namespace SurveyService.Entities
{
    public class AllProduct
    {
        public int prodId { get; set;}
        public string serviceName { get; set;}
        public string productName { get; set;}
        public bool isActive { get; set;}

        // Navigation property to Survey

    }
}
