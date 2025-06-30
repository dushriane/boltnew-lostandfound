import { max } from "date-fns";

// AI Service for image analysis and description generation
export class AIService {
  private static instance: AIService;
  private apiKey: string = '';

  private constructor() {
    // In production, this would come from environment variables
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY || '';
  }

  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  // Analyze image using AI vision models
  async analyzeImage(imageFile: File): Promise<{
    description: string;
    tags: string[];
    category: string;
    color?: string;
    brand?: string;
    confidence: number;
  }> {
    try {
      // Convert image to base64
      const base64Image = await this.fileToBase64(imageFile);
      
      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers:{
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            {
              role: 'user',
              content: [
                {type: 'text', text:'Describe this image and extract tags, category, color, and brand if applicable.'},
                {type: 'image_url', image_url: base64Image}
              ]
              
            }
          ],
          max_tokens: 500,
        })
      });

      const data = await response.json();
    // Parse the AI's response (assuming it returns a JSON string in the content)
    const content = data.choices?.[0]?.message?.content;
    let result = {
      description: "",
      tags: [],
      category: "",
      color: undefined,
      brand: undefined,
      confidence: 1
    };
    if (content) {
      try {
        // Try to parse JSON from the AI's response
        const parsed = JSON.parse(content);
        result = {
          ...result,
          ...parsed
        };
      } catch {
        result.description = content;
      }
    }
    return result;
    } catch (error) {
      console.error('Error analyzing image:', error);
      throw new Error('Failed to analyze image');
    }
  }

  // Generate image embeddings for similarity comparison
  async generateImageEmbedding(imageFile: File): Promise<number[]> {
    try {
      // In production, this would use a vision model to generate embeddings
      // For demo, we'll generate a mock embedding
      const mockEmbedding = this.generateMockEmbedding();
      return mockEmbedding;
    } catch (error) {
      console.error('Error generating image embedding:', error);
      throw new Error('Failed to generate image embedding');
    }
  }

  // Compare two image embeddings
  calculateImageSimilarity(embedding1: number[], embedding2: number[]): number {
    if (embedding1.length !== embedding2.length) return 0;
    
    // Calculate cosine similarity
    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;
    
    for (let i = 0; i < embedding1.length; i++) {
      dotProduct += embedding1[i] * embedding2[i];
      norm1 += embedding1[i] * embedding1[i];
      norm2 += embedding2[i] * embedding2[i];
    }
    
    const similarity = dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
    return Math.max(0, similarity); // Ensure non-negative
  }

  // Enhanced description generation using AI
  async enhanceDescription(userDescription: string, imageAnalysis?: any): Promise<string> {
    try {
      // In production, this would use GPT or similar to enhance descriptions
      let enhanced = userDescription;
      
      if (imageAnalysis) {
        enhanced += ` AI detected: ${imageAnalysis.description}. Key features: ${imageAnalysis.tags.join(', ')}.`;
      }
      
      return enhanced;
    } catch (error) {
      console.error('Error enhancing description:', error);
      return userDescription;
    }
  }

  // Private helper methods
  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }

  private async simulateAIAnalysis(fileName: string): Promise<any> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock AI analysis based on filename patterns
    const mockAnalyses = [
      {
        description: "A black smartphone with a protective case, appears to be an iPhone with visible home button",
        tags: ["smartphone", "black", "case", "electronic", "mobile"],
        category: "Electronics",
        color: "Black",
        brand: "Apple",
        confidence: 0.92
      },
      {
        description: "Brown leather wallet with multiple card slots and bill compartment",
        tags: ["wallet", "leather", "brown", "cards", "money"],
        category: "Personal Items",
        color: "Brown",
        confidence: 0.88
      },
      {
        description: "Blue backpack with multiple compartments and laptop sleeve",
        tags: ["backpack", "blue", "bag", "laptop", "school"],
        category: "Bags",
        color: "Blue",
        confidence: 0.85
      }
    ];
    
    // Return random analysis for demo
    return mockAnalyses[Math.floor(Math.random() * mockAnalyses.length)];
  }

  private generateMockEmbedding(): number[] {
    // Generate a 512-dimensional mock embedding
    const embedding = [];
    for (let i = 0; i < 512; i++) {
      embedding.push(Math.random() * 2 - 1); // Values between -1 and 1
    }
    return embedding;
  }
}

export const aiService = AIService.getInstance();