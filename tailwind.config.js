/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        rind: '#0E1512',
        flesh: '#FF4D6D',
        zest: '#C6FF4D',
        butter: '#FFD23F',
        cream: '#FFF8EC',
        ink: '#14110D',
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        tag: ['"Space Mono"', 'monospace'],
      },
      rotate: {
        '2.5': '2.5deg',
        '-2.5': '-2.5deg',
      },
      boxShadow: {
        'pop': '7px 7px 0 0 #14110D',
        'pop-sm': '4px 4px 0 0 #14110D',
        'pop-flesh': '7px 7px 0 0 #FF4D6D',
        'pop-zest': '7px 7px 0 0 #C6FF4D',
      },
    },
  },
  plugins: [],
}
