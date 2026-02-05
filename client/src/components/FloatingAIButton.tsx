import { useState } from "react";
import { Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function FloatingAIButton() {
  const [isHovered, setIsHovered] = useState(false);
  const { toast } = useToast();

  const handleAIClick = () => {
    toast({
      title: "AI Assistant",
      description: "AI chat feature would be implemented here",
    });
  };

  return (
    <div className="fixed bottom-14 left-6 z-50">
      <Button
        onClick={handleAIClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label="AI Assistant"
        className={`
          bg-gradient-to-r from-blue-500 to-purple-600 
          hover:from-blue-600 hover:to-purple-700 
          text-white font-semibold py-3 px-4 rounded-full 
          shadow-lg hover:shadow-xl 
          transition-all duration-300 ease-in-out 
          transform hover:scale-110 
          flex items-center gap-2 min-h-[44px]
          ${isHovered ? 'scale-110' : ''}
        `}
      >
        <Bot className="w-5 h-5" />
        <span className="hidden sm:inline">AI</span>
      </Button>
    </div>
  );
}
