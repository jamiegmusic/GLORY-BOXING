/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        boxing: {
          red: '#DC2626',
          blue: '#1E40AF',
          gold: '#F59E0B',
          silver: '#6B7280',
          bronze: '#CD7F32',
          ring: '#1F2937',
          canvas: '#F3F4F6',
        },
        fighter: {
          amateur: '#10B981',
          prospect: '#3B82F6',
          contender: '#F59E0B',
          champion: '#DC2626',
          legend: '#7C3AED',
          retired: '#6B7280',
        }
      },
      fontFamily: {
        'boxing': ['Orbitron', 'monospace'],
        'display': ['Bebas Neue', 'cursive'],
      },
      animation: {
        'punch': 'punch 0.3s ease-in-out',
        'bell': 'bell 1s ease-in-out',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        punch: {
          '0%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(10px)' },
          '100%': { transform: 'translateX(0)' },
        },
        bell: {
          '0%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(10deg)' },
          '75%': { transform: 'rotate(-10deg)' },
          '100%': { transform: 'rotate(0deg)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 5px #DC2626' },
          '50%': { boxShadow: '0 0 20px #DC2626, 0 0 30px #DC2626' },
        }
      }
    },
  },
  plugins: [],
} 