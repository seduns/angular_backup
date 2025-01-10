import { AfterViewInit, Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Chart, registerables, ChartType } from 'chart.js';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductService } from '../survey/survey-service/controller/product.services';
import { productDto, surveyItemDto } from '../survey/survey-service/dto/model';

Chart.register(...registerables);

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss'],
  imports: [FormsModule, CommonModule], 

  //import the CommonModule to use ngFor
})
export class BarChartComponent implements OnInit {

  newSurveyName: string = '';
  newSurveyAge: number | null = null;
  newSurveyPhoneNumber: string = '';
  newSurveyComment: string = '';
  newSurveyEmailAddress: string = '';
  starRating: number = 0;
  personalFinancingType: string = ''; // Property to store selected financing type
  productSelection: string = ''; // Property to store selected financing type
  submissionDate: Date;
  prodId: number = 0;
  serviceName: string = '';
  productName: string = '';
  isActive: boolean = true;

  productList: surveyItemDto[] = [];

  selectedServiceType: string | null = null;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProduct();
    this.filterProducts();

  }

  newProduct: any = {
    productName: '',
    serviceName: '',   
    isActive: true 
}

  // PERSONAL FINANCING
  create(): void {
    // Validate input fields
    if (!this.newProduct.serviceName || !this.newProduct.productName) {
      console.error('Service name and product name are required.');
      alert('Failed to create product. Please provide both service name and product name.');
      return;
    }
  
    // Call the product service to create a new product
    this.productService.create(this.newProduct).subscribe(
      (createdProduct) => {
        console.log('New product created successfully:', createdProduct);
  
        // Reset newProduct after successful creation
        this.newProduct = {
          productName: '', // Reset the product name
          serviceName: '', // Reset the service name as well
          isActive: true,   // Set default active status
        };
  
        // Reload product list and apply filter
        this.loadProduct();
        this.filterProducts();
  
        alert('Product created successfully!');
      },
      (error) => {
        // Handle failure
        console.error('Failed to create product:', error);
        alert('Failed to create new product. Please try again later.');
      }
    );
  }
  

  deleteProduct(id: string): void { 
    this.productService.delete(id).subscribe(() => {
      console.log(`Product with ${id} successfully delete`);
      this.loadProduct();
    })
  }

  // Load existing products
  loadProduct(): void {
    try {
      this.productService.get().subscribe(
        (response: surveyItemDto[]) => {  // Explicitly typing the response
          console.log('Products fetched:', response);
          this.productList = response; // Assign the array to productList
          this.filterProducts();
        },
        (error) => {
          console.error('Error loading products:', error);
        }
      );
    } catch (error) {
      console.error('Unexpected error in loadProduct:', error);
    }
  }

  activeProducts: surveyItemDto[] = [];  // Only active products
  inactiveProducts: surveyItemDto[] = [];  // Only inactive products

  filteredProducts: surveyItemDto[] = []; // Holds products filtered by selected service
  selectedProductReal: surveyItemDto | null = null;  // Store the selected product object
  selectedProductId: number | null = null;  // To store the selected product ID
  selectedProductName: string = '';         // To store the selected product name
  selectedService: string | null = null;   // Stores the selected service

  onServiceChange(selectedService: string): void {
    this.selectedService = selectedService;
    this.filterProducts();
    console.log('Service selected: ', selectedService)
  }

  filterProducts(): void {
    if (this.selectedService) {
      // Filter by selected service, show both active and inactive products
      this.filteredProducts = this.productList.filter(
        product => product.serviceName === this.selectedService
      );
    } else {
      this.filteredProducts = [];
    }
    console.log('Filtered products for selected service:', this.filteredProducts);
  }

  // Reset the form field
  resetForm(): void { 
    this.serviceName;
    this.productName = '';
    this.newSurveyName = '';
    this.newSurveyAge = null;
    this.newSurveyPhoneNumber = '';
    this.newSurveyComment = '';
    this.newSurveyEmailAddress = '';
    this.starRating = 0;
    this.personalFinancingType = '';
    this.productSelection = '';
    this.submissionDate = new Date();
    this.prodId = 0;
    this.isActive = false;
  }

  //VIEW PRODUCT UPDATE

  selectedProduct: surveyItemDto | null = null; // Track the selected product for the modal
  showModal: boolean = false; // Flag to control modal visibility

  // Function to handle "edit" action for a product
  edit(product: any): void {
    if(this.selectedProduct === product) {
      this.selectedProduct = null; //close
    } else {
      this.selectedProduct = product; //open  
    }
  }

  // Function to open the modal with product details
  viewUpdate(product: surveyItemDto): void {
    this.selectedProduct = product;
    this.showModal = true;
    this.showProductUpdtSide = !this.showProductUpdtSide;
  }

  // Function to close the modal
  close(): void {
    this.showModal = false;
    this.selectedProduct = null;
    this.selectedService = null;
    this.newProduct.serviceName = '';
    this.newProduct.productName = '';
    this.isCardVisible = null;
  }

  closeUpdate(): void {
    this.showModal = false;
    this.loadProduct(); 
    
  }

  closeAfterUpadte(): void { 
    this.showModal = false;
  }

  
  onModelChange(selectedService: string): void {
    this.serviceName = selectedService;
    console.log('Selected service: ', this.serviceName);
  }

  toggleActiveCreditCard(product: surveyItemDto): void {
    // Toggle the isActive value
    product.isActive = !product.isActive;

    // Optionally, if you want to persist this change to the backend:
    this.productService.update(product.prodId, product).subscribe(
      (updatedProduct) => {
        console.log('Product updated:', updatedProduct);
      },
      (error) => {
        console.error('Error updating product:', error);
      }
    );
  }

 

  updateProduct(): void {
  // Ensure the product name and service name are provided before updating
  if (this.selectedProduct.serviceName  === null || this.selectedProduct.productName === null) {
    console.error('Service name and product name are required.');
    console.log('Service name and product name are required.', this.selectedProduct.serviceName);
    console.log('Service name and product name are required.', this.selectedProduct.productName);
    alert('Fail to update product. Service name and product name are required.');
    return;
  }

  // Check if the product ID is available
  if (!this.selectedProduct.prodId) {
    console.error('Product ID is required.');
    alert('Fail to update product. Product ID is required.');
    return;
  }

  const payload = {
    prodId: this.selectedProduct.prodId,
    serviceName: this.selectedProduct.serviceName,
    productName: this.selectedProduct.productName,
    isActive: this.selectedProduct.isActive
    
    
  }

  console.log('Attempting to create survey with:', payload);
  

  // Call the product service to update the product on the server
  this.productService.update(this.selectedProduct.prodId , payload).subscribe(
    (updatedProductResponse) => {
      console.log('Product updated successfully:', updatedProductResponse);
      
      // Reset form and reload products
      this.resetForm();
      this.loadProduct();
      this.filterProducts();
      

      // Optionally, close the modal after th e update
      this.closeAfterUpadte();
      alert('Product updated successfully');
    },
    
    (error) => {
      console.error('Error updating product:', error);
      console.log('Sleect product ', this.selectedProduct.prodId);
      alert('Failed to update product');
    }
  );
}

showProductUpdtSide: boolean = true;
toggleProductUpdtView() {
  this.showProductUpdtSide = !this.showProductUpdtSide;
}

services: string[] = [
  'Personal Financing-i',
  'Home Financing-i',
  'Vehicle Financing',
  'Takaful',
  'Saving-i',
  'Pawn Broking-i',
  'Credit Card-i'
];

isCardVisible: boolean = false;

selectService(serviceName: string): void {
  this.selectedService = serviceName;
  this.isCardVisible = true; // Show the card when a service is selected via button
  this.onServiceChange(serviceName);
}


  
  
}
