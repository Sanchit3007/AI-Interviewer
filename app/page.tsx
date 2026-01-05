 
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useRef } from "react";
import { RefreshCw, Clock } from "lucide-react"; // Added Clock icon

interface FeedbackData {
  feedback: string;
  rating: number;
  betterAnswer: string;
}

const INTERVIEW_QUESTIONS = [
  { id: 1, text: "Explain how a HashMap works." },
  { id: 2, text: "What is the difference between TCP and UDP?" },
  { id: 3, text: "Explain the concept of React Hooks." },
  { id: 4, text: "What happens when you type a URL into a browser?" },
  { id: 5, text: "Describe the difference between a Process and a Thread." },
  { id: 6, text: "What is the difference between '==' and '===' in JavaScript?" },
  { id: 7, text: "Explain the concept of RESTful APIs." },
  { id: 8, text: "What is the Virtual DOM in React?" },
  { id: 9, text: "Explain the concept of Closures in JavaScript." },
  { id: 10, text: "What is ACID property in Databases?" }
];

export default function Home() {
  const [selectedQuestion, setSelectedQuestion] = useState(INTERVIEW_QUESTIONS[0]);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);
  const [loading, setLoading] = useState(false);
  
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.onresult = (event: any) => {
          let currentTranscript = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          setTranscript(currentTranscript);
        };

        recognitionRef.current = recognition;
      }
    }
    // Random question on load
    handleRandomQuestion();
  }, []);

  // --- NEW: Auto-Advance Feature ---
  useEffect(() => {
    if (feedback) {
      // Wait 10 seconds (10000ms) after feedback, then switch question
      const timer = setTimeout(() => {
        handleRandomQuestion();
      }, 10000);

      // Cleanup timer if user clicks button manually
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  const handleRandomQuestion = () => {
    const randomIndex = Math.floor(Math.random() * INTERVIEW_QUESTIONS.length);
    setSelectedQuestion(INTERVIEW_QUESTIONS[randomIndex]);
    setTranscript("");
    setFeedback(null);
  };

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      setFeedback(null);
      setTranscript("");
      recognitionRef.current?.start();
      setIsRecording(true);
    }
  };

  const analyzeAnswer = async () => {
    if (!transcript) return;
    
    setLoading(true);
    try {
      const response = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: transcript, 
          question: selectedQuestion.text 
        }),
      });

      const data = await response.json();
      setFeedback(data);
    } catch (error) {
      console.error("Error fetching feedback:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-8 font-sans">
      <div className="max-w-3xl w-full space-y-8">
        
        <header className="text-center space-y-6 mb-8">
          <h1 className="text-4xl font-bold bg-linear-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            AI Mock Interviewer
          </h1>
          
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg relative">
            <p className="text-gray-400 text-sm mb-2 uppercase tracking-wider font-semibold">Current Question</p>
            <h2 className="text-xl md:text-2xl font-medium text-white transition-all">
              "{selectedQuestion.text}"
            </h2>
            
            <button 
              onClick={handleRandomQuestion}
              className="mt-4 flex items-center justify-center gap-2 mx-auto text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
            >
              <RefreshCw size={18} />
              <span className="font-semibold">Shuffle Question</span>
            </button>
          </div>
        </header>

        <div className="bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Your Answer</h2>
            <button
              onClick={toggleRecording}
              className={`px-4 py-2 rounded-full font-bold transition-all ${
                isRecording
                  ? "bg-red-500 hover:bg-red-600 animate-pulse"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isRecording ? "Stop Recording" : "Start Recording"}
            </button>
          </div>

          <div className="bg-gray-900 p-4 rounded-lg min-h-37.5 border border-gray-700 text-gray-300">
            {transcript || <span className="text-gray-600 italic">Press start and begin speaking...</span>}
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={analyzeAnswer}
              disabled={!transcript || isRecording || loading}
              className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              {loading ? "Analyzing..." : "Get Feedback"}
            </button>
          </div>
        </div>

        {feedback && (
          <div className="bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700 animate-fade-in relative">
             {/* Timer Indicator */}
            <div className="absolute top-4 right-4 flex items-center gap-2 text-yellow-500 text-sm animate-pulse">
              <Clock size={16} />
              <span>Next question in 10s...</span>
            </div>

            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              AI Feedback
              <span className={`text-sm px-3 py-1 rounded-full ${
                feedback.rating > 70 ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'
              }`}>
                Score: {feedback.rating}/100
              </span>
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-blue-400 font-semibold mb-1">Critique</h3>
                <p className="text-gray-300 leading-relaxed">{feedback.feedback}</p>
              </div>
              
              <div className="bg-gray-900 p-4 rounded-lg border border-gray-600">
                <h3 className="text-purple-400 font-semibold mb-2">Suggested Improvement</h3>
                <p className="text-gray-300 italic">"{feedback.betterAnswer}"</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}