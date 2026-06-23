"use client";

import { useState, useRef, useEffect } from "react";
import {
  Headphones,
  Send,
  CheckCircle,
  LogOut,
  MessageCircle,
  User,
  MapPin,
  Building,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

// Types for conversations and messages
interface Customer {
  id: string;
  fullName: string;
  address: string;
  city: string;
  zipCode: string;
  complaint: string;
}

interface Message {
  id: string;
  role: "customer" | "agent" | "system";
  content: string;
  timestamp: Date;
}

interface Conversation {
  id: string;
  customer: Customer;
  status: "active" | "waiting" | "resolved";
  unreadCount: number;
  lastMessage: string;
  messages: Message[];
  createdAt: Date;
}

// Mock data for initial conversations
const initialConversations = (): Conversation[] => [
  {
    id: "1",
    customer: {
      id: "c1",
      fullName: "John Smith",
      address: "456 Oak Avenue",
      city: "Springfield",
      zipCode: "12345",
      complaint: "My trash wasn't collected last Tuesday. I've called twice already and nothing has been done.",
    },
    status: "active",
    unreadCount: 2,
    lastMessage: "This is unacceptable, I need help immediately!",
    createdAt: new Date(Date.now() - 1800000),
    messages: [
      {
        id: "m1",
        role: "system",
        content: "Customer connected to agent",
        timestamp: new Date(Date.now() - 1800000),
      },
      {
        id: "m2",
        role: "customer",
        content: "Hi, I need to report that my trash wasn't collected last Tuesday.",
        timestamp: new Date(Date.now() - 1700000),
      },
      {
        id: "m3",
        role: "customer",
        content: "I've called twice about this and nothing has been done. This is really frustrating.",
        timestamp: new Date(Date.now() - 900000),
      },
      {
        id: "m4",
        role: "customer",
        content: "This is unacceptable, I need help immediately!",
        timestamp: new Date(Date.now() - 300000),
      },
    ],
  },
  {
    id: "2",
    customer: {
      id: "c2",
      fullName: "Maria Garcia",
      address: "789 Pine Street",
      city: "Springfield",
      zipCode: "12346",
      complaint: "I need information about applying for a business permit for a new restaurant.",
    },
    status: "waiting",
    unreadCount: 0,
    lastMessage: "Thank you, I'll wait for your response.",
    createdAt: new Date(Date.now() - 3600000),
    messages: [
      {
        id: "m5",
        role: "system",
        content: "Customer connected to agent",
        timestamp: new Date(Date.now() - 3600000),
      },
      {
        id: "m6",
        role: "customer",
        content: "Hello, I want to open a new restaurant and need information about business permits.",
        timestamp: new Date(Date.now() - 3500000),
      },
      {
        id: "m7",
        role: "customer",
        content: "Thank you, I'll wait for your response.",
        timestamp: new Date(Date.now() - 3400000),
      },
    ],
  },
  {
    id: "3",
    customer: {
      id: "c3",
      fullName: "Robert Johnson",
      address: "321 Maple Drive",
      city: "Springfield",
      zipCode: "12347",
      complaint: "Question about property tax assessment - I believe my assessment is too high.",
    },
    status: "resolved",
    unreadCount: 0,
    lastMessage: "Thank you for your help!",
    createdAt: new Date(Date.now() - 86400000),
    messages: [
      {
        id: "m8",
        role: "system",
        content: "Customer connected to agent",
        timestamp: new Date(Date.now() - 86400000),
      },
      {
        id: "m9",
        role: "customer",
        content: "I'd like to dispute my property tax assessment.",
        timestamp: new Date(Date.now() - 86000000),
      },
      {
        id: "m10",
        role: "agent",
        content: "I can help you with that. Let me pull up your property records.",
        timestamp: new Date(Date.now() - 85000000),
      },
      {
        id: "m11",
        role: "customer",
        content: "Thank you for your help!",
        timestamp: new Date(Date.now() - 84000000),
      },
    ],
  },
];

export default function AgentPage() {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(conversations[0]);
  const [messageInput, setMessageInput] = useState("");
  const [agentStatus, setAgentStatus] = useState<"online" | "away" | "offline">("online");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedConversation?.messages]);

  // Get active conversations count
  const activeCount = conversations.filter((c) => c.status === "active").length;
  const waitingCount = conversations.filter((c) => c.status === "waiting").length;

  // Handle sending a message
  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedConversation) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      role: "agent",
      content: messageInput,
      timestamp: new Date(),
    };

    const updatedConversations = conversations.map((conv) => {
      if (conv.id === selectedConversation.id) {
        return {
          ...conv,
          messages: [...conv.messages, newMessage],
          lastMessage: messageInput,
          status: "active" as const,
        };
      }
      return conv;
    });

    setConversations(updatedConversations);
    setSelectedConversation(updatedConversations.find((c) => c.id === selectedConversation.id) || null);
    setMessageInput("");
  };

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Mark conversation as resolved
  const handleResolveConversation = () => {
    if (!selectedConversation) return;

    const updatedConversations = conversations.map((conv) => {
      if (conv.id === selectedConversation.id) {
        return { ...conv, status: "resolved" as const };
      }
      return conv;
    });

    setConversations(updatedConversations);
    setSelectedConversation(updatedConversations.find((c) => c.id === selectedConversation.id) || null);
  };

  const handleLogout = () => {
    window.location.href = "/";
  };

  // Format time
  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  // Get status badge variant
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default" className="bg-green-500">Active</Badge>;
      case "waiting":
        return <Badge variant="secondary" className="bg-yellow-500">Waiting</Badge>;
      default:
        return <Badge variant="outline">Resolved</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-muted/50">
      {/* Header */}
      <header className="bg-background shadow-sm border-b">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
                <Headphones className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  City Hall Agent Dashboard
                </h1>
                <p className="text-sm text-muted-foreground">Customer Support Portal</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* Status Selector */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Status:</span>
                <select
                  value={agentStatus}
                  onChange={(e) => setAgentStatus(e.target.value as "online" | "away" | "offline")}
                  className="rounded-lg border border-input bg-background px-3 py-1.5 text-sm focus:border-primary focus:outline-none"
                >
                  <option value="online">🟢 Online</option>
                  <option value="away">🟡 Away</option>
                  <option value="offline">🔴 Offline</option>
                </select>

                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
              {/* Stats */}
              <div className="flex items-center gap-4 rounded-lg bg-muted px-4 py-2">
                <div className="text-center">
                  <p className="text-xl font-bold text-primary">{activeCount}</p>
                  <p className="text-xs text-muted-foreground">Active</p>
                </div>
                <Separator orientation="vertical" className="h-8" />
                <div className="text-center">
                  <p className="text-xl font-bold text-yellow-600">{waitingCount}</p>
                  <p className="text-xs text-muted-foreground">Waiting</p>
                </div>
                <Separator orientation="vertical" className="h-8" />
                <div className="text-center">
                  <p className="text-xl font-bold text-green-600">
                    {conversations.filter((c) => c.status === "resolved").length}
                  </p>
                  <p className="text-xs text-muted-foreground">Resolved</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-4">
          {/* Conversations List */}
          <Card className="lg:col-span-1">
            <CardHeader className="border-b">
              <CardTitle>Conversations</CardTitle>
              <p className="text-sm text-muted-foreground">{conversations.length} total conversations</p>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-[calc(100vh-320px)] overflow-y-auto">
                {conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv)}
                    className={`w-full border-b p-4 text-left transition-colors hover:bg-accent ${
                      selectedConversation?.id === conv.id ? "bg-accent" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-foreground truncate">
                            {conv.customer.fullName}
                          </p>
                          {conv.unreadCount > 0 && (
                            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs text-primary-foreground">
                              {conv.unreadCount}
                            </span>
                          )}
                        </div>
                        <p className="truncate text-sm text-muted-foreground">{conv.lastMessage}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{formatTime(conv.createdAt)}</p>
                      </div>
                      <div className="ml-2">
                        {getStatusBadge(conv.status)}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Chat Area */}
          <Card className="lg:col-span-2">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="flex items-center justify-between border-b p-4">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-purple-100 text-purple-600">
                        {selectedConversation.customer.fullName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {selectedConversation.customer.fullName}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {selectedConversation.customer.city}, {selectedConversation.customer.zipCode}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedConversation.status !== "resolved" && (
                      <Button onClick={handleResolveConversation} className="bg-green-600 hover:bg-green-700">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Resolve
                      </Button>
                    )}
                    {selectedConversation.status === "resolved" && (
                      <Badge variant="outline" className="px-4 py-2">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Resolved
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Messages */}
                <div className="h-[400px] overflow-y-auto p-4 space-y-4">
                  {selectedConversation.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.role === "agent" ? "justify-end" : "justify-start"
                      }`}
                    >
                      {message.role === "system" ? (
                        <div className="rounded-lg bg-muted px-3 py-1.5 text-center text-xs text-muted-foreground">
                          {message.content}
                        </div>
                      ) : (
                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                            message.role === "agent"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-foreground"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p
                            className={`mt-1 text-xs ${
                              message.role === "agent" ? "text-primary-foreground/70" : "text-muted-foreground"
                            }`}
                          >
                            {message.timestamp.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                {selectedConversation.status !== "resolved" && (
                  <div className="border-t p-4">
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your response..."
                        className="flex-1"
                      />
                      <Button
                        onClick={handleSendMessage}
                        disabled={!messageInput.trim()}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex h-full items-center justify-center p-8">
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                    <MessageCircle className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">Select a conversation to start</p>
                </div>
              </div>
            )}
          </Card>

          {/* Customer Details */}
          <Card className="lg:col-span-1">
            <CardHeader className="border-b">
              <CardTitle>Customer Details</CardTitle>
            </CardHeader>
            {selectedConversation ? (
              <CardContent className="p-4 space-y-6">
                {/* Customer Info */}
                <div>
                  <h3 className="mb-3 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    Contact Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <label className="text-xs text-muted-foreground">Full Name</label>
                        <p className="font-medium text-foreground">
                          {selectedConversation.customer.fullName}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <label className="text-xs text-muted-foreground">Address</label>
                        <p className="font-medium text-foreground">
                          {selectedConversation.customer.address}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <label className="text-xs text-muted-foreground">City & ZIP</label>
                        <p className="font-medium text-foreground">
                          {selectedConversation.customer.city}, {selectedConversation.customer.zipCode}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Complaint */}
                <div>
                  <h3 className="mb-3 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    Complaint Details
                  </h3>
                  <p className="text-sm text-foreground">
                    {selectedConversation.customer.complaint}
                  </p>
                </div>

                <Separator />

                {/* Quick Actions */}
                <div>
                  <h3 className="mb-3 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    Quick Actions
                  </h3>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <Phone className="h-4 w-4 mr-2" />
                      Call Customer
                    </Button>
                  </div>
                </div>
              </CardContent>
            ) : (
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Select a conversation to view details</p>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
