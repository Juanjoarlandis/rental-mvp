/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./index.html', './src/**/*.{ts,tsx}'],
    theme: {
        container: { center: true, padding: '1rem' },
        extend: {
            fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
            colors: {
                brand: { DEFAULT: '#0d6efd', hover: '#0b5ed7' },
                surface: '#ffffff'
            },
            boxShadow: {
                card: '0 1px 3px rgba(0,0,0,.08)',
                cardHover: '0 4px 12px rgba(0,0,0,.12)'
            }
        }
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('@tailwindcss/typography'),
        require('@tailwindcss/line-clamp')       //  ← NEW
    ]
};
