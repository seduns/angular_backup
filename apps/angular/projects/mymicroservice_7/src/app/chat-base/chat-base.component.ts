import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { resetFakeAsyncZone } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat-base',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './chat-base.component.html',
  styleUrls: ['./chat-base.component.scss']
})
export class ChatBaseComponent implements OnInit {

  file: File | null = null;
  message: string = ''; // To store success or error messages
  files: any[] = []; // Store the list of files

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Load the list of files when the component is initialized
    this.loadFiles();
    
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
  editingFileContent: string = '';


  // Fetch file content by ID
viewFileContent(fileId: number): void {
  this.http.get<any>(`http://localhost:44305/FileItem/${fileId}`).subscribe({
    next: (file) => {
      alert(`Content of ${file.fileName}:\n\n${file.content}`);
    },
    error: () => alert('Failed to fetch file content'),
  });
}

loadFileForEditing(fileId: number): void {
  this.http.get<any>(`http://localhost:44305/FileItem/${fileId}`).subscribe({
    next: (file) => {
      this.editingFileId = file.id;
      this.editingFileName = file.fileName;
      this.editingFileContent = file.content;
    },
    error: () => alert('Failed to fetch file for editing'),
  });
}

updateFileContent(): void {
  if (this.editingFileId === null) {
    alert('No file selected for editing.');
    return;
  }

  const updatedFile = {
    content: this.editingFileContent, // Only send the content to be updated
  };

  this.http.put<any>(`http://localhost:44305/FileItem/${this.editingFileId}`, updatedFile).subscribe({
    next: () => {
      alert('File updated successfully');
      this.editingFileId = null;
      this.editingFileName = null;
      this.editingFileContent = '';
      this.loadFiles(); // Reload the file list to reflect changes
    },
    error: (err) => {
      console.error('Error:', err);
      alert('Failed to update file');
    },
  });
}



cancelEditing(): void {
  this.editingFileId = null;
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
      this.http.post('http://localhost:44305/FileItem', formData).subscribe({
        next: () => {
          this.message = 'File uploaded successfully';
          this.loadFiles(); // Reload the list of files after upload
          this.file = null;
        },
        error: (error) => {
          this.message = `File upload failed: ${error.error.message || 'An error occurred'}`;
          alert('Upload Success');
          this.loadFiles(); // Reload the list of files after upload
          this.file = null;
        }
      });
    } else {
      alert('Please select a file first.');
    }
    

  }

  // Load the list of files from the backend
  

  loadFiles(): void {
    this.http.get<any[]>('http://localhost:44305/FileItem').subscribe({
        next: (response) => (this.files = response),
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
