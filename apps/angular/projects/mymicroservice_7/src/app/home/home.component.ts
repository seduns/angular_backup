import { AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { SurveyService } from '../../app/survey/survey-service/controller/survey.service';
import { CreditCardProductDto, groupProduct, HomeProductDto, PawnBrokingProductDto, personalProductDto, surveyItemDto, SavingProductDto, TakafulProductDto, VehicleProductDto } from '../survey/survey-service/dto/model';
import { AuthService } from '@abp/ng.core';
import { Chart, registerables, ChartType} from 'chart.js';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { ProductService } from '../survey/survey-service/controller/product.services';
import { eEntityChangeType } from '@volo/abp.ng.audit-logging';

Chart.register(...registerables);

@Component({
  selector: 'app-home',
  // standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'] // Fix the property name here
})
export class HomeComponent implements AfterViewInit {

  @ViewChild('barChart') barChart!: ElementRef<HTMLCanvasElement>; // use to access canvas

  chart!: Chart; // Correctly specify the type

  surveys: surveyItemDto[] = []; // Store survey items
  errorMessage: string = ''; // Fixed typo: erorrMessage to errorMessage
  newSurveyName: string = '';
  newSurveyAge: number = 0;
  newSurveyPhoneNumber: string = '';
  newSurveyComment: string = '';
  newSurveyEmailAddress: string = '';
  starRating: number = 0;
  personalFinancingType: string = ''; // Property to store selected financing type
  productId: number = 0;
  serviceName: string = '';
  productName: string = '';
  isActive: boolean = false;

  starSorting: any;
  sortOrder: 'asc' | 'desc' = 'desc';

  selectedSurvey: any; // select srvy
  selectedStarRating: number | null = null;
  selectedFinancingType: string | null = null;
  selectedStarSorting: string | null = null;
  editedSurvey: surveyItemDto | null = null; // edit survey

  isUserAdmin: boolean = false;
  isUserOfficer: boolean = false;
  isUserManager: boolean = false;

  totalSubmissions: number = 0; 
  numberCount: number = 0;

  maxValue: number = 0;

  personalFinancingCount = 0;
  homeFinancingCount = 0;
  vehicleFinancingCount = 0;
  takafulCount = 0;
  savingCount = 0;
  pawnBankingCount = 0;
  creditCardCount = 0;

  //Calculate Rating Star on each service
  starRating_1: number = 0;
  starRating_2: number = 0;
  starRating_3: number = 0;
  starRating_4: number = 0;
  starRating_5: number = 0;

  totalPersonalRating_1: number = 0;
  totalPersonalRating_2: number = 0;
  totalPersonalRating_3: number = 0;
  totalPersonalRating_4: number = 0;
  totalPersonalRating_5: number = 0;

  totalHomeRating_1: number = 0;
  totalHomeRating_2: number = 0;
  totalHomeRating_3: number = 0;
  totalHomeRating_4: number = 0;
  totalHomeRating_5: number = 0;
  
  totalVechicleRating_1: number = 0;
  totalVechicleRating_2: number = 0;
  totalVechicleRating_3: number = 0;
  totalVechicleRating_4: number = 0;
  totalVechicleRating_5: number = 0;

  totalTakafulRating_1: number = 0;
  totalTakafulRating_2: number = 0;
  totalTakafulRating_3: number = 0;
  totalTakafulRating_4: number = 0;
  totalTakafulRating_5: number = 0;

  totalSavingRating_1: number = 0;
  totalSavingRating_2: number = 0;
  totalSavingRating_3: number = 0;
  totalSavingRating_4: number = 0;  
  totalSavingRating_5: number = 0;

  totalPawnRating_1: number = 0;
  totalPawnRating_2: number = 0;
  totalPawnRating_3: number = 0;
  totalPawnRating_4: number = 0;
  totalPawnRating_5: number = 0;

  totalCreditRating_1: number = 0;
  totalCreditRating_2: number = 0;
  totalCreditRating_3: number = 0;
  totalCreditRating_4: number = 0;
  totalCreditRating_5: number = 0;

  //CREDIT CARD FINANCIAL
  CreditCardProduct: CreditCardProductDto[] = []; 
  newCreditCardProductName: string = '';

 //PAWN BROKING FINANCIAL
  PawnBrokingProduct: PawnBrokingProductDto[] = [];
  newPawnBrokingProductName: string = '';

 //SAVING FINANCIAL
  SavingProduct: SavingProductDto[] = [];
  newSavingProductName: string = '';

 //TAKAFUL FINANCIAL
  TakafulProduct: TakafulProductDto[] = [];
  newTakafulProductName: string = '';

 //VEHICLE FINANCIAL
  vehicleProduct: VehicleProductDto[] = [];
  newVehicleProductName: string = '';

 //HOME FINANCIAL
  homeProduct: HomeProductDto[] = [];
  newHomeProductName: string = '';

  //PRODUCT
  products: surveyItemDto[] = [];

  prodId: surveyItemDto[] = [];

  submissionCalculation: number = 0; 

  // Define personalProductRatings as an object where each product name maps to its ratings

  productRatingsArray: { productName: string; ratings: { [key: number]: number } }[] = [];

  startDate: Date | null = null;
  endDate: Date | null = null;

  constructor(private surveyService: SurveyService, private authService: AuthService,
              private productService: ProductService
  ) {
    const currentYear = new Date().getFullYear();

    // Add "All" as the first option in the year dropdown
    this.yearOptions.push("All");
  
    // Populate year options from 2019 to the current year
    for (let year = 2019; year <= currentYear; year++) {
      this.yearOptions.push(year.toString());
    }
  
    // Set default selection: either "All" or the current year
    this.selectedYear = "All"; // Set to currentYear.toString() if you want to default to the current year
    const currentMonth = new Date().getMonth() + 1; // Months are zero-indexed
    this.selectedMonth = currentMonth.toString();
  
    // Set the default date range based on the selection
    this.setDefaultDateRange();
  }

  ngAfterViewInit(): void {
    this.loadSurveys(); // Load surveys on initialization
    this.loadProduct(); 
    // this.setDefaultDateRange();  
    
    //KIV
    const allProducts = [
      ...this.products,
      ...this.homeProduct,
      ...this.vehicleProduct,
      ...this.TakafulProduct,
      ...this.SavingProduct,
      ...this.PawnBrokingProduct,
      ...this.CreditCardProduct
    ];

    // console.log("Mapped Products with Ratings:", this.products);

    if (this.authService.isAuthenticated) {
      const token = this.authService.getAccessToken();
      const payload = this.parseJwt(token);
      this.isUserAdmin = payload?.role === 'admin';
      this.isUserOfficer = payload?.role === 'officer';
      this.isUserManager = payload?.role === 'manager';
    }
  }

  private parseJwt(token: string): any {  
    if (!token) return null;
    const payloadBase64 = token.split('.')[1];
    const payloadJson = atob(payloadBase64);
    return JSON.parse(payloadJson);
  }

  // Load Survey
  loadSurveys(): void {
    this.surveyService.get().subscribe(
      (response) => {
        this.surveys = response;  
        this.totalSubmissions = this.surveys.length; //get the lenght of the submission 
        this.CalculateServiceType();
        this.updateBarChart();
        this.calculatePersonalRating(this.startDate, this.endDate); // add here
        // console.log('Survey Data: ', this.surveys);

      },
      (error) => {
        console.error('Error loading surveys: ', error);
        this.errorMessage = 'There was a problem loading the survey items. Please try again.';
      }
    );
  }

  //Delete Survey
  deleteSurvey(id: string): void {
    this.surveyService.delete(id).subscribe(() => {
      console.log(`Survey with ID ${id} deleted successfully.`);
      this.loadSurveys(); // Refresh surveys after deletion
      this.editedSurvey = null;
    }, (error) => {
      console.error('Failed to delete survey', error);
    });
  }

  CalculateServiceType(): void {  
    this.personalFinancingCount = this.surveys.filter(survey => survey.financingType === 'Personal Financing-i').length;
    this.homeFinancingCount = this.surveys.filter(survey => survey.financingType === 'Home Financing-i').length;
    this.vehicleFinancingCount = this.surveys.filter(survey => survey.financingType === 'Vehicle Financing').length;
    this.takafulCount = this.surveys.filter(survey => survey.financingType === 'Takaful').length;
    this.savingCount = this.surveys.filter(survey => survey.financingType === 'Saving-i').length;
    this.pawnBankingCount = this.surveys.filter(survey => survey.financingType === 'Pawn Broking-i').length;
    this.creditCardCount = this.surveys.filter(survey => survey.financingType === 'Credit Card-i').length;

    this.maxValue = Math.max ( 
      this.personalFinancingCount,
      this.homeFinancingCount,
      this.vehicleFinancingCount,
      this.takafulCount,
      this.savingCount,
      this.pawnBankingCount,
      this.creditCardCount
      
    );
  }

  CalculatedFilteredProduct(): void {
    // Convert startDate and endDate to Date objects if they are not null
    const startDate = this.startDate ? new Date(this.startDate) : null;
    const endDate = this.endDate ? new Date(this.endDate) : null;
  
    // Filter the products based on the selected date range and the prodId
    const filteredProducts = this.productList.filter(product => {
      // Filter by product submission date within the selected date range
      const productSubmissionsInRange = this.surveys.filter(survey => {
        const submissionDate = new Date(survey.submissionDate); // Assuming survey has submissionDate
        // Ensure submissionDate is within the selected range and matches prodId
        return (startDate && endDate ? submissionDate >= startDate && submissionDate <= endDate : true) && survey.prodId === product.prodId;
      });
  
      // Check if there are any submissions for this product within the selected date range
      return productSubmissionsInRange.length > 0;
    });
  
    // Calculate the total submissions for the selected date range
    const totalSubmissions = filteredProducts.reduce((total, product) => {
      const productSubmissionsInRange = this.surveys.filter(survey => {
        const submissionDate = new Date(survey.submissionDate); // Assuming survey has submissionDate
        return submissionDate >= startDate && submissionDate <= endDate && survey.prodId === product.prodId;
      });
      return total + productSubmissionsInRange.length; // Add the number of submissions for each product
    }, 0);
  
    // Log the result
    console.log('Filtered Products:', filteredProducts);
    console.log('Total Submissions for selected date range:', totalSubmissions);
  }
  

  CalculateFilteredServiceType(): void {
    // Get the filtered surveys based on the selected date range
    const filteredSurveys = this.surveys.filter(survey => {
        const submissionDate = this.stripTime(new Date(survey.submissionDate));
        const startDate = this.startDate ? this.stripTime(new Date(this.startDate)) : null;
        const endDate = this.endDate ? this.stripTime(new Date(this.endDate)) : null;

        // If both start and end dates are selected, filter by date range
        if (startDate && endDate) {
            return submissionDate >= startDate && submissionDate <= endDate;
        }
        return false; // If no date range is selected, do not include this survey
    });

    // Count financing types based on filtered surveys
    this.personalFinancingCount = filteredSurveys.filter(survey => survey.financingType === 'Personal Financing-i').length;
    this.homeFinancingCount = filteredSurveys.filter(survey => survey.financingType === 'Home Financing-i').length;
    this.vehicleFinancingCount = filteredSurveys.filter(survey => survey.financingType === 'Vehicle Financing').length;
    this.takafulCount = filteredSurveys.filter(survey => survey.financingType === 'Takaful').length;
    this.savingCount = filteredSurveys.filter(survey => survey.financingType === 'Saving-i').length;
    this.pawnBankingCount = filteredSurveys.filter(survey => survey.financingType === 'Pawn Broking-i').length;
    this.creditCardCount = filteredSurveys.filter(survey => survey.financingType === 'Credit Card-i').length;

    // Calculate the maximum value among all counts
    this.maxValue = Math.max(
        this.personalFinancingCount,
        this.homeFinancingCount,
        this.vehicleFinancingCount,
        this.takafulCount,
        this.savingCount,
        this.pawnBankingCount,
        this.creditCardCount
    );
  }

  calculatePersonalRating(startDate: Date, endDate: Date): void {
      // this.personalFinancingCount = this.surveys.filter(survey => survey.financingType === 'Personal Financing-i').length;
      this.totalPersonalRating_1 = this.surveys.filter(survey => survey.financingType == 'Personal Financing-i' && survey.starRating === 1).length;
      this.totalPersonalRating_2 = this.surveys.filter(survey => survey.financingType == 'Personal Financing-i' && survey.starRating === 2).length; 
      this.totalPersonalRating_3 = this.surveys.filter(survey => survey.financingType == 'Personal Financing-i' && survey.starRating === 3).length;
      this.totalPersonalRating_4 = this.surveys.filter(survey => survey.financingType == 'Personal Financing-i' && survey.starRating === 4).length;
      this.totalPersonalRating_5 = this.surveys.filter(survey => survey.financingType == 'Personal Financing-i' && survey.starRating === 5).length;

      this.totalHomeRating_1 = this.surveys.filter(survey => survey.financingType == 'Home Financing-i' && survey.starRating === 1).length;
      this.totalHomeRating_2 = this.surveys.filter(survey => survey.financingType == 'Home Financing-i' && survey.starRating === 2).length;
      this.totalHomeRating_3 = this.surveys.filter(survey => survey.financingType == 'Home Financing-i' && survey.starRating === 3).length;
      this.totalHomeRating_4 = this.surveys.filter(survey => survey.financingType == 'Home Financing-i' && survey.starRating === 4).length;
      this.totalHomeRating_5 = this.surveys.filter(survey => survey.financingType == 'Home Financing-i' && survey.starRating === 5).length;
      
      this.totalVechicleRating_1 = this.surveys.filter(survey => survey.financingType == 'Vehicle Financing' && survey.starRating === 1).length;
      this.totalVechicleRating_2 = this.surveys.filter(survey => survey.financingType == 'Vehicle Financing' && survey.starRating === 2).length;
      this.totalVechicleRating_3 = this.surveys.filter(survey => survey.financingType == 'Vehicle Financing' && survey.starRating === 3).length;
      this.totalVechicleRating_4 = this.surveys.filter(survey => survey.financingType == 'Vehicle Financing' && survey.starRating === 4).length;
      this.totalVechicleRating_5 = this.surveys.filter(survey => survey.financingType == 'Vehicle Financing' && survey.starRating === 5).length;
      
      this.totalTakafulRating_1 = this.surveys.filter(survey => survey.financingType == 'Takaful' && survey.starRating === 1).length;
      this.totalTakafulRating_2 = this.surveys.filter(survey => survey.financingType == 'Takaful' && survey.starRating === 2).length;
      this.totalTakafulRating_3 = this.surveys.filter(survey => survey.financingType == 'Takaful' && survey.starRating === 3).length;
      this.totalTakafulRating_4 = this.surveys.filter(survey => survey.financingType == 'Takaful' && survey.starRating === 4).length;
      this.totalTakafulRating_5 = this.surveys.filter(survey => survey.financingType == 'Takaful' && survey.starRating === 5).length;
      
      this.totalSavingRating_1= this.surveys.filter(survey => survey.financingType == 'Saving-i' && survey.starRating === 1).length;
      this.totalSavingRating_2 = this.surveys.filter(survey => survey.financingType == 'Saving-i' && survey.starRating === 2).length;
      this.totalSavingRating_3 = this.surveys.filter(survey => survey.financingType == 'Saving-i' && survey.starRating === 3).length;
      this.totalSavingRating_4 = this.surveys.filter(survey => survey.financingType == 'Saving-i' && survey.starRating === 4).length;
      this.totalSavingRating_5 = this.surveys.filter(survey => survey.financingType == 'Saving-i' && survey.starRating === 5).length;

      this.totalPawnRating_1 = this.surveys.filter(survey => survey.financingType == 'Pawn Broking-i' && survey.starRating === 1).length;
      this.totalPawnRating_2 = this.surveys.filter(survey => survey.financingType == 'Pawn Broking-i' && survey.starRating === 2).length;
      this.totalPawnRating_3 = this.surveys.filter(survey => survey.financingType == 'Pawn Broking-i' && survey.starRating === 3).length;
      this.totalPawnRating_4 = this.surveys.filter(survey => survey.financingType == 'Pawn Broking-i' && survey.starRating === 4).length;
      this.totalPawnRating_5 = this.surveys.filter(survey => survey.financingType == 'Pawn Broking-i' && survey.starRating === 5).length;

      this.totalCreditRating_1 = this.surveys.filter(survey => survey.financingType == 'Credit Card-i' && survey.starRating === 1).length;
      this.totalCreditRating_2 = this.surveys.filter(survey => survey.financingType == 'Credit Card-i' && survey.starRating === 2).length;
      this.totalCreditRating_3 = this.surveys.filter(survey => survey.financingType == 'Credit Card-i' && survey.starRating === 3).length;
      this.totalCreditRating_4 = this.surveys.filter(survey => survey.financingType == 'Credit Card-i' && survey.starRating === 4).length;
      this.totalCreditRating_5 = this.surveys.filter(survey => survey.financingType == 'Credit Card-i' && survey.starRating === 5).length;
      
  }

  get filteredRating(): surveyItemDto[] {
    const filtered = this.surveys.filter(survey => {
      const submissionDate = this.stripTime(new Date(survey.submissionDate));
      const startDate = this.startDate ? this.stripTime(new Date(this.startDate)) : null;
      const endDate = this.endDate ? this.stripTime(new Date(this.endDate)) : null;

      if (startDate && endDate) {
        return submissionDate >= startDate && submissionDate <= endDate;
      }
      return false; // If no dates are selected, don't include this survey
    });

    return filtered;
  }

  onDateChange(): void {
    this.calcPersonal(); // This will trigger the filtering and counting
    this.calcHome();
    this.calcVehicle();
    this.calcTakaful();
    this.calcSaving();
    this.calcPawn();
    this.calcCredit();

    this.setDefaultDateRange(); 
    this.CalculatedFilteredProduct(); 
    this.CalculateFilteredServiceType();
    this.CalculateTotalSubmissions();
    this.updateBarChart();eEntityChangeType

    // this.submissionCalculation = this.personalFinancingCount + this.homeFinancingCount + this.vehicleFinancingCount + this.takafulCount + this.savingCount + this.pawnBankingCount + this.creditCardCount;
  }

  CalculateTotalSubmissions(): void {
    // Check if both startDate and endDate are selected
    if (!this.startDate || !this.endDate) {
        console.warn("Please select both a start and end date.");
        return;
    }

    // Strip the time for accurate date-only comparison
    const startDate = this.stripTime(new Date(this.startDate));
    const endDate = this.stripTime(new Date(this.endDate));

    // Filter surveys based on selected date range and prodId
    const filteredSurveys = this.surveys.filter(survey => {
        const submissionDate = this.stripTime(new Date(survey.submissionDate));
        const dateMatch = submissionDate >= startDate && submissionDate <= endDate;
        return dateMatch && survey.prodId; // Ensure that prodId is present
    });

    // Update the counts based on financing type within the filtered results
    this.personalFinancingCount = filteredSurveys.filter(survey => survey.financingType === 'Personal Financing-i').length;
    this.homeFinancingCount = filteredSurveys.filter(survey => survey.financingType === 'Home Financing-i').length;
    this.vehicleFinancingCount = filteredSurveys.filter(survey => survey.financingType === 'Vehicle Financing').length;
    this.takafulCount = filteredSurveys.filter(survey => survey.financingType === 'Takaful').length;
    this.savingCount = filteredSurveys.filter(survey => survey.financingType === 'Saving-i').length;
    this.pawnBankingCount = filteredSurveys.filter(survey => survey.financingType === 'Pawn Broking-i').length;
    this.creditCardCount = filteredSurveys.filter(survey => survey.financingType === 'Credit Card-i').length;

    // Calculate total submissions
    this.totalSubmissions = this.personalFinancingCount + this.homeFinancingCount + this.vehicleFinancingCount + this.takafulCount + this.savingCount + this.pawnBankingCount + this.creditCardCount;

    // Log the result for debugging
    console.log('Total Service Submissions by Financing Type:', {
        'Personal Financing-i': this.personalFinancingCount,
        'Home Financing-i': this.homeFinancingCount,
        'Vehicle Financing': this.vehicleFinancingCount,
        'Takaful': this.takafulCount,
        'Saving-i': this.savingCount,
        'Pawn Broking-i': this.pawnBankingCount,
        'Credit Card-i': this.creditCardCount,
    });
    console.log('Total Submissions:', this.totalSubmissions);

    // Log the submissions for each product (prodId) within the selected date range
    const productSubmissions = filteredSurveys.reduce((acc, survey) => {
        acc[survey.prodId] = (acc[survey.prodId] || 0) + 1;
        return acc;
    }, {});

    console.log('Product Submissions by prodId:', productSubmissions);
}




 // Method to calculate ratings for Personal Financing
calcPersonal(): void {
  this.resetPersonalRatings();
  const filteredSurveys = this.filteredRating;

  filteredSurveys.forEach(survey => {
      if (survey.financingType === 'Personal Financing-i') {
          switch (survey.starRating) {
              case 1: this.totalPersonalRating_1++; break;
              case 2: this.totalPersonalRating_2++; break;
              case 3: this.totalPersonalRating_3++; break;
              case 4: this.totalPersonalRating_4++; break;
              case 5: this.totalPersonalRating_5++; break;
          }
      }
  });
}

// Reset ratings for Personal Financing
resetPersonalRatings(): void {
  this.totalPersonalRating_1 = 0;
  this.totalPersonalRating_2 = 0;
  this.totalPersonalRating_3 = 0;
  this.totalPersonalRating_4 = 0;
  this.totalPersonalRating_5 = 0;
}

// Method to calculate ratings for Home Financing
calcHome(): void {
  // Reset ratings
  this.resetHomeRatings();
  
  // Get filtered surveys
  const filteredSurveys = this.filteredRating;

  // Calculate ratings for Home Financing
  filteredSurveys.forEach(survey => {
      if (survey.financingType === 'Home Financing-i') {
          switch (survey.starRating) {
              case 1: this.totalHomeRating_1++; break;
              case 2: this.totalHomeRating_2++; break;
              case 3: this.totalHomeRating_3++; break;
              case 4: this.totalHomeRating_4++; break;
              case 5: this.totalHomeRating_5++; break;
          }
      }
  });
}

// Reset ratings for Home Financing
resetHomeRatings(): void {
  this.totalHomeRating_1 = 0;
  this.totalHomeRating_2 = 0;
  this.totalHomeRating_3 = 0;
  this.totalHomeRating_4 = 0;
  this.totalHomeRating_5 = 0;
}

// Method to calculate ratings for Vehicle Financing
calcVehicle(): void {
  this.resetVehicleRatings();
  const filteredSurveys = this.filteredRating;

  filteredSurveys.forEach(survey => {
      if (survey.financingType === 'Vehicle Financing') {
          switch (survey.starRating) {
              case 1: this.totalVechicleRating_1++; break;
              case 2: this.totalVechicleRating_2++; break;
              case 3: this.totalVechicleRating_3++; break;
              case 4: this.totalVechicleRating_4++; break;
              case 5: this.totalVechicleRating_5++; break;
          }
      }
  });
}

// Reset ratings for Vehicle Financing
resetVehicleRatings(): void {
  this.totalVechicleRating_1 = 0;
  this.totalVechicleRating_2 = 0;
  this.totalVechicleRating_3 = 0;
  this.totalVechicleRating_4 = 0;
  this.totalVechicleRating_5 = 0;
}

// Method to calculate ratings for Takaful
calcTakaful(): void {
  this.resetTakafulRatings();
  const filteredSurveys = this.filteredRating;

  filteredSurveys.forEach(survey => {
      if (survey.financingType === 'Takaful') {
          switch (survey.starRating) {
              case 1: this.totalTakafulRating_1++; break;
              case 2: this.totalTakafulRating_2++; break;
              case 3: this.totalTakafulRating_3++; break;
              case 4: this.totalTakafulRating_4++; break;
              case 5: this.totalTakafulRating_5++; break;
          }
      }
  });
}

// Reset ratings for Takaful
resetTakafulRatings(): void {
  this.totalTakafulRating_1 = 0;
  this.totalTakafulRating_2 = 0;
  this.totalTakafulRating_3 = 0;
  this.totalTakafulRating_4 = 0;
  this.totalTakafulRating_5 = 0;
}

// Method to calculate ratings for Saving
calcSaving(): void {
  this.resetSavingRatings();
  const filteredSurveys = this.filteredRating;

  filteredSurveys.forEach(survey => {
      if (survey.financingType === 'Saving-i') {
          switch (survey.starRating) {
              case 1: this.totalSavingRating_1++; break;
              case 2: this.totalSavingRating_2++; break;
              case 3: this.totalSavingRating_3++; break;
              case 4: this.totalSavingRating_4++; break;
              case 5: this.totalSavingRating_5++; break;
          }
      }
  });
}

// Reset ratings for Saving
resetSavingRatings(): void {
  this.totalSavingRating_1 = 0;
  this.totalSavingRating_2 = 0;
  this.totalSavingRating_3 = 0;
  this.totalSavingRating_4 = 0;
  this.totalSavingRating_5 = 0;
}

// Method to calculate ratings for Pawn Broking
calcPawn(): void {
  this.resetPawnRatings();
  const filteredSurveys = this.filteredRating;

  filteredSurveys.forEach(survey => {
      if (survey.financingType === 'Pawn Broking-i') {
          switch (survey.starRating) {
              case 1: this.totalPawnRating_1++; break;
              case 2: this.totalPawnRating_2++; break;
              case 3: this.totalPawnRating_3++; break;
              case 4: this.totalPawnRating_4++; break;
              case 5: this.totalPawnRating_5++; break;
          }
      }
  });
}

// Reset ratings for Pawn Broking
resetPawnRatings(): void {
  this.totalPawnRating_1 = 0;
  this.totalPawnRating_2 = 0;
  this.totalPawnRating_3 = 0;
  this.totalPawnRating_4 = 0;
  this.totalPawnRating_5 = 0;
}

// Method to calculate ratings for Credit Card
calcCredit(): void {
  this.resetCreditRatings();
  const filteredSurveys = this.filteredRating;

  filteredSurveys.forEach(survey => {
      if (survey.financingType === 'Credit Card-i') {
          switch (survey.starRating) {
              case 1: this.totalCreditRating_1++; break;
              case 2: this.totalCreditRating_2++; break;
              case 3: this.totalCreditRating_3++; break;
              case 4: this.totalCreditRating_4++; break;
              case 5: this.totalCreditRating_5++; break;
          }
      }
  });
}

// Reset ratings for Credit Card
resetCreditRatings(): void {
  this.totalCreditRating_1 = 0;
  this.totalCreditRating_2 = 0;
  this.totalCreditRating_3 = 0;
  this.totalCreditRating_4 = 0;
  this.totalCreditRating_5 = 0;
}

  stripTime(date: Date): Date { 
    const stripDate = new Date(date);
    stripDate.setHours( 0, 0, 0, 0); //set time to  00:00:00
    // console.log('Time: ', stripDate)
    return stripDate;
  }

// KIV

// calculateProductRatings(): void {
//     const ratings: Record<string, { [key: number]: number }> = {};

//     this.surveys.forEach(survey => {
//         const product = survey.productSelection?.trim().toLowerCase();
//         const rating = survey.starRating;

//         console.log("Survey Entry:", survey); // Debug: Print each survey entry
//         console.log("Processed Product:", product, "Rating:", rating); // Debug: Confirm product and rating values

//         if (product && rating && rating >= 1 && rating <= 5) {
//             // Initialize product in the object if not present
//             if (!ratings[product]) {
//                 ratings[product] = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
//             }
            
//             // Increment the count for the corresponding star rating
//             ratings[product][rating] += 1;
//             console.log(`Updated ${product} Ratings:`, ratings[product]); // Debug: Show rating counts per product
//         }
//     });

//     // Assign the calculated ratings to the class property
// }

  //Create Bar Chart



  generatePdf(): void {
    const elementToPrint = document.getElementById('content');
    
    // Check if the element exists
    if (!elementToPrint) {
        console.error('Element to print not found!');
        return;
    }

    html2canvas(elementToPrint, { scale: 2}).then((canvas) => {
        const pdf = new jsPDF();
        
        // Add the image to the PDF
        const imgData = canvas.toDataURL('image/png');
        
        // Calculate PDF dimensions and add the image
        const imgWidth = 200; // A4 width in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width; // Maintain aspect ratio
        
        // If the image is taller than the page, add new pages
        const pageHeight = pdf.internal.pageSize.height;
        let heightLeft = imgHeight;

        let position = 0;

        // Adding image to the PDF, and handling page breaks
        while (heightLeft >= 0) {
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
            position -= pageHeight; // Move down for the next page
            if (heightLeft >= 0) {
                pdf.addPage(); // Add a new page if the content is taller than the page height
            }
        }

        // Save the generated PDF
        pdf.save('survey_report.pdf');
    }).catch(error => {
        console.error('Error generating PDF:', error);
    });
}

  updateBarChart(): void {
    // Ensure the chart is created first
    if (this.chart) {
      this.chart.data.datasets[0].data = [
        this.personalFinancingCount,
        this.homeFinancingCount,
        this.vehicleFinancingCount,
        this.takafulCount,
        this.savingCount,
        this.creditCardCount
      ];
      this.chart.update(); // Refresh the chart with new data
    } else {
      this.createBarChart(); // Create the chart if it doesn't exist yet
    }
  }

  
  edit(survey: any): void {
    if(this.selectedSurvey === survey) {
      this.selectedSurvey = null; //close
    } else {
      this.selectedSurvey = survey; //open
    }
  }

  //Open the view on top
  view(survey: surveyItemDto): void {
    this.editedSurvey = survey; // Store the survey being edited
    
    // Populate the form fields with the survey data
    this.newSurveyName = survey.name;
    this.newSurveyEmailAddress = survey.emailAddress;
    this.newSurveyComment = survey.comment;
    this.personalFinancingType = survey.financingType;
    this.starRating = survey.starRating;  
  }

  exportToExcel(): void {
    // Construct the data structure for Excel export
    const surveyData = [
        {
            'Service': 'Personal Financing-i',
            '1 Rating': this.totalPersonalRating_1,
            '2 Rating': this.totalPersonalRating_2,
            '3 Rating': this.totalPersonalRating_3,
            '4 Rating': this.totalPersonalRating_4,
            '5 Rating': this.totalPersonalRating_5,
            'Total': this.personalFinancingCount
        },
        {
            'Service': 'Home Financing-i',
            '1 Rating': this.totalHomeRating_1,
            '2 Rating': this.totalHomeRating_2,
            '3 Rating': this.totalHomeRating_3,
            '4 Rating': this.totalHomeRating_4,
            '5 Rating': this.totalHomeRating_5,
            'Total': this.homeFinancingCount
        },
        {
            'Service': 'Vehicle Financing',
            '1 Rating': this.totalVechicleRating_1,
            '2 Rating': this.totalVechicleRating_2,
            '3 Rating': this.totalVechicleRating_3,
            '4 Rating': this.totalVechicleRating_4,
            '5 Rating': this.totalVechicleRating_5,
            'Total': this.vehicleFinancingCount
        },
        {
            'Service': 'Takaful',
            '1 Rating': this.totalTakafulRating_1,
            '2 Rating': this.totalTakafulRating_2,
            '3 Rating': this.totalTakafulRating_3,
            '4 Rating': this.totalTakafulRating_4,
            '5 Rating': this.totalTakafulRating_5,
            'Total': this.takafulCount
        },
        {
            'Service': 'Saving-i',
            '1 Rating': this.totalSavingRating_1,
            '2 Rating': this.totalSavingRating_2,
            '3 Rating': this.totalSavingRating_3,
            '4 Rating': this.totalSavingRating_4,
            '5 Rating': this.totalSavingRating_5,
            'Total': this.savingCount
        },
        {
            'Service': 'Pawn Broking-i',
            '1 Rating': this.totalPawnRating_1,
            '2 Rating': this.totalPawnRating_2,
            '3 Rating': this.totalPawnRating_3,
            '4 Rating': this.totalPawnRating_4,
            '5 Rating': this.totalPawnRating_5,
            'Total': this.pawnBankingCount
        },
        {
            'Service': 'Credit Card-i',
            '1 Rating': this.totalCreditRating_1,
            '2 Rating': this.totalCreditRating_2,
            '3 Rating': this.totalCreditRating_3,
            '4 Rating': this.totalCreditRating_4,
            '5 Rating': this.totalCreditRating_5,
            'Total': this.creditCardCount
        },
        {
            'Service': 'Total Submission',
            '1 Rating': '',
            '2 Rating': '',
            '3 Rating': '',
            '4 Rating': '',
            '5 Rating': '',
            'Total': this.totalSubmissions
        }
    ];

    // Create a worksheet from the data
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(surveyData);

    // Create a new workbook
    const workbook: XLSX.WorkBook = {
        Sheets: { 'Survey Data': worksheet },
        SheetNames: ['Survey Data'],
    };
    
    // Export the workbook to an Excel file
    XLSX.writeFile(workbook, 'SurveyData.xlsx');
  }



  exportToExcel2(): void {
    // Construct the data structure for Excel export
    const surveyData = this.selectedProduct2.map((product, index) => {
        return {
            'No': index + 1,
            'Product Name': product.productName,
            '1-Star': product.ratings[0] || 0,
            '2-Star': product.ratings[1] || 0,
            '3-Star': product.ratings[2] || 0,
            '4-Star': product.ratings[3] || 0,
            '5-Star': product.ratings[4] || 0,
        };
    });

    // Create a worksheet from the data
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(surveyData);

    // Create a new workbook
    const workbook: XLSX.WorkBook = {
        Sheets: { 'Product Ratings': worksheet },
        SheetNames: ['Product Ratings'],
    };
    
    // Export the workbook to an Excel file
    XLSX.writeFile(workbook, 'Product_Ratings.xlsx');
}


  resetFilters(): void {
    this.selectedStarRating = null;
    this.selectedFinancingType = null;
    this.loadSurveys(); // Reload surveys after resetting filters
    this.startDate = null;
    this.endDate = null;
    this.selectedYear = 'All';
  }
  

  close(): void {
    this.editedSurvey = null;
    this.selectedProduct = null;
    this.selectedProduct2 = null;

  }
  

  // Reset the form fields after successful submission
  resetForm(): void {
    this.newSurveyName = '';
    this.newSurveyEmailAddress = '';
    this.newSurveyAge = 0;
    this.newSurveyComment = '';
    this.starRating = 0;
    this.personalFinancingType = '';
  }

  getStars(starRating: number): number[] {
    return Array(starRating).fill(0); // Create an array with the length of the starRating
  }

  loadProduct(): void {
    this.productService.get().subscribe(
      (response: surveyItemDto[]) => {
        this.productList = response;
        // console.log('All products loaded:', this.productList); // Log all products initially loaded
      },
      (error) => {
        console.error('Error loading products:', error);
      }
    );
  }


  selectedProduct: string = '';
  selectedProduct2: surveyItemDto[] = [];

 // Define the filteredProduct getter as you already have it
 get filteredProduct(): surveyItemDto[] {
  // Filter the surveys based on both date range and selected product
  const filtered = this.surveys.filter(survey => {
    const submissionDate = this.stripTime(new Date(survey.submissionDate)); // Strip time from submission date
    const startDate = this.startDate ? this.stripTime(new Date(this.startDate)) : null;
    const endDate = this.endDate ? this.stripTime(new Date(this.endDate)) : null;

    // Check if the survey's submission date is within the selected date range
    const dateMatch = startDate && endDate
      ? submissionDate >= startDate && submissionDate <= endDate
      : true;  // If no date range is selected, always include the survey

    // Check if the survey's financing type matches the selected product
    const productMatch = this.selectedProduct
      ? survey.financingType.trim().toLowerCase() === this.selectedProduct.trim().toLowerCase()
      : true;  // If no selected product, always include the survey

    // Log survey product selection and date filter for debugging
    // Return true only if both date and product selection match
    return dateMatch && productMatch;
  });

  // console.log("Filtered Products: ", filtered);  // Log the filtered products
  
  
  // Return the filtered surveys
  return filtered;
}

// Set the selected product when a row is clicked
setSelectedProduct(productName: string) {
  // Filter active products by productName
  this.selectedProduct2 = this.productList.filter(product => product.serviceName === productName);

  // Process each product with rating calculations and survey filtering
  this.selectedProduct2 = this.selectedProduct2.map(product => {
    // Calculate ratings for the current product based on its prodId, and selected date range
    const ratings = this.calculateProductRatings(product.prodId, this.startDate, this.endDate);

    // Filter surveys based on prodId and the selected date range
    const filteredSurveys = this.filterSurveysByDateRange(product.prodId, this.startDate, this.endDate);

    // Calculate the total number of ratings (surveys) for the current product
    const totalRatingCount = filteredSurveys.length;

    // Log ratings and totals for the current product
    console.log(`Product Name: ${product.productName}, Star Ratings:`, ratings);
    console.log(`Total Ratings for ${product.productName} (prodId: ${product.prodId}):`, totalRatingCount);
    console.log('Date chosen:', this.startDate, 'End Date:', this.endDate);

    // Return the product with the added ratings and total rating count
    return {
      ...product,
      ratings,
      totalRatingCount
    };
  });

  console.log('Selected Products with Ratings and Totals:', this.selectedProduct2);
}

calculateProductRatings(prodId: number, startDate: Date, endDate: Date): number[] {
  // Check if date range is provided. If not, return all ratings without date filter.
  const isDateRangeSelected = startDate && endDate;

  // Filter surveys by prodId and optionally by date range
  const filteredSurveys = this.surveys.filter(survey => {
    const submissionDate = new Date(survey.submissionDate);  // assuming submissionDate is a string or Date object

    // If no date range is selected, include all surveys
    if (!isDateRangeSelected) {
      return survey.prodId === prodId;
    }

    // Use stripTime to ensure the comparison is only by date (no time)
    const start = this.stripTime(startDate);
    const end = this.stripTime(endDate);
    const strippedSubmissionDate = this.stripTime(submissionDate);

    return survey.prodId === prodId && strippedSubmissionDate >= start && strippedSubmissionDate <= end;
  });

  // Generate star counts from 1 to 5 for the filtered surveys
  return [1, 2, 3, 4, 5].map(star => 
    filteredSurveys.filter(survey => survey.starRating === star).length
  );
}

  productList: surveyItemDto[] = []; // Full list of products from the database
  surveyItemList: surveyItemDto[] = []; // List of surveys (surveyItemDto)
  filteredProduct2: surveyItemDto[] = []; // To store filtered products with star rating counts


  selectedYear: string = '';
  selectedMonth: string = '';
  yearOptions: string[] = [];
  monthOptions: string[] = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  
  
  setDefaultDateRange() {
    if (this.selectedYear === "All") {
        // Set startDate and endDate to cover a wide range if "All" is selected
        this.startDate = new Date(2019, 0, 1); // Example start date (January 1, 2019)
        this.endDate = new Date(new Date().getFullYear(), 11, 31); // End date as Dec 31 of the current year
    } else {
        // Set date range for the selected year and month
        const year = parseInt(this.selectedYear, 10);
        const month = parseInt(this.selectedMonth, 10);
      
        // Start date is the first day of the selected month and year
        this.startDate = new Date(year, month - 1, 1);
      
        // End date is the last day of the selected month and year
        const lastDay = new Date(year, month, 0).getDate();
        this.endDate = new Date(year, month - 1, lastDay);
    }

    // console.log(`Date range set from: ${this.startDate} to ${this.endDate}`);
}

  
  filterSurveysByDateRange(prodId: number, startDate: Date, endDate: Date) {
    return this.surveys.filter(survey => {
      const submissionDate = new Date(survey.submissionDate);
      const start = new Date(startDate);
      const end = new Date(endDate);
  
      const strippedStartDate = this.stripTime(start);
      const strippedEndDate = this.stripTime(end);
      const strippedSubmissionDate = this.stripTime(submissionDate);
  
      // If no date range is selected, return all surveys for this prodId
      if (!startDate || !endDate) {
        return survey.prodId === prodId;
      }
  
      // Check if the survey matches the product ID and is within the selected date range
      return survey.prodId === prodId &&
        strippedSubmissionDate >= strippedStartDate &&
        strippedSubmissionDate <= strippedEndDate;
    });
  }

  dateClick: boolean = false;

  toggleDateClick() {
    this.dateClick = !this.dateClick;
    console.log(this.dateClick);
  }
  
  closeDate() {
    this.dateClick = !this.dateClick;
    console.log(this.dateClick);
  }

  createBarChart(): void {
    this.CalculateServiceType();

    // Define colors for light and dark themes
    const isDarkTheme = document.documentElement.classList.contains('lpx-theme-dark');

    const backgroundColors = isDarkTheme
        ? [
            'rgba(192, 156, 175, 0.8)',
            'rgba(128, 155, 56, 0.8)',
            'rgba(91, 91, 239, 1)',
            'rgba(129, 73, 133, 1)',
            'rgba(134, 13, 143, 1)',
            'rgba(127, 127, 13, 1)',
            'rgba(189, 162, 139, 1)',
        ]
        : [
            'rgba(255, 99, 132, 0.8)',
            'rgba(75, 192, 192, 0.8)',
            'rgba(54, 162, 235, 0.8)',
            'rgba(255, 206, 86, 0.8)',
            'rgba(153, 102, 255, 0.8)',
            'rgba(255, 159, 64, 0.8)',
            'rgba(100, 100, 255, 0.8)',
        ];

    const borderColors = isDarkTheme
        ? [
            'rgba(255, 20, 132, 0.2)',
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 99, 141, 0.2)',
        ]
        : [
            'rgba(0, 0, 0, 0.2)',
            'rgba(0, 0, 0, 0.2)',
            'rgba(0, 0, 0, 0.2)',
            'rgba(0, 0, 0, 0.2)',
            'rgba(0, 0, 0, 0.2)',
            'rgba(0, 0, 0, 0.2)',
        ];

    const textColor = isDarkTheme ? 'white' : 'black';

    const context = this.barChart.nativeElement.getContext('2d'); // Access canvas
    this.chart = new Chart(context!, {
        type: 'bar', // Change chart type to 'doughnut'
        data: {
            labels: [
                'Personal Financing-i',
                'Home Financing-i',
                'Vehicle Financing',
                'Takaful',
                'Saving-i',
                'Pawn Broking',
                'Credit Card-i'
            ],
            datasets: [{
                label: `Service Type`,
                data: [
                    this.personalFinancingCount,
                    this.homeFinancingCount,
                    this.vehicleFinancingCount,
                    this.takafulCount,
                    this.savingCount,
                    this.pawnBankingCount,
                    this.creditCardCount,
                    
                  ],
                backgroundColor: backgroundColors,
                borderColor: borderColors,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: `Service Type Doughnut Chart`,
                    color: textColor,
                    font: {
                        size: 10,
                    },
                },
                legend: {
                    position: 'top', // Position of legend
                    labels: {
                        color: textColor,
                        font: {
                            size: 12,
                        }
                    },
                    display: false
                }
            },
        }
    });
}






}


  

