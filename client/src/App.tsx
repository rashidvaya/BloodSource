import { Router, Route, Switch } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { queryClient } from "@/lib/queryClient";
import HomePage from "./pages/HomePage";
import SignupPage from "./pages/SignupPage";
import NotFound from "./pages/not-found";
import FloatingAIButton from "@/components/FloatingAIButton";
import Footer from "./components/Footer";
import CareerPage from "./pages/CareerPage";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen flex flex-col bg-facebook-gray">
          <Switch>
            <Route path="/" component={HomePage} />
            <Route path="/signup" component={SignupPage} />
            <Route path="/career" component={CareerPage} />
            <Route component={NotFound} />
          </Switch>
          <Toaster />
          <FloatingAIButton />
          <Footer />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
