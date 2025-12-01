/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'mac-sidebar': '#1e1e1e',
                'mac-content': '#2d2d2d',
                'mac-hover': '#3a3a3a',
                'mac-selected': '#0066cc',
                'mac-border': '#3f3f3f',
            },
            fontFamily: {
                'sf-pro': ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Text', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
