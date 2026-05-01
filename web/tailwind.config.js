/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: { display: ['Inter', 'system-ui', 'Arial'] },
      boxShadow: {
        elev: '0 10px 30px rgba(0,0,0,0.15)'
      },
      backgroundImage: {
        mesh:
          'radial-gradient(40% 60% at 10% 10%, #111 0%, transparent 60%), ' +
          'radial-gradient(40% 60% at 90% 20%, #511 0%, transparent 60%), ' +
          'radial-gradient(50% 60% at 50% 100%, #151515 0%, transparent 60%)'
      }
    }
  },
  plugins: []
}
