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
import StaffRegistrationPage from "./pages/StaffRegistrationPage";
import NewsfeedPage from "./pages/NewsfeedPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen flex flex-col bg-facebook-gray">
          <Switch>
            <Route path="/" component={HomePage} />
            <Route path="/signup" component={SignupPage} />
            <Route path="/career" component={CareerPage} />
            <Route path="/sr" component={StaffRegistrationPage} />
            <Route path="/newsfeed" component={NewsfeedPage} />
            <Route path="/admin-dashboard" component={AdminDashboardPage} />
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
