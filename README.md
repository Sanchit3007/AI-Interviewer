# 🤖 AI Mock Interviewer

![Project Status](https://img.shields.io/badge/Status-Active-green)
![Tech Stack](https://img.shields.io/badge/Stack-Next.js_14_|_Groq_|_Tailwind-blue)

A voice-activated technical interview simulator that helps developers practice answering questions verbally. The app uses the **Web Speech API** to transcribe answers in real-time and sends them to the **Llama 3 LLM** (via Groq) for instant, graded feedback based on technical accuracy, clarity, and depth.

## 🚀 Key Features
* **🎙️ Voice-First Interface:** Uses browser-native Speech-to-Text (no external audio file uploads required) for low-latency interaction.
* **🎲 Random Question Generator:** Features a "Shuffle" mode that randomly selects questions from a diverse pool (HashMaps, React Hooks, System Design, etc.) to simulate unpredictable interview scenarios.
* **🧠 Intelligent Grading:** Custom prompt engineering forces the AI to act as a "Senior Technical Interviewer," grading answers on a 0-100 scale using a strict rubric.
* **⚡ Ultra-Fast Inference:** Powered by Groq Cloud for near-instant AI responses, preventing the awkward "loading" lag common in AI apps.
* **🛡️ Robust JSON Handling:** Implements `json_object` response formats to prevent AI hallucinations and ensure consistent UI rendering.
* **🎨 Modern UI:** Built with Tailwind CSS for a dark-mode, responsive, and distraction-free experience.

## 🛠️ Technical Architecture

### The Stack
* **Frontend:** Next.js 14 (App Router), React, Lucide Icons
* **Styling:** Tailwind CSS
* **AI/LLM:** Llama-3.3-70b-versatile (via Groq SDK)
* **Speech:** Web Speech API (`webkitSpeechRecognition`)

### System Flow
1.  **Audio Capture:** Browser captures microphone input and converts it to a string locally (reducing server load).
2.  **Randomization Logic:** Client-side logic selects a random question ID from a predefined array, resetting the state for a fresh attempt.
3.  **API Route:** Next.js API route receives the transcript + question context.
4.  **Prompt Engineering:** The server injects a system prompt enforcing a strict JSON schema (`{ feedback, rating, betterAnswer }`).
5.  **Inference:** Groq processes the prompt and returns structured data.
6.  **Client Update:** The frontend parses the JSON and updates the DOM without a page reload.

## 📦 Getting Started

### Prerequisites
* Node.js 18+
* A free API Key from [Groq Console](https://console.groq.com)

### Installation
1.  **Clone the repository**
    ```bash
    git clone [https://github.com/Sanchit3007/AI-Interviewer.git](https://github.com/Sanchit3007/AI-Interviewer.git)
    cd ai-mock-interviewer
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment**
    Create a `.env.local` file in the root directory:
    ```env
    GROQ_API_KEY=gsk_your_actual_key_here
    ```

4.  **Run the application**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## 🔮 Future Improvements
* Add "Mock Interview History" using a database (PostgreSQL/Supabase).
* Implement Text-to-Speech (TTS) so the AI "speaks" the feedback.
* Add support for "System Design" questions with a whiteboard canvas.