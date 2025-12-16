/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#6366f1', // Indigo 500
                secondary: '#1e293b', // Slate 800
                accent: '#ec4899', // Pink 500
                glass: 'rgba(255, 255, 255, 0.1)',
                'glass-border': 'rgba(255, 255, 255, 0.2)',
            },
            backdropBlur: {
                xs: '2px',
            }
        },
    },
    plugins: [],
}
