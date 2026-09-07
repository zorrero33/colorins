import {
  createRootRouteWithContext,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { ShopProvider } from "../lib/shop";
import { Header } from "../components/site/Header";
import { Footer } from "../components/site/Footer";

import "../styles.css";

const queryClient = new QueryClient();

export const Route =
  createRootRouteWithContext<{
    queryClient: QueryClient;
  }>()({
    component: () => (
      <QueryClientProvider client={queryClient}>
        <ShopProvider>
          <div className="flex min-h-dvh flex-col font-sans">
            <Header />

            <main className="flex-1">
              <Outlet />
            </main>

            <Footer />
          </div>

          <Scripts />
        </ShopProvider>
      </QueryClientProvider>
    ),
  });
