
export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  chat_id?: string;
}
