// Main queue interface
export interface Queue {
  id?: string;               // Firestore document ID (optional for new queues)
  name: string;              // Queue name (e.g., "Talho", "Peixaria")
  number: number;            // Current queue number
  icon: number;              // Material Design icon code
  backgroundColor: number;   // Background color as number
  videoURL: string;          // URL for background video
  videoVolume: number;       // Video volume (0-100)
  soundVolume: number;       // Sound volume (0-100)
  velocity: number;          // Scroll/transition speed
}

// Form data type for creating/editing queues
export interface QueueFormData {
  name: string;
  number: number;
  icon: number;
  backgroundColor: number;
  videoURL: string;
  videoVolume: number;
  soundVolume: number;
  velocity: number;
}
