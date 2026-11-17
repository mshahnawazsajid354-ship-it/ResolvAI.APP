/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#F8F9FA',
        surface: {
          DEFAULT: '#FFFFFF',
          subtle: '#F1F3F5',
          muted: '#E9ECEF',
          border: '#E2E8F0',
        },
        charcoal: {
          DEFAULT: '#1F2937',
          light: '#374151',
          muted: '#4B5563',
          faint: '#9CA3AF',
        },
        focusBlue: {
          DEFAULT: '#007AFF',
          hover: '#0062CC',
          light: '#EBF5FF',
          dark: '#0051A8',
        },
        gain: {
          greet: '#3B82F6',
          ack: '#8B5CF6',
          insight: '#10B981',
          navigate: '#F59E0B',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 10px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 20px rgba(0, 0, 0, 0.07)',
      }
    },
  },
  plugins: [],
}
