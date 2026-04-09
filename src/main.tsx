import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';
import { router } from './app/routes/routes.tsx';
import './index.css';
import { Toaster } from './components/ui/sonner.tsx';

createRoot(document.getElementById('root')!)
  .render(
    <QueryClientProvider
      client={new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            retryDelay: 6000,
            refetchOnWindowFocus: false
          },
          mutations: {
            retryDelay: 6000,
            retry: 1
          }
        }
      })}>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 5_000,
          classNames: {
            description: '!text-gray-500'
          }
        }}
      />
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
