using System.Collections.Generic;

namespace ChatbotAPI_1.Models
{
public class Root
{
    public string Platform { get; set; }
    public string Description { get; set; }
    public List<Product> Products { get; set; }
}

public class Product
{
    public string BrickProduct { get; set; }
    public string Description { get; set; }
    public List<ChildProduct> ChildProducts { get; set; }
}

public class ChildProduct
{
    public string Name { get; set; }
    public string Description { get; set; }
    public string Concept { get; set; }
    public Features Features { get; set; }
    public Eligibility Eligibility { get; set; }
    public List<InstallmentMethod> InstallmentMethod { get; set; }
    public List<IncomeEligibility> IncomeEligibility { get; set; }
    public List<Rate> FixedRate { get; set; }
    public List<Rate> FloatingRate { get; set; }
    public Notes Notes { get; set; }
    public DocumentsRequired DocumentsRequired { get; set; }
    public TransactionCharges TransactionCharges { get; set; }
}

public class Features
{
    public string FinancingAmount { get; set; }
    public string FinancingTenure { get; set; }
    public string Guarantor { get; set; }
    public string TakafulCoverage { get; set; }
    public string ProfitRate { get; set; }
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

public class Rate
{
    public List<string> PaymentType { get; set; }
    public List<RateDetail> Rates { get; set; }
}

public class RateDetail
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
