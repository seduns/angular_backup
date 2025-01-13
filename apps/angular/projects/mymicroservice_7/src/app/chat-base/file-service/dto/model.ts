export class FileItemDTO {
  fileName: string;
  fileType: string;
  editBy: string;
  reasonChanges: string;
  changesMade: string;
  uploadedAt: string;  // Keep the original upload date
  editedDate: string | null; // Allow editedDate to be nullable
  file: File;  // The actual file object

  constructor(file: File, editedDate: string | null = null) {
    this.file = file;
    this.fileName = file.name;
    this.fileType = file.type;
    this.editBy = file.name;
    this.reasonChanges = file.name;
    this.changesMade = file.name;
    this.uploadedAt = this.uploadedAt || null;  // Add the current date and time if not provided
    this.editedDate = editedDate || null;  // Allow it to be nullable
  }
}
