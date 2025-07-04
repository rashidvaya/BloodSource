import { Router, Route, Switch } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { queryClient } from "@/lib/queryClient";
import HomePage from "./pages/HomePage";
import NotFound from "./pages/not-found";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-facebook-gray">
          <Switch>
            <Route path="/" component={HomePage} />
            <Route component={NotFound} />
          </Switch>
          <Toaster />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
