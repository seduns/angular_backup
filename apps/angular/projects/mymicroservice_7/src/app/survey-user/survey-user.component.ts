import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { surveyItemDto } from '../survey/survey-service/dto/model';
import { SurveyService } from '../survey/survey-service/controller/survey.service';
import { AuthService } from '@abp/ng.core';
import { ToasterService } from '@abp/ng.theme.shared';
import { ProductService } from '../survey/survey-service/controller/product.services';
import { HttpClient } from '@angular/common/http';
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';




@Component({
  selector: 'app-survey-user',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './survey-user.component.html',
  styleUrls: ['./survey-user.component.scss']
})
export class SurveyUserComponent implements OnInit {

  //SURVEY SERVICE
  surveys: surveyItemDto[] = []; // Store survey items
  errorMessage: string = ''; // Fixed typo: erorrMessage to errorMessage

  newSurveyName: string = '';
  newSurveyAge: number | null = null;
  newSurveyPhoneNumber: string = '';
  newSurveyComment: string = '';
  newSurveyEmailAddress: string = '';
  starRating: number = 0;
  personalFinancingType: string = ''; // Property to store selected financing type
  productSelection: string = ''; // Property to store selected financing type
  submissionDate: Date;
  prodId: number;
  serviceName: string = '';
  productName: string = '';
  isActive: boolean = false;

  selectedSurvey: any; // select srvy

  isUserAdmin: boolean = false;
  isUserOfficer: boolean = false;
  isUserManager: boolean = false;
  
  totalSubmissions: number = 0; 
  
  sortOrder: 'asc' | 'desc' | null = null; // No sorting by default
  selectedStarRating: number | null = null;
  selectedFinancingType: string | null = null;
  selectedProduct: string | null = null; //added
  editedSurvey: surveyItemDto | null = null; // edit survey
  updateSurvey: surveyItemDto | null = null; // edit survey

  searchText: string = '';
  

  //filter date
  startDate: Date | null = null;
  endDate: Date | null = null;

  newProductValue: string = ''; //new product add tp the option

  successMessage = '';

  constructor(private surveyService: SurveyService, 
              private authService: AuthService,
              private toasterService: ToasterService,
              private productService: ProductService,
              private http: HttpClient  ) {}

  ngOnInit(): void {
    
    this.loadSurveys(); // Load surveys on initialization
    this.loadProduct();

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

  // Load surveys
  loadSurveys(): void {
    console.log('Selected product:', this.selectedProduct);
    this.surveyService.get().subscribe(
      (response) => {
        this.surveys = response;
        this.totalSubmissions = this.surveys.length; //get the lenght of the submission 
        this.filterSurveysByProduct(); // Call product filtering after loading surveys
        
        // selected: false
      },
      (error) => {
        console.error('Error loading surveys: ', error);
        this.errorMessage = 'There was a problem loading the survey items. Please try again.';
      }

    );
  }
  
  loadProduct(): void {
    this.productService.get().subscribe(
      (response: surveyItemDto[]) => {
        this.productList = response;
        console.log('All products loaded:', this.productList); // Log all products initially loaded
      },
      (error) => {
        console.error('Error loading products:', error);
      }
    );
  }

  newSurvey: surveyItemDto = {
      id: 0,
      name : '' ,
      emailAddress : '' ,
      phoneNumber : '' ,
      comment : '',
      financingType : '' ,
      starRating: 0,
      submissionDate: new Date().toISOString(),
      prodId : 0
  }

  formSubmitted = false;

  create(form: NgForm): void {
    // Mark the form as submitted to trigger validation messages
    this.formSubmitted = true;
  
    // If the form is invalid, mark all fields as touched to trigger validation messages
    if (form.invalid) {
      form.control.markAllAsTouched();
      alert('Complete all required fields to submit the form.');
      return;
    } 
  
    // Validate Product ID
    if (!this.newSurvey.prodId) {
      alert('Please select a product before submitting.');
      return;
    }
  
    // Validate Star Rating
    if (!this.newSurvey.starRating) {
      alert('Please rate our services before submitting.');
      return;
    }
  
    // Validate Comment Character Count
    if (this.newSurvey.comment.length > 100) {
      alert('Comment must be under 100 characters.');
      return;
    }
  
    // Proceed with the creation logic after validation passes
    console.log('Form submitted successfully:', this.newSurvey);
  
    this.surveyService.create(this.newSurvey).subscribe(
      (createdSurvey) => {
        console.log('Survey created successfully:', createdSurvey);
  
        // Reset the form and model
        this.newSurvey = {
          id: 0,
          name: '',
          emailAddress: '',
          phoneNumber: '',
          comment: '',
          financingType: '',
          starRating: 0,
          submissionDate: new Date().toISOString(),
          prodId: 0,
        };
  
        alert('Congratulations! Your form has been submitted.');
        form.resetForm();
        this.loadSurveys(); // Reload surveys after creating a new one
      },
      (error) => {
        console.error('Failed to create survey:', error);
      }
    );
  }
  
  

  validateNumberInput(event: KeyboardEvent): void {
    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab', 'Delete', 'Enter'];
  
    // Allow select-all (Ctrl+A), copy (Ctrl+C), cut (Ctrl+X), paste (Ctrl+V), and other common shortcuts
    if ((event.ctrlKey && ['a', 'c', 'x', 'v'].includes(event.key.toLowerCase())) || 
        allowedKeys.includes(event.key)) {
      return; // Allow these keys
    }
  
    // Block non-numeric characters
    if (!/^[0-9]$/.test(event.key)) {
      event.preventDefault(); // Block non-numeric characters (including a-z)
    }
  }
  
  onPaste(event: ClipboardEvent): void {
    const pasteData = event.clipboardData?.getData('text');
    if (pasteData) {
      // Remove non-numeric characters from the pasted text
      const sanitizedData = pasteData.replace(/[^0-9]/g, '');
  
      // Update the value with sanitized data
      this.newSurveyPhoneNumber = sanitizedData;
  
      // Prevent the default paste behavior
      event.preventDefault();
    }
  }

  //UPDATE
  update(): void { 
    if (this.updateSurvey) {
      this.surveyService.update(this.updateSurvey.id, this.updateSurvey).subscribe(() => {
        this.updateSurvey = null;
        this.toasterService.success('Survey updated successfully.');
        this.loadSurveys(); // Ensure surveys are refreshed after update
      }, (error) => {
        this.toasterService.error('Failed to update survey.');
      });
    }
  }
  
  //DELETE
  deleteSurvey(id: string): void {
    this.surveyService.delete(id).subscribe(() => {
      console.log(`Survey with ID ${id} deleted successfully.`);
      this.loadSurveys(); // Refresh surveys after deletion
      this.toasterService.success('item has been delete');
      this.editedSurvey = null;
      this.updateSurvey = null;
      
    }, (error) => {
      console.error('Failed to delete survey', error);
    });
  }

  //OPEN DROPDOWN
  edit(survey: any): void {
    if(this.selectedSurvey === survey) {
      this.selectedSurvey = null; //close
    }
     else {
      this.selectedSurvey = survey; //open  
    }
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event): void {
    const target = event.target as HTMLElement;
    if(target && !target.closest('.dropdown') && !target.closest('.btn-edit')) {
      this.selectedSurvey = null;
    } 
  }

  //STORE ITEM
  view(survey: surveyItemDto): void {
    this.editedSurvey = survey; // Store the survey being edited
    
    // Populate the form fields with the survey data
    this.newSurveyName = survey.name;
    this.newSurveyEmailAddress = survey.emailAddress;
    this.newSurveyComment = survey.comment;
    this.personalFinancingType = survey.financingType;
    this.starRating = survey.starRating;  
  }

  

  viewUpdate(survey: surveyItemDto): void {
    this.updateSurvey = survey;
    
    // Populate the form fields with the survey data
    this.newSurveyName = survey.name;
    this.newSurveyEmailAddress = survey.emailAddress;
    this.newSurveyComment = survey.comment;
    this.personalFinancingType = survey.financingType;
    this.starRating = survey.starRating;  
  }

  filterSurveysByProduct(): void {
    console.log('Filtering surveys by selected product:', this.selectedProduct);
    
    if (!this.selectedProduct) {
        return; // No product selected, do not filter
    }

    // const filteredSurveys = this.surveys.filter(survey => 
    //     survey.productSelection.trim().toLowerCase() === this.selectedProduct.trim().toLowerCase());

    // console.log('Filtered surveys:', filteredSurveys);
    // this.surveys = filteredSurveys; // Update the surveys to only show filtered results
  }

  get filteredSurveys(): surveyItemDto[] {
    const filtered = this.surveys.filter(survey => {
      const matchesStarRating = this.selectedStarRating ? survey.starRating === this.selectedStarRating : true;
      const matchesFinancingType = this.selectedFinancingType ? survey.financingType === this.selectedFinancingType : true;
      const matchProduct = this.selectedProductReal ? survey.prodId === this.selectedProductId : true;

      // SEARCH
      const matchesName = this.searchText ? 
        survey.name.trim().toLowerCase().includes(this.searchText.trim().toLowerCase()) ||
        survey.emailAddress.trim().toLowerCase().includes(this.searchText.trim().toLowerCase()) ||
        survey.comment.trim().toLowerCase().includes(this.searchText.trim().toLowerCase()) ||
        survey.phoneNumber.toString().includes(this.searchText.trim()) : true;

      const submissionDate = this.stripTime(new Date(survey.submissionDate));
      const startDate = this.startDate ? this.stripTime(new Date(this.startDate)) : null;
      const endDate = this.endDate ? this.stripTime(new Date(this.endDate)) : null;
  
      // Check if startDate and endDate are the same (same day)
      if (startDate && endDate && startDate.getTime() === endDate.getTime()) {
        // If startDate == endDate, filter by exactly that date
        return matchesStarRating && matchesFinancingType && 
          submissionDate.getTime() === startDate.getTime();
      }
      
      // Otherwise, filter for date ranges
      const matchesDate = (!startDate || submissionDate >= startDate) && 
                          (!endDate || submissionDate <= endDate);
  
      return matchesStarRating && matchesFinancingType && matchesDate && matchesName && matchProduct;
    });

    // Apply sorting if sortOrder is set ('asc' or 'desc')
    if (this.sortOrder) {
      return filtered.sort((a, b) => {
        return this.sortOrder === 'desc' ? b.starRating - a.starRating : a.starRating - b.starRating;
        
      });
    }

    this.totalSearch = filtered.length;
    
    // If no sorting order is set, return the filtered array without sorting
    return filtered;
  }

  totalSearch: number = 0;

  // Method to set the sort order and trigger sorting
  sortSurveys(order: 'desc' | 'asc') {
    this.sortOrder = order;
  }
  
  stripTime(date: Date): Date { 
    const stripDate = new Date(date);
    stripDate.setHours( 0, 0, 0, 0); //set time to  00:00:00
    // console.log('Time: ', stripDate)
    return stripDate;
  }

  getWordCount(): number {
    return this.newSurveyComment ? this.newSurveyComment.trim().split(/\s+/).length : 0;
  }

  // isWordLimitExceeded(): boolean {
  //   return this.getWordCount() > 30;
  // }

  // Method to get the character count
    // Limit characters in the custom comment
    limitCharacters(value: string): string {
      return value.length > 100 ? value.slice(0, 100) : value;
    }
  
    // Get the current character count
    getCharacterCount(): number {
      return this.newSurvey.comment ? this.newSurvey.comment.length : 0;
    }
  
    getCharacterCountName(): number {
      return this.newSurvey.name ? this.newSurvey.name.length : 0;
    }
    
    // Check if character limit is exceeded [Comment]
    isCharacterLimitExceeded(): boolean {
      return this.getCharacterCount() > 100;
    }

    // Check if character limit is exceeded [Name]
    isCharacterLimitExceededName(): boolean {
      return this.getCharacterCountName() > 30;
    }

  exportToExcel(): void {
    // Map filteredSurveys to the desired structure for Excel
    const surveyData = this.filteredSurveys.map(survey => ({
      'Name': survey.name,
      'Email': survey.emailAddress,
      'Comment': survey.comment,
      'Financing Type': survey.financingType,
      'Star Rating': survey.starRating,
      'Submission Date': survey.submissionDate ? new Date(survey.submissionDate).toLocaleDateString() : ''
    }));
  
    // Create a worksheet from the data
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(surveyData);
  
    // Create a new workbook
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Survey Data': worksheet },
      SheetNames: ['Survey Data'],
    };
  
    // Export the workbook to an Excel file
    XLSX.writeFile(workbook, 'FilteredSurveyData.xlsx');
  }

  productOption: { value: string, display: string} [] = [];

  addNewOption(): void { 
      if(this.newProductValue.trim()) {
        this.productOption.push({ value: this.newProductValue, display: this.newProductValue});
          this.newProductValue = '';
          console.log('Product has been added');
      } else {
        console.log('Product invalid or already exist');
      }
  }

  close(): void {
    this.editedSurvey = null;
    this.updateSurvey = null;
    this.surveyEdit = null;
  }

  toggleSelectAll(event: Event): void {
        const checked = (event.target as HTMLInputElement).checked;
        this.filteredSurveys.forEach(survey => (survey.selected = checked));
  }

  deleteSelected(): void {
    const selectedSurveys = this.filteredSurveys.filter(survey => survey.selected);
    const selectedIds = selectedSurveys.map(survey => survey.id); // Array of selected IDs
    const selectedName = selectedSurveys.map(survey => survey.name); // Array of selected IDs

    if (selectedIds.length === 0) {
        console.log('No surveys selected for deletion');
        return; 
    } else if(selectedIds.length > 0){
      console.log('Selected item', selectedIds)
      console.log('Selected name', selectedName)
    }

    this.surveyService.deleteSurveys(selectedIds).subscribe(
        () => {
            console.log('Selected items deleted successfully');
            this.loadSurveys(); // Reload or refresh the survey list after deletion
        },
        error => console.error('Error deleting selected surveys:', error)
    );
  }

  resetFilters(): void {
    this.selectedStarRating = null;
    this.selectedFinancingType = null;
    this.sortOrder = null;
    this.loadSurveys(); // Reload surveys after resetting filters
    this.startDate = null;
    this.endDate = null;
    this.selectedProduct =  null;
    this.searchText = null;
    this.selectedProductReal = null;
  }

  resetProduct(): void {
    this.selectedProduct = null;
  }

  // Reset the form fields after successful submission
  resetForm(): void {
    this.newSurveyName = '';
    this.newSurveyEmailAddress = '';
    this.newSurveyAge = 0;
    this.newSurveyComment = '';
    this.starRating = 0;
    this.personalFinancingType = '';
    this.newSurveyPhoneNumber = '';
    this.selectedProductReal = null;
  }

  pageSize = 10; 
  currentPage = 1;

  get pageinatedSurveys(){
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.filteredSurveys.slice(startIndex, endIndex);
  }

  //Get total page
  get totalPage() {
    return Math.ceil(this.filteredSurveys.length/this.pageSize);
    
  }

  get visiblePages() {
    const visibleRange = 3; // Number of pages to display at a time
    const pages = [];
  
    // Determine the start and end range for visible pages
    let start = Math.max(this.currentPage - 1, 1);
    let end = Math.min(this.currentPage + 1, this.totalPage);
  
    // Adjust range to ensure consistent number of pages
    if (start === 1) {
      end = Math.min(visibleRange, this.totalPage);
    } else if (end === this.totalPage) {
      start = Math.max(this.totalPage - visibleRange + 1, 1);
    }
  
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
  
    return pages;
  }

  goToFirstPage() {
    this.currentPage = 1;
  }

  goToLastPage() {
    this.currentPage = this.totalPage;
  }

  //Go next page
  nextPage(){
    if(this.currentPage < this.totalPage)
    {
      this.currentPage++;
      console.log('Current Page: ', this.currentPage)
    }
  }

  //Go previous page  
  previousPage() {
    if(this.currentPage > 1)
    {
      this.currentPage--;
      console.log('Current Page: ', this.currentPage)
    }
  }

  //Go specific page
  goToPage(pageNumber: number) {
    this.currentPage = pageNumber;
  }

  productList: surveyItemDto[] = []; // Full list of products from the database
  filteredProducts: surveyItemDto[] = []; // Holds products filtered by selected service
  selectedProductReal: surveyItemDto | null = null;  // Store the selected product object
  selectedProductId: number | null = null;  // To store the selected product ID
  selectedProductName: string = '';         // To store the selected product name

  // This method is triggered when the selected service changes
  onServiceChange(selectedService: string) {
    // Set the financingType to the selectedService value
    this.newSurvey.financingType = selectedService;
  
    // Filter products by selected service name and isActive status
    this.filteredProducts = this.productList.filter(
      product => product.serviceName === selectedService && product.isActive
    );
  
    // Log the selected service and the filtered products for debugging
    console.log('Selected service', selectedService);
    console.log('Filtered active products for selected service:', this.filteredProducts);
  
    // Reset the product selection when service changes
    this.newSurvey.prodId = null; // Reset to trigger validation
  
    // Reset other state variables as needed
    this.selectedProductReal = null;
  }
  
  // This method is triggered when the product selection changes
  onProductChange(): void {
    // Check if a product is selected

    if (this.selectedProductReal) {
      // Store the full product object
      this.selectedProductName = this.selectedProductReal.productName;
      this.selectedProductId = this.selectedProductReal.prodId;


      // Logging the selected product name and id
      console.log('Selected Product Name:', this.selectedProductName);
      console.log('Selected Product ID:', this.selectedProductId);

      
    } else {
      console.log('No product selected');
    }
  }


  getProductNameById(prodId: number): string {
    const product = this.productList.find(p => p.prodId === prodId);
    return product ? product.productName : 'Unknown'; // Return 'Unknown' if no matching product is found
  }

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

// Predefined comments
predefinedComments: string[] = ['Excellent', 'Good', 'Average', 'Bad'];

// Select a predefined comment
selectPredefinedComment(comment: string) {
  this.newSurvey.comment = comment;
  this.showCommentBox = false; // Hide custom comment box if it's open
  console.log(comment);
}

// Clear predefined comment when user writes a custom comment
clearPredefinedComment() {
  if (this.newSurvey.comment !== '') {
    this.newSurvey.comment = this.newSurvey.comment.trim();
  }
}

showCommentBox: boolean = false;

  // This method toggles the visibility of the comment box
  toggleCommentBox() {
    this.showCommentBox = !this.showCommentBox;
    this.newSurvey.comment = '';
  } 

  showAdvanceFilter: boolean = false; 

  toggleAdvanceFilter() {
    this.showAdvanceFilter = !this.showAdvanceFilter;
  }

  surveyEdit: boolean = false;

  toggleEdit() {
    this.surveyEdit = !this.surveyEdit;
  }


}
