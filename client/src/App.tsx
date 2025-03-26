import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import ServicesPage from "@/pages/services-page";
import ProvidersPage from "@/pages/providers-page";
import ProviderDetails from "@/pages/provider-details";
import CustomerDashboard from "@/pages/dashboard/customer-dashboard";
import ProviderDashboard from "@/pages/dashboard/provider-dashboard";
import { ProtectedRoute } from "./lib/protected-route";
import { AuthProvider } from "./hooks/use-auth";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/services" component={ServicesPage} />
      <Route path="/providers" component={ProvidersPage} />
      <Route path="/provider/:id" component={ProviderDetails} />
      <Route path="/providers/:id" component={ProviderDetails} />
      <ProtectedRoute path="/dashboard/customer" component={CustomerDashboard} />
      <ProtectedRoute path="/dashboard/provider" component={ProviderDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router />
      <Toaster />
    </AuthProvider>
  );
}

export default App;
