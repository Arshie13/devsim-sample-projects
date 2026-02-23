"use client";

import { useState, useRef, useEffect } from "react";
import {
  Building2,
  Send,
  Bot,
  Headphones,
  ArrowLeft,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

// Types for chat messages
interface Message {
  id: string;
  role: "user" | "ai" | "agent";
  content: string;
  timestamp: Date;
}

// AI responses for the City Hall helper
const aiResponses: Record<string, string> = {
  default:
    "I'm your City Hall AI Assistant. I can help you with information about city services, permits, taxes, public utilities, and more. How can I assist you today?",
  permits:
    "For permits and licenses, you can visit the City Hall Building Division on the 2nd floor. Required documents typically include: valid ID, proof of property ownership, and completed application forms. Would you like me to connect you to a real agent for specific permit questions?",
  taxes:
    "For tax-related inquiries, the City Treasurer's Office is available Monday-Friday, 8am-5pm. You can also pay property taxes online through our city portal. For detailed tax information, would you like to speak with an agent?",
  utilities:
    "For water, electricity, and other utility services, please contact the Public Utilities Department at (555) 123-4567. You can also report outages through the city's mobile app. Need more help? I can connect you to an agent.",
  trash: "Trash collection is available Monday-Friday in residential areas. Please place bins by 7am on collection day. Recycling is collected on Wednesdays. For missed pickups, call (555) 123-4567.",
  parking:
    "Parking permits can be obtained from the Traffic Management Office. Street parking is free for 2 hours. For parking violations, you can contest them at the City Clerk's office within 14 days.",
  "city council":
    "The City Council meets every first and third Tuesday of the month at 6pm. Public comments are welcome during the first 30 minutes. Meeting minutes are available on the city website.",
  hours:
    "City Hall is open Monday-Friday from 8:00 AM to 5:00 PM. Most departments close for lunch from 12:00 PM to 1:00 PM. Emergency services are available 24/7.",
};

export default function SupportPage() {
  // State for chat
  const [messages, setMessages] = useState<Message[]>(() => [
    {
      id: "1",
      role: "ai",
      content:
        "Welcome to City Hall Customer Support! I'm your AI Assistant. I can help you with information about city services, permits, taxes, utilities, and more. How can I assist you today?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // State for agent connection
  const [showAgentForm, setShowAgentForm] = useState(false);
  const [isConnectedToAgent, setIsConnectedToAgent] = useState(false);
  const [agentQueuePosition, setAgentQueuePosition] = useState<number | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    city: "",
    zipCode: "",
    complaint: "",
  });

  // Scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Generate AI response
  const getAIResponse = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase();
    for (const [key, response] of Object.entries(aiResponses)) {
      if (lowerInput.includes(key)) {
        return response;
      }
    }
    return aiResponses.default;
  };

  // Handle sending message
  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: getAIResponse(inputValue),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000);
  };

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Handle connect to agent
  const handleConnectToAgent = () => {
    setShowAgentForm(true);
  };

  // Handle submit agent request
  const handleSubmitAgentRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setShowAgentForm(false);
    setAgentQueuePosition(2);

    // Simulate queue
    setTimeout(() => {
      setAgentQueuePosition(1);
      setTimeout(() => {
        setAgentQueuePosition(null);
        setIsConnectedToAgent(true);

        // Add system message
        const systemMessage: Message = {
          id: Date.now().toString(),
          role: "agent",
          content: "Hello! I'm Agent Sarah. I'm here to help you with your City Hall concerns. How may I assist you today?",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, systemMessage]);
      }, 2000);
    }, 2000);
  };

  // Handle logout
  const handleLogout = () => {
    window.location.href = "/";
  };

  // Handle back to main
  const handleBackToMain = () => {
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-muted/50">
      {/* Header */}
      <header className="bg-background shadow-sm border-b">
        <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={handleBackToMain}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
                <Building2 className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  City Hall Support
                </h1>
                <p className="text-sm text-muted-foreground">Customer Portal</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Return to menu
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
        {showAgentForm ? (
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Connect with an Agent</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitAgentRequest} className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Full Name</label>
                  <Input
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Enter your full name"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Address</label>
                  <Input
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Enter your address"
                    className="mt-1"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">City</label>
                    <Input
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="City"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">ZIP Code</label>
                    <Input
                      required
                      value={formData.zipCode}
                      onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                      placeholder="ZIP Code"
                      className="mt-1"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">How can we help?</label>
                  <Input
                    required
                    value={formData.complaint}
                    onChange={(e) => setFormData({ ...formData, complaint: e.target.value })}
                    placeholder="Describe your issue"
                    className="mt-1"
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={() => setShowAgentForm(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1">
                    Submit Request
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card className="h-[calc(100vh-200px)] flex flex-col">
            {/* Chat Header */}
            <div className="flex items-center justify-between border-b p-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar>
                    <AvatarFallback className={isConnectedToAgent ? "bg-green-500" : "bg-blue-500"}>
                      {isConnectedToAgent ? <Headphones className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>
                  <span
                    className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background ${
                      isConnectedToAgent ? "bg-green-500" : "bg-blue-500"
                    }`}
                  />
                </div>
                <div>
                  <h2 className="font-semibold text-foreground">
                    {isConnectedToAgent ? "Agent Sarah" : "AI Assistant"}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {isConnectedToAgent
                      ? "Online"
                      : isTyping
                      ? "Typing..."
                      : "Always available"}
                  </p>
                </div>
              </div>
              {!isConnectedToAgent && (
                <Button onClick={handleConnectToAgent} className="bg-green-600 hover:bg-green-700">
                  <Headphones className="h-4 w-4 mr-2" />
                  Talk to Agent
                </Button>
              )}
            </div>

            {/* Messages Area */}
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : message.role === "agent"
                        ? "bg-green-100 text-green-900"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {message.role !== "user" && (
                        <div className="mt-1 flex-shrink-0">
                          {message.role === "agent" ? (
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="bg-green-500 text-white text-xs">A</AvatarFallback>
                            </Avatar>
                          ) : (
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="bg-blue-500">
                                <Bot className="h-3 w-3 text-white" />
                              </AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                      )}
                      <div>
                        <p className="text-sm">{message.content}</p>
                        <p
                          className={`mt-1 text-xs ${
                            message.role === "user"
                              ? "text-primary-foreground/70"
                              : "text-muted-foreground"
                          }`}
                        >
                          {message.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="rounded-2xl bg-muted px-4 py-3">
                    <div className="flex gap-1">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:0.1s]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:0.2s]" />
                    </div>
                  </div>
                </div>
              )}
              {agentQueuePosition !== null && agentQueuePosition > 0 && (
                <div className="flex justify-center">
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    Connecting to agent... ({agentQueuePosition} in queue)
                  </Badge>
                </div>
              )}
              <div ref={messagesEndRef} />
            </CardContent>

            {/* Input Area */}
            <div className="border-t p-4">
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={
                    isConnectedToAgent
                      ? "Type your message to the agent..."
                      : "Type your message to AI Assistant..."
                  }
                />
                <Button onClick={handleSendMessage} disabled={!inputValue.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
