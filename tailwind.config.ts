import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-hedvig-letters-serif)', 'sans-serif'],
        serif: ['var(--font-hedvig-letters-serif)', 'serif'],
        'hedvig-sans': ['var(--font-hedvig-letters-sans)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config