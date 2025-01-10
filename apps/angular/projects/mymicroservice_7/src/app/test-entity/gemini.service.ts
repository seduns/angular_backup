import { Injectable } from '@angular/core';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable({
  providedIn: 'root'
})
export class GeminiService {

  private generativeAI: GoogleGenerativeAI;

  constructor() {
    this.generativeAI = new GoogleGenerativeAI('AIzaSyDZe6fSJf81SnrqXwEmLyz4Q4ky6mJxJF0');
  } 

  async generateText(prompt: string) {
    const model = this.generativeAI.getGenerativeModel({model: 'gemini-pro'});

    const result = await model.generateContent(prompt); 
    const respone = await result.response;
    const text = respone.text();
    // console.log('Ai generate respone:',text); 
    return text; 
  } catch (error: any) {
    console.error('Error generate text', error); 
    throw error;
  }

    
}

// AIzaSyDZe6fSJf81SnrqXwEmLyz4Q4ky6mJxJF0
// gemini-1.5-flash
