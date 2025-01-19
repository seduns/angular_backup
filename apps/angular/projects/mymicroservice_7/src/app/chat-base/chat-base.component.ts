import { AuthService } from '@abp/ng.core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, HostListener, OnInit, Renderer2 } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-chat-base',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './chat-base.component.html',
  styleUrls: ['./chat-base.component.scss']
})
export class ChatBaseComponent implements OnInit {



  isUserAdmin: boolean = false;
  isUserOfficer: boolean = false;
  isUserManager: boolean = false;

  userName: string | null = null;


  file: File | null = null;
  message: string = ''; // To store success or error messages
  files: any[] = []; // Store the list of files

  constructor(private http: HttpClient, private renderer: Renderer2, private authService: AuthService) {}
  ngOnInit(): void {
    // Load the list of files when the component is initialized
    this.loadFiles();
    this.setUserDetails(); // Retrieve user details

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

  actionStates: { [fileId: number]: boolean } = {}; // Track visibility for each file

  // Toggle the action menu for a specific file by its ID
  toggleActions(fileId: number, event: MouseEvent): void {
    // Close all action lists first
    if (this.actionStates[fileId  ]   ) {
      this.actionStates[fileId] = false; // If clicked again on the same file, close it
    } else {
      // Close any other action list first, then toggle the current one
      this.actionStates = {}; // Hide all action lists
      this.actionStates[fileId] = true; // Show the action list for the current file
    }
    console.log(fileId);

    // Stop the event from pro  pagating to avoid immediate closing after clicking
  }

  // Check if the actions are visible for a specific file
  areActionsVisible(fileId: number): boolean {
    return this.actionStates[fileId] || false; // Default to false if not yet toggled
  }

  // Close all action menus when clicking outside
  @HostListener('document:click', ['$event'])

  closeActionsOnClickOutside(event: MouseEvent): void {
    // Check if the click happened outside of the action button or list
    const target = event.target as HTMLElement;
    const actionButton = target.closest('.action-button');
    const actionList = target.closest('.action-list');

    // If the target is neither the action button nor the action list, close all action menus
    if (!actionButton && !actionList) {
      this.actionStates = {}; // Hide all action lists
    }
  }


  private setUserDetails(): void {
      const token = this.authService.getAccessToken(); // Get the access token
      if (token) {
        const jwtHelper = new JwtHelperService();
        const decodedToken = jwtHelper.decodeToken(token);
  
        // Extract user details (assuming 'name' claim is present)
        this.userName = decodedToken?.preferred_username || 'Unknown User';
  
        console.log(decodedToken);
  
        console.log('Logged-in user:', this.userName);
      } else {
        console.log('No token available');
      }
    }

  


  // Handle file selection
  onFileSelected(event: any): void {
    this.file = event.target.files[0]; // Get the selected file
  }

  // Validate the file before upload
  validateFile(): boolean {
    if (!this.file) {
      this.message = 'Please select a file.';
      return false;
    }

    // Check if the file is .txt
    if (this.file.type.toLowerCase() !== 'text/plain') {
      this.message = 'Only .txt files are allowed.';
      return false;
    }

    return true;
  }

  editingFileId: number | null = null;
  editingFileName: string | null = null;
  editingEditBy: string | null = null;
  editingFileContent: string = '';
  editingFileReasonChnage: string = '';
  editingFileChangeMade: string = '';
  uploadDate: string = '';
  newUploadDate: string = '';


  infoFileId: number | null = null;
  infoFileName: string | null = null;
  infoEditBy: string | null = null;
  infoFileContent: string = '';
  infoFileReasonChnage: string | null = null;
  infoFileChangeMade: string | null = null;
  infoUploadDate: string = '';
  infoNewUploadDate: string = '';


  // Fetch file content by ID
viewFileContent(fileId: number): void {
  this.http.get<any>(`http://localhost:44305/FileItem/${fileId}`).subscribe({
    next: (file) => {
      alert(`Content of ${file.fileName}:\n\n${file.content}`);
    },
    error: () => alert('Failed to fetch file content'),
  });
}

loadFileForEditing(fileId: string): void {
  // Fetch the file details using the fileId
  this.http.get<any>(`http://localhost:44305/FileItem/${fileId}`).subscribe({
    next: (file) => {
      console.log('Fetched file:', file);  // Log the fetched file
      this.editingFileId = file.id;
      this.editingFileName = file.fileName;
      this.editingFileContent = file.content;
      this.uploadDate = file.uploadedAt;
  
      // Reset fields
      this.reasonForChanges = null;
      this.changesMade = '';
    },
    error: (err) => {
      console.error('Error fetching file:', err);
      alert('Failed to load the file for editing.');
    },
  });
  
}


formSubmit: boolean = false;

updateFileContent(myForm: NgForm, event: Event): void {
  // Trigger validation for all controls in the form
  Object.keys(myForm.controls).forEach((controlName) => {
    myForm.controls[controlName].markAsTouched();
    myForm.controls[controlName].updateValueAndValidity();
  });

  // Check if the form is invalid
  if (myForm.invalid) {
    alert('Please fill out all required fields correctly.');
    return;
  }

  // Prepare the updated file object
  const updatedFile = {
    content: this.editingFileContent, // Updated content
    editBy: this.userName,            // User making the changes
    reasonChanges: this.reasonForChanges, // Reason for changes
    changesMade: this.changesMade,       // Description of changes
    uploadedAt: this.uploadDate,        // Original uploaded date
    editedDate: new Date().toISOString(), // New edited date
  };

  // Make the PUT request to update the file
  this.http.put<any>(`http://localhost:44305/FileItem/${this.editingFileId}`, updatedFile).subscribe({
    next: () => {
      alert('File updated successfully');
      this.formSubmit = false; // Reset the submission state
      this.loadFiles(); // Reload the file list to reflect changes
      this.editingFileId = null;

      // Clear specific fields or reset the form as needed
      this.resetForm(); // Optionally reset the entire form
    },
    error: (err) => {
      console.error('Error updating file:', err);
      alert('Failed to update the file. Please try again.');
      this.formSubmit = false; // Reset the submission state on error
    },
  });
}

resetForm() {
  this.reasonForChanges = '';
  this.changesMade = '';
}





viewInfo(fileId: number): void {

this.isOpen = true;

this.actionStates[fileId] = null;

  this.http.get<any>(`http://localhost:44305/FileItem/${fileId}`).subscribe({
    next: (file) => {
      if (file && file.id) {
        // Populate data only if the file is valid
        this.infoFileId = file;
        this.infoFileName = file.fileName || 'No file name provided';
        this.infoFileContent = file.content || 'Not modified';
        this.infoEditBy = file.editBy || 'Not modified';
        this.viewReasonForChanges = file.reasonChanges || 'Not modified';
        this.viewChangesMade = file.changesMade || 'Not modified';
        this.infoUploadDate = file.uploadedAt; // Keep the original uploadedAt
        this.infoNewUploadDate = file.editedDate; // Store the editedDate
      } else {
        alert('Invalid file data received. Cannot display information.');
      }
    },
    error: () => alert('Failed to fetch file for viewing'),
  });

  console.log('isOpen', this.isOpen);
}

isOpen: boolean = false;

close() {
  this.isOpen = false;
  this.infoFileId = null;
  this.infoFileName = null;
  this.infoFileContent =  null;
  this.infoEditBy =  null;
  this.viewReasonForChanges =  null;
  this.viewChangesMade =  null;
  this.infoUploadDate =  null;
  this.infoNewUploadDate = null; 
}

cancelEditing(): void {
  this.editingFileId = null;
  this.infoFileId = null;
  this.changesMade = null;
  this.reasonForChanges = null;
  this.editingFileName = null;
  this.editingFileContent = '';
}





  // Submit the file to the backend
  onSubmit(): void {
    if (this.validateFile()) {
      const formData = new FormData();
      formData.append('file', this.file);
      formData.append('fileName', this.file.name);
      formData.append('fileType', this.file.type);
      formData.append('uploadedAt', new Date().toISOString()); // Add current date

      // Send the file data to the backend
      this.http.post('http://localhost:44305/FileItem', formData, { responseType: 'text'}).subscribe({
        next: (response) => {
          console.log('Response:', response);
          alert('File submit successfully');
          this.loadFiles();
          this.file = null;
        },
        error: (error) => {
          console.log('Error Response:', error);
          this.message = `File upload failed: ${error.error.message || 'An error occurred'}`;
          alert(this.message);
          this.loadFiles();
          this.file = null;
        },
      });
      
    } else {
      alert('Please select a file first.');
    }
    

  }

  // Load the list of files from the backend
  
  loadFiles(): void {
    this.http.get<any[]>('http://localhost:44305/FileItem').subscribe({
      next: (response) => {
        this.files = response;
        console.log(response);  // Log the response to the console
      },
      error: () => alert('Failed to fetch files'),
    });
  }
  

  // Download the file
  downloadFile(fileId: number): void {
    this.http.get(`http://localhost:44305/FileItem/${fileId}`, { responseType: 'json' }).subscribe({
      next: (fileData) => {
        // Convert JSON data to a pretty-printed string
        const prettyPrintedJson = JSON.stringify(fileData, null, 2);
  
        // Create a Blob from the pretty-printed JSON
        const fileBlob = new Blob([prettyPrintedJson], { type: 'text/plain' });
  
        // Create a temporary URL for the Blob
        const downloadUrl = URL.createObjectURL(fileBlob);
  
        // Create an anchor element dynamically
        const link = document.createElement('a');
        link.href = downloadUrl;
  
        // Set the download file name
        link.download = `file_${fileId}.txt`;
  
        // Trigger the download
        link.click();
  
        // Clean up the URL object to release memory
        URL.revokeObjectURL(downloadUrl);
      },
      error: (error) => {
        this.message = `Failed to download file: ${error.error.message || 'An error occurred'}`;
      }
    });
  }
  

  // Delete the file
  deleteFile(fileId: number): void {
    if (confirm('Are you sure you want to delete this file?')) {
      this.http.delete(`http://localhost:44305/FileItem/${fileId}`).subscribe({
        next: () => {
          alert('File deleted successfully');
          this.ngOnInit(); // Refresh the file list
        },
        error: () => alert('Failed to delete the file'),
      });
    }
  }

    reasonForChanges: string = '';
    changesMade: string = '';

    viewReasonForChanges: string = '';
    viewChangesMade: string = '';











  inputFields: string[] = ['']; // Initialize with one input field

  // Add a new input field
  addInputField(): void {
    this.inputFields.push('');  
  }

  // Remove a specific input field
  removeInputField(index: number): void {
    this.inputFields.splice(index, 1);
  }

  // Update value of a specific input field
  updateInputValue(index: number, value: string): void {
    this.inputFields[index] = value;
  } 

  // Submit and log all input field values
  submit(): void {
    console.log('Input values:', this.inputFields);
  }

  
}
