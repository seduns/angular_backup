using System.Collections.Generic;

namespace ChatbotAPI_2.Models
{
   public class ProductCategory
{
    public string Product_Category { get; set; }
    public List<ProductChild> ProductChild { get; set; }
    public string Concept { get; set; }
    public Features Features { get; set; }
    public List<IncomeEligibility> IncomeEligibility { get; set; }
    public List<FixedRate> FixedRate { get; set; }
    public List<FloatingRate> FloatingRate { get; set; }
    public Notes Notes { get; set; }
    public DocumentsRequired DocumentsRequired { get; set; }
    public TransactionCharges TransactionCharges { get; set; }
}

public class ProductChild
{
    public string Name { get; set; }
    public string Concept { get; set; }  // Added Concept here under ProductChild
}

public class Features
{
    public string FinancingAmount { get; set; }
    public string FinancingTenure { get; set; }
    public string Guarantor { get; set; }
    public string TakafulCoverage { get; set; }
    public string ProfitRate { get; set; }
    public Eligibility Eligibility { get; set; }
    public List<InstallmentMethod> InstallmentMethod { get; set; }
}

public class Eligibility
{
    public string Citizenship { get; set; }
    public string Age { get; set; }
    public string Income { get; set; }
    public string Employment { get; set; }
    public string ServiceDuration { get; set; }
}

public class InstallmentMethod
{
    public string Method { get; set; }
    public string Eligibility { get; set; }
}

public class IncomeEligibility
{
    public string Income { get; set; }
    public string Eligibility { get; set; }
}

public class FixedRate
{
    public List<string> PaymentType { get; set; }
    public List<Rate> Rates { get; set; }
}

public class FloatingRate
{
    public List<string> PaymentType { get; set; }
    public List<Rate> Rates { get; set; }
}

public class Rate
{
    public string Tenure { get; set; }
    public string ProfitRate { get; set; }
}

public class Notes
{
    public string StandardBaseRate { get; set; }
    public string AdditionalProfitRateWithoutTakaful { get; set; }
    public string CeilingRate { get; set; }
}

public class DocumentsRequired
{
    public List<string> NewApplication { get; set; }
    public List<string> RepeatedOverlapping { get; set; }
}

public class TransactionCharges
{
    public string WakalahFee { get; set; }
    public string StampDutyFee { get; set; }
    public LatePaymentCharges LatePaymentCharges { get; set; }
    public string EarlySettlementFee { get; set; }
}

public class LatePaymentCharges
{
    public string DuringTenure { get; set; }
    public string AfterTenureExpiry { get; set; }
}

}
