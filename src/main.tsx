// Debug environment variables
console.log('🔄 Environment variables:', {
  VITE_SUPABASE_URL: window.process?.env?.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL || 'Not found',
  VITE_SUPABASE_ANON_KEY: window.process?.env?.VITE_SUPABASE_ANON_KEY ? '***' + String(window.process.env.VITE_SUPABASE_ANON_KEY).slice(-4) : import.meta.env.VITE_SUPABASE_ANON_KEY ? '***' + String(import.meta.env.VITE_SUPABASE_ANON_KEY).slice(-4) : 'Not found'
});

import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Initialize the app
function initializeApp() {
  try {
    const container = document.getElementById('root');
    if (!container) {
      throw new Error('Failed to find the root element');
    }

    const root = createRoot(container);
    root.render(<App />);
    
    console.log('✅ App initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize the app:', error);
    
    // Show error in the UI if possible
    const container = document.getElementById('root');
    if (container) {
      container.innerHTML = `
        <div style="padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <h1>App Initialization Error</h1>
          <p>${error instanceof Error ? error.message : 'Unknown error occurred'}</p>
          <p>Please check the console for more details.</p>
        </div>
      `;
    }
  }
}

// Start the app
initializeApp();
