    export interface surveyItemDto{
    id?: number;
    name?: string;
    emailAddress?: string;
    comment?: string;
    financingType?: string;
    starRating?: number;
    submissionDate?: Date;
    selected?: boolean;
    phoneNumber?: string;
    
    prodId: number;
    productName?: string;
    serviceName?: string;   
    isActive?: boolean;
    ratings?;
    // prodId: number;
    // productSelection?: string;
    // productName?: string;

}

export interface productDto {
}




export interface groupProduct {
    productName: string;
    starRatings: number[];  // Array to hold counts for star ratings 1 to 5
  }

export interface personalProductDto {
    
    id: number;
    productName?: string; 
    isActive?: boolean;
    value?: { [key: number]: number};
}

export interface HomeProductDto {
    
    id: number;
    productName?: string; 
    isActive?: boolean;
    value?: { [key: number]: number};
}

export interface VehicleProductDto {
    
    id: number;
    productName?: string; 
    isActive?: boolean;
    value?: { [key: number]: number};
}

export interface TakafulProductDto {
    
    id: number;
    productName?: string; 
    isActive?: boolean;
    value?: { [key: number]: number};
}

export interface SavingProductDto {
    
    id: number;
    productName?: string; 
    isActive?: boolean;
    value?: { [key: number]: number};
}

export interface PawnBrokingProductDto {
    
    id: number;
    productName?: string; 
    isActive?: boolean;
    value?: { [key: number]: number};
}

export interface CreditCardProductDto {
    
    id: number;
    productName?: string; 
    isActive?: boolean;
    value?: { [key: number]: number};
}


//========================================



  
