import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GeminiService } from './gemini.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-test-entity',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './test-entity.component.html',
  styleUrls: ['./test-entity.component.scss']
})
export class TestEntityComponent implements OnInit {

  @ViewChild('chatContainer') chartContainer : ElementRef; 

  chatHistory : {prompt: string, response: string}[] = [];
  showChat: boolean = false;
  showChatBot2: boolean = false;

  ngOnInit(): void {
    this.contextBefore = '';
    this.scrollToBottom();
  }
  
  openChat() {  
    this.showChat = !this.showChat;
  }
  
  openChatbot2() {
    this.showChatBot2 = !this.showChatBot2;
    
  }
  
  closeChat() { 
    this.showChat = !this.showChat
    this.isFullScreen = false; 

    // console.log('FullScreen: ', this.isFullScreen);
    
  }
  
  closeChatBot2() { 
    this.showChatBot2 = !this.showChatBot2

  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.checkMediaQuery(); // Re-check on window resize
  }

  checkMediaQuery(): void {
    const isSmallScreen = window.matchMedia('(max-width: 650px)').matches;
    if (isSmallScreen) {
      this.isFullScreen = false; // Set to false when media query matches
    }
    // console.log('Screen size checked, isFullScreen:', this.isFullScreen);
  }

      title = 'gemini-test';
      prompt: string = '';  
      response: string = '';  
      loading: boolean = false;
      timeResponse: Date;
      timeHistory: { timeResponse : Date }[] = [];
      chatStore: string[] = [];
      sendingState: boolean = false;

      contextBefore: string = '';
      simpleQuestion: string = '';

      isClose: boolean = false; 
      
      geminiService: GeminiService = inject(GeminiService);
      http: HttpClient = inject(HttpClient); 
    
      scrollToBottom(): void {
        if (this.chartContainer?.nativeElement) {
          setTimeout(() => { 
            this.chartContainer.nativeElement.scrollTo({
              top: this.chartContainer.nativeElement.scrollHeight,
              behavior: 'smooth'
            });

          }
          , 10,); // Adjust the timeout value as needed
        }
      }

      isBottom: boolean = false; 


      onScroll() {
        const container = this.chartContainer.nativeElement;
        
        // Define a threshold value (e.g., 50px from the bottom)
        const threshold = 10;
      
        // Check if the user is at the bottom within the threshold
        const isAtBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + threshold;
        
        // Set isBottom to true only if not at the bottom (and within threshold)
        this.isBottom = !isAtBottom;
      
        // console.log(this.isBottom);  // Log whether the user is at the bottom
      }
      


    promptSend(question: string) {
      this.prompt = question;

      this.showSuggestedQuestion = false;
    }

    showSuggestChat() { 
      this.isClose = !this.isClose;
      this.showSuggestedQuestion = true;
      this.showSuggestedQuestion = true;
    }
    
    closeSuggest() {
      this.isClose = !this.isClose;
      this.showSuggestedQuestion = false;
    }
    

    storeContext1: string = '';
    suggestQuestion: string = ""; // Variable to hold the currently displayed question
    isChange: boolean = false;



    async changeQuestion() {
      try {
        this.isChange = true; // Start spinning and disable the button
        const context2 = this.contextBefore + this.storeContext1;
    
        const changeQuestion: string = await this.geminiService.generateText(
          `${context2 + 'create a simple question that match with this information'}`
        );
    
        this.simpleQuestion = changeQuestion;
      } catch (error) {
        console.error('Error changing question: ', error);
      } finally {
        // Delay re-enabling the button
        setTimeout(() => {
          this.isChange = false; // Stop spinning and re-enable the button
        }, 5000); // Delay for 2 seconds (adjust as needed)
      }
    }



    
      async sendData() {
        this.loading = true;
    
          this.scrollToBottom();

        
        // Record the current time
        const currentTime = new Date();
        this.timeHistory.push({ timeResponse: currentTime });
    
        // Add user's prompt to chat history
        const chatEntry = { prompt: this.prompt, response: '', sending: true };
        this.chatHistory.push(chatEntry);
    
        const userPrompt = this.prompt; //save userprompt
        this.prompt = '';  // Clear input field immediately

        try {
          // Fetch context from API for the current prompt
          const context = await this.http
            .get<string>('http://localhost:44305/FileItem', { responseType: 'text' as 'json' })
            .toPromise();
            
            this.storeContext1 = context;
    
          if (userPrompt) {
            let generatedResponse: string;
            let generateSimpleQuestion: string;
    
            // Combine the previously accumulated context with the new user prompt
            const fullContext = `${this.contextBefore} \nUser's question now: ${userPrompt} \nAnswer:`;
            console.log('chat Accumulate: ',this.contextBefore);
    
            // Generate AI response with full context
            generatedResponse = await this.geminiService.generateText(`${context} ${fullContext}`);
    
            // Handle AI response
            chatEntry.response = generatedResponse || "Sorry, I couldn't generate an answer.";
            
            // Update the accumulated context with the new response
            this.contextBefore += `\nUser's question before: ${userPrompt}\nResponse: ${generatedResponse}`;

            const queResponse = `${generatedResponse + ' create a simple question that match with this information ' + context}`;

            generateSimpleQuestion = await this.geminiService.generateText(`${queResponse}`);

            this.simpleQuestion = `${generateSimpleQuestion}`;
          }
        } catch (error) {
          console.error('Error generating response:', error);
          chatEntry.response = 'Error generating response.';
        } finally {
          this.loading = false;
          chatEntry.sending = false;

          this.startInactivityTimer();

          
          console.log('Chat Before', this.contextBefore);
          console.log('Chat History', this.chatHistory);
          console.log('Simple Question: ', this.simpleQuestion);

          this.scrollToBottom();

          this.showSuggestedQuestion = false;
        }
      }

      clearChat(): void { 
        this.chatHistory = [];
        this.contextBefore = ''; 
        console.log('Chat History', this.chatHistory);
        console.log('Context Before', this.contextBefore);
      }

      autoShowTimeOut: any; 
      showSuggestedQuestion: boolean = false;
      
      startInactivityTimer() {
        if (this.autoShowTimeOut) {
          clearTimeout(this.autoShowTimeOut);
        }
    
        // Start a new timer for user inactivity
        this.autoShowTimeOut = setTimeout(() => {
          if (!this.prompt.trim() && this.simpleQuestion) {
            this.showSuggestedQuestion = true; // Show the div after 5 seconds of inactivity
            this.scrollToBottom();
          }
          
        }, 5000); // 5 seconds
      }

      onPromptInput() {
        if (this.showSuggestedQuestion) {
          this.showSuggestedQuestion = false;
        }
        // Optionally restart the inactivity timer
        this.startInactivityTimer();
      }


      isFullScreen: boolean = false;

      viewfullScren(): void { 
        this.isFullScreen = !this.isFullScreen;
        // console.log('FullScreen: ', this.isFullScreen);
      }
    

    getTimeAgo(time: Date): string {
      if (!time) return '';
    
      const now = new Date();
      const diffMs = now.getTime() - time.getTime();
      const diffSeconds = Math.floor(diffMs / 1000);
      const diffMinutes = Math.floor(diffSeconds / 60);
      const diffHours = Math.floor(diffMinutes / 60);
      const diffDays = Math.floor(diffHours / 24);
    
      let relativeTime = '';
      if (diffSeconds < 60) {
        relativeTime = diffSeconds === 1 ? 'just now' : 'just now';
      } else if (diffMinutes < 60) {
        relativeTime = diffMinutes === 1 ? 'a minute ago' : `${diffMinutes} minutes ago`;
      } else if (diffHours < 24) {
        relativeTime = diffHours === 1 ? 'an hour ago' : `${diffHours} hours ago`;
      } else {
        relativeTime = diffDays === 1 ? 'a day ago' : `${diffDays} days ago`;
      }
    
      // Get the actual time in a human-readable format
      const actualTime = time.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });
      
    
      return `${actualTime}`;
    }
    

      formatTextWithParagraphs(text: string): string {
        // Split the text by newline characters (\n)
        const lines = text.split('\n');
    
        // Process each line
        const formattedText = lines
            .map(line => {
                // Replace **text** with <b>text</b>
                let formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
    
                // Remove single * from text
                formattedLine = formattedLine.replace(/\*(.*?)\*/g, '$1');
    
                // Wrap the line with <p> tags if it contains text
                return line.trim() ? `<p>${formattedLine.trim()}</p>` : '';
            })
            .join(''); // Join all lines back into a single string
    
        return formattedText;
    }
    
      
      
      

}
