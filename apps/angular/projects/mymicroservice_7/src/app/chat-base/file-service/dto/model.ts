export class FileItemDTO {
    fileName: string;
    fileType: string;
    uploadedAt: string;
    file: File;  // The actual file object
  
    constructor(file: File) {
      this.file = file;
      this.fileName = file.name;
      this.fileType = file.type;
      this.uploadedAt = new Date().toISOString(); // Add the current date and time
    }
  }
  