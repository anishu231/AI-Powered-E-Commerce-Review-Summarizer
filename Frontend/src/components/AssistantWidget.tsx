import { FormEvent, useEffect, useRef, useState } from "react";
import { Bot, Loader2, MessageCircle, Send, Sparkles, X } from "lucide-react";
import { assistantChat } from "@/lib/api";

type ChatMessage = { role: "user" | "assistant"; content: string };

const openingMessage: ChatMessage = {
  role: "assistant",
  content: "Hi! I can help you explore products, reviews, checkout, and your account. What would you like to know?",
};

const suggestions = ["How do I place an order?", "How can I compare product reviews?", "Can I pay online?"];

export default function AssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([openingMessage]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [isOpen, messages, loading]);

  const sendQuestion = async (rawQuestion: string) => {
    const question = rawQuestion.trim();
    if (!question || loading) return;

    const history = messages.slice(-8);
    setMessages((current) => [...current, { role: "user", content: question }]);
    setInput("");
    setLoading(true);
    try {
      const result = await assistantChat(question, history);
      setMessages((current) => [...current, { role: "assistant", content: result.answer }]);
    } catch (error: any) {
      const message = error.response?.data?.error || "I couldn't connect just now. Please try again in a moment.";
      setMessages((current) => [...current, { role: "assistant", content: message }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void sendQuestion(input);
  };

  return (
    <div className="fixed bottom-5 right-5 z-[80] flex flex-col items-end gap-3">
      {isOpen && <section aria-label="ReviewPulse AI assistant" className="flex h-[min(34rem,calc(100dvh_-_7rem))] w-[min(24rem,calc(100vw_-_2rem))] flex-col overflow-hidden rounded-3xl border border-border bg-background shadow-2xl">
        <header className="flex items-center gap-3 bg-[#142b24] px-4 py-4 text-white">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10"><Bot className="h-5 w-5" /></div>
          <div className="min-w-0 flex-1"><h2 className="text-sm font-semibold">ReviewPulse Assistant</h2><p className="mt-0.5 flex items-center gap-1.5 text-[11px] text-white/70"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Here to help with this store</p></div>
          <button type="button" aria-label="Close assistant" onClick={() => setIsOpen(false)} className="rounded-xl p-2 text-white/80 transition hover:bg-white/10 hover:text-white"><X className="h-4 w-4" /></button>
        </header>

        <div className="flex-1 space-y-4 overflow-y-auto bg-muted/20 px-4 py-4" aria-live="polite">
          {messages.map((message, index) => (
            <div key={`${message.role}-${index}`} className={`flex items-end gap-2 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              {message.role === "assistant" && <span className="mb-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><Sparkles className="h-3.5 w-3.5" /></span>}
              <p className={`max-w-[84%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-[13px] leading-5 ${message.role === "user" ? "rounded-br-md bg-primary text-primary-foreground" : "rounded-bl-md border border-border bg-background text-foreground"}`}>{message.content}</p>
            </div>
          ))}
          {messages.length === 1 && !loading && <div className="space-y-2 pl-9">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Try asking</p>
            {suggestions.map((suggestion) => <button key={suggestion} type="button" onClick={() => void sendQuestion(suggestion)} className="block w-full rounded-xl border border-border bg-background px-3 py-2 text-left text-xs text-foreground transition hover:border-primary/50 hover:text-primary">{suggestion}</button>)}
          </div>}
          {loading && <div className="flex items-center gap-2 pl-9 text-xs text-muted-foreground"><Loader2 className="h-3.5 w-3.5 animate-spin" /> Thinking...</div>}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-border bg-background p-3">
          <input value={input} onChange={(event) => setInput(event.target.value)} maxLength={1000} placeholder="Ask about products or orders..." aria-label="Your question" className="h-11 min-w-0 flex-1 rounded-xl border border-input bg-muted/20 px-3.5 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/15" />
          <button type="submit" aria-label="Send message" disabled={!input.trim() || loading} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"><Send className="h-4 w-4" /></button>
        </form>
        <p className="bg-background px-3 pb-2 text-center text-[10px] text-muted-foreground">AI answers may be imperfect. Confirm important product details on the product page.</p>
      </section>}

      <button type="button" aria-label={isOpen ? "Close AI assistant" : "Open AI assistant"} aria-expanded={isOpen} onClick={() => setIsOpen((open) => !open)} className="group flex h-14 items-center gap-2.5 rounded-full bg-primary px-4 text-primary-foreground shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/30">
        {isOpen ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
        <span className="pr-1 text-sm font-semibold">{isOpen ? "Close" : "Ask AI"}</span>
      </button>
    </div>
  );
}
