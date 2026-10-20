// React
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// React Query
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Custom contexts
import ProjectsContextProvider from './contexts/ProjectsContext';

// Components
import App from './App.tsx';

const queryClient = new QueryClient({
    defaultOptions: { queries: { refetchOnWindowFocus: false } },
});

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <ProjectsContextProvider>
                <App />
            </ProjectsContextProvider>
        </QueryClientProvider>
    </StrictMode>
);
