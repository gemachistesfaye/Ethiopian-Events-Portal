
export type ReminderPriority = 'Low' | 'Medium' | 'High';
export type ReminderCategory = 'Travel' | 'Religious' | 'Social' | 'General';

export interface EthiopianEvent {
  id: string;
  name: string;
  nameAmharic: string;
  ethDate: string; // e.g., "11 Tir"
  gregDate: string; // e.g., "2026-01-19"
  location: string;
  description: string;
  imageUrl: string;
  category: 'Religious' | 'Public' | 'Cultural';
}

export interface UserReminder {
  id: string;
  eventId?: string;
  dateStr: string;
  note: string;
  priority: ReminderPriority;
  category: ReminderCategory;
  createdAt: string;
}

export interface CalendarDay {
  gregorian: Date;
  ethiopian: {
    year: number;
    month: number;
    day: number;
    monthName: string;
    monthNameAmharic: string;
  };
  events: EthiopianEvent[];
  isToday: boolean;
}

export interface CulturalTrivia {
  question: string;
  answer: string;
  explanation: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
