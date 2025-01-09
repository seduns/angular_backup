// import { Component, OnInit } from '@angular/core';
// import { SurveyService } from './surveyService/survey.service';
// import { SurveyItemDto } from './surveyService/Dto/models';
// import { AuthService } from '@abp/ng.core';
// import { NgForm } from '@angular/forms';
// import { ToastrService } from 'ngx-toastr';
// import { Chart } from 'chart.js/auto';

// @Component({
//   selector: 'app-survey',
//   templateUrl: './survey.html',
//   styleUrls: ['./survey.component.scss'],
// })
// export class SurveyComponent implements OnInit {

//   surveys: SurveyItemDto[] = [];
//   newSurvey: SurveyItemDto = { 
//     name: '',
//     email: '', 
//     category: '', 
//     ansQ1: '', 
//     commentQ1: '', 
//     ansQ2: '', 
//     commentQ2: '', 
//     ansQ3: '', 
//     commentQ3: '' 
//   };
//   isUserAdmin: boolean = false;
//   isUserOfficer: boolean = false;
//   isUserManager: boolean = false;

//   selectedCategory: string = '';
//   selectedSurvey: SurveyItemDto = null;

//   filteredSurveys: SurveyItemDto[] = [];
//   selectedRating: number | null = null;

//   sortColumn: string = '';
//   sortAscending: boolean = true;

//   pieChart: Chart | undefined;
//   barChart: Chart | undefined;

//   private ratingMap: { [key: string]: number } = {
//     'Very Bad': 1,
//     'Bad': 2,
//     'Neutral': 3,
//     'Good': 4,
//     'Very Good': 5
//   };

//   errorMessage: string = ''; // To store error messages

//   totalSubmissions: number = 0;
//   totalPersonalSubmissions: number = 0;
//   totalHomeSubmissions: number = 0;
//   totalVehicleSubmissions: number = 0;
//   totalPersonalRating_1: number = 0;
//   totalPersonalRating_2: number = 0;
//   totalPersonalRating_3: number = 0;
//   totalPersonalRating_4: number = 0;
//   totalPersonalRating_5: number = 0;

  
//   totalHomeRating_1: number = 0;
//   totalHomeRating_2: number = 0;
//   totalHomeRating_3: number = 0;
//   totalHomeRating_4: number = 0;
//   totalHomeRating_5: number = 0;

  
//   totalVehicleRating_1: number = 0;
//   totalVehicleRating_2: number = 0;
//   totalVehicleRating_3: number = 0;
//   totalVehicleRating_4: number = 0;
//   totalVehicleRating_5: number = 0;


//   constructor(private surveyService: SurveyService, private authService: AuthService, private toastr: ToastrService) {}

//   ngOnInit(): void {
//     this.loadSurveys();

//     // Fetch all todo items when the component initializes
//     this.surveyService.getAll().subscribe(response => {
//       this.surveys = response;
//     });

//     if (this.authService.isAuthenticated) {
//       const token = this.authService.getAccessToken(); // Get the access token
//       const payload = this.parseJwt(token); // Parse the token to get claims
//       this.isUserAdmin = payload?.role === 'admin'; // Check if the user is an Admin
//       this.isUserOfficer = payload?.role === 'officer';
//       this.isUserManager = payload?.role === 'manager';
//     }

//     this.surveyService.getAll().subscribe(response => {
//       this.surveys = response;
//       // this.createPieChart();
//       this.createBarChart();
//     });
  
//   }

//   private parseJwt(token: string): any {
//     if (!token) return null;
//     const payloadBase64 = token.split('.')[1]; // Get the payload part of the JWT
//     const payloadJson = atob(payloadBase64); // Decode from base64
//     return JSON.parse(payloadJson); // Return the parsed payload
//   }

//   // Add a new survey
//   addSurvey(surveyForm: NgForm): void {
//     if (surveyForm.valid) {
//       // Proceed to submit the survey
//       this.surveyService.create(this.newSurvey).subscribe({
//         next: () => {
//           // On success
//           this.toastr.success('Survey is successfully submitted!', 'success');
//           this.ngOnInit(); // Refresh the survey list after adding
//           this.newSurvey = { 
//             name: '', 
//             email: '', 
//             category: '', 
//             ansQ1: '', 
//             commentQ1: '', 
//             ansQ2: '', 
//             commentQ2: '', 
//             ansQ3: '', 
//             commentQ3: '' 
//           }; // Reset the form
//         },
//         error: (err) => {
//           // Check if the error is about duplicate email and category
//           if (err.status === 400 || err.status === 409) { // Adjusted error checking
//             this.toastr.error('A survey with this email and category already exists.', 'Duplicate Entry');
//           } else {
//             this.toastr.error('Something went wrong. Please try again later.', 'Error');
//           }
//         }
//       });
//     } else {
//       this.toastr.error('Please fill out the form correctly.', 'Form Error');
//     }
//   }

//   // Update an existing survey
//   updateSurvey(survey: SurveyItemDto): void {
//     this.surveyService.update(survey.id, survey).subscribe(() => {
//       this.ngOnInit(); // Refresh the survey list after updating
//     });
//   }

//   // Delete a survey with confirmation
//   deleteSurvey(id: string): void {
//     const confirmDelete = window.confirm('Are you sure you want to delete this survey? This action cannot be undone.');

//     if (confirmDelete) {
//       this.surveyService.delete(id).subscribe(() => {
//         this.toastr.success('Survey deleted successfully.');
//         this.selectedSurvey = null;
//         this.surveyService.getAll().subscribe(response => {
//           this.surveys = response;
//         }); // Refresh the survey list after deleting
//       }, error => {
//         this.toastr.error('An error occurred while deleting the survey.');
//         console.error('Error deleting survey:', error);
//       });
//     } else {
//       this.toastr.info('Survey deletion canceled.');
//     }
//   }

//   // Select a survey for detailed view
//   detail(survey: SurveyItemDto): void {
//     this.selectedSurvey = { ...survey }; // Clone the survey item to prevent direct binding
//     this.surveys = null;

//   }
  
//   goBackOfficer() {
//     this.selectedSurvey = null;
//     this.surveyService.getAll().subscribe(response => {
//       this.surveys = response;
//     });
//   }

//   goBackManager() {
//     this.selectedSurvey = null; // Reset selected survey to hide detailed view
//     this.selectedCategory = ''; // Reset the selected category
//     this.selectedRating = null; // Reset the selected rating
//     this.filteredSurveys = []; // Clear filtered survey list

//   // Reload all surveys
//     this.surveyService.getAll().subscribe(response => {
//       this.surveys = response;
//       this.totalSubmissions = this.surveys.length; // Recalculate total submissions
//       this.calculatePersonalSubmissions(); // Recalculate personal submissions
//       this.calculateHomeSubmissions(); // Recalculate home submissions
//       this.calculateVehicleSubmissions(); // Recalculate vehicle submissions
//   });
//   }

//   // Load surveys
//   loadSurveys(): void {
//     this.surveyService.getAll().subscribe({
//       next: (response) => {
//         this.surveys = response;
//         this.totalSubmissions = this.surveys.length; // get the length of the submission 
//         this.calculatePersonalSubmissions(); // Calculate personal submissions
//         this.calculateHomeSubmissions(); // Calculate home submissions
//         this.calculateVehicleSubmissions(); // Calculate vehicle submissions
//       },
//       error: (error) => {
//         console.error('Error loading surveys: ', error);
//         this.errorMessage = 'There was a problem loading the survey items. Please try again.';
//       }
//     });
//   }

//    // Method to calculate total submissions for the personal category
//    calculatePersonalSubmissions(): void {
//     this.totalPersonalSubmissions = this.surveys.filter(survey => survey.category === 'personal').length;
//     this.totalPersonalRating_1 = this.surveys.filter(survey => survey.category === 'personal' && survey.ansQ3 === '1').length;
//     this.totalPersonalRating_2 = this.surveys.filter(survey => survey.category === 'personal' && survey.ansQ3 === '2').length;
//     this.totalPersonalRating_3 = this.surveys.filter(survey => survey.category === 'personal' && survey.ansQ3 === '3').length;
//     this.totalPersonalRating_4 = this.surveys.filter(survey => survey.category === 'personal' && survey.ansQ3 === '4').length;
//     this.totalPersonalRating_5 = this.surveys.filter(survey => survey.category === 'personal' && survey.ansQ3 === '5').length;
//   } 
//    // Method to calculate total submissions for the personal category
//    calculateHomeSubmissions(): void {
//     this.totalHomeSubmissions = this.surveys.filter(survey => survey.category === 'home').length;
//     this.totalHomeRating_1 = this.surveys.filter(survey => survey.category === 'home' && survey.ansQ3 === '1').length;
//     this.totalHomeRating_2 = this.surveys.filter(survey => survey.category === 'home' && survey.ansQ3 === '2').length;
//     this.totalHomeRating_3 = this.surveys.filter(survey => survey.category === 'home' && survey.ansQ3 === '3').length;
//     this.totalHomeRating_4 = this.surveys.filter(survey => survey.category === 'home' && survey.ansQ3 === '4').length;
//     this.totalHomeRating_5 = this.surveys.filter(survey => survey.category === 'home' && survey.ansQ3 === '5').length;
//   }
//    // Method to calculate total submissions for the personal category
//    calculateVehicleSubmissions(): void {
//     this.totalVehicleSubmissions = this.surveys.filter(survey => survey.category === 'vehicle').length;
//     this.totalVehicleRating_1 = this.surveys.filter(survey => survey.category === 'vehicle' && survey.ansQ3 === '1').length;
//     this.totalVehicleRating_2 = this.surveys.filter(survey => survey.category === 'vehicle' && survey.ansQ3 === '2').length;
//     this.totalVehicleRating_3 = this.surveys.filter(survey => survey.category === 'vehicle' && survey.ansQ3 === '3').length;
//     this.totalVehicleRating_4 = this.surveys.filter(survey => survey.category === 'vehicle' && survey.ansQ3 === '4').length;
//     this.totalVehicleRating_5 = this.surveys.filter(survey => survey.category === 'vehicle' && survey.ansQ3 === '5').length;
//   }

//   viewRatingDetails(category: string, rating: number) {
//     this.selectedCategory = category;
//     this.selectedRating = rating;
    
//     // Filter the surveys based on the selected category and rating
//     this.filteredSurveys = this.surveys.filter(survey => 
//       survey.category === category && parseInt(survey.ansQ3) === rating
//     );
//   }

//   sortBy(column: string): void {
//     if (this.sortColumn === column) {
//       this.sortAscending = !this.sortAscending; // Toggle sort direction
//     } else {
//       this.sortColumn = column;
//       this.sortAscending = true; // Default to ascending on first sort
//     }
  
//     this.surveys.sort((a, b) => this.compareSurveys(a, b, column));
//   }

//   compareSurveys(a: SurveyItemDto, b: SurveyItemDto, column: string): number {
//     let valA: any, valB: any;
  
//     if (column === 'ansQ1') {
//       valA = this.ratingMap[a[column]] || 0; // Convert 'Very Bad' to 'Very Good' to numbers
//       valB = this.ratingMap[b[column]] || 0;
//     } else if (column === 'ansQ2') {
//       valA = this.ratingMap[a[column]] || 0; // Convert 'Very Bad' to 'Very Good' to numbers
//       valB = this.ratingMap[b[column]] || 0;
//     } else if (column === 'ansQ3') {
//       valA = parseInt(a[column], 10) || 0; // Convert the string to a number
//       valB = parseInt(b[column], 10) || 0;
//     }
  
//     // Return value based on ascending/descending
//     return this.sortAscending ? valA - valB : valB - valA;
//   }

//   createBarChart() {
//     const categories = ['1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars'];
//     const personalRatings = [
//       this.totalPersonalRating_1, 
//       this.totalPersonalRating_2, 
//       this.totalPersonalRating_3, 
//       this.totalPersonalRating_4, 
//       this.totalPersonalRating_5
//     ];
//     const homeRatings = [
//       this.totalHomeRating_1, 
//       this.totalHomeRating_2, 
//       this.totalHomeRating_3, 
//       this.totalHomeRating_4, 
//       this.totalHomeRating_5
//     ];
//     const vehicleRatings = [
//       this.totalVehicleRating_1, 
//       this.totalVehicleRating_2, 
//       this.totalVehicleRating_3, 
//       this.totalVehicleRating_4, 
//       this.totalVehicleRating_5
//     ];

//     const ctx = document.getElementById('barChart') as HTMLCanvasElement;

//     if (this.barChart) {
//       this.barChart.destroy(); // Destroy previous instance to prevent overlap
//     }

//     this.barChart = new Chart(ctx, {
//       type: 'bar',
//       data: {
//         labels: categories,
//         datasets: [
//           {
//             label: 'Personal',
//             data: personalRatings,
//             backgroundColor: '#FF6384'
//           },
//           {
//             label: 'Home',
//             data: homeRatings,
//             backgroundColor: '#36A2EB'
//           },
//           {
//             label: 'Vehicle',
//             data: vehicleRatings,
//             backgroundColor: '#FFCE56'
//           }
//         ]
//       },
//       options: {
//         responsive: true,
//         scales: {
//           y: {
//             beginAtZero: true,
//             min: 0, // Set minimum value to 0
//             max: 100, // Set maximum value to 10
//             ticks: {
//               stepSize: 10 // Ensure integer steps on Y-axis
//             }
//           }
//         }
//       }
//     });
//   }
// }