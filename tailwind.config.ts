import type { Config } from 'tailwindcss'
import animate from 'tailwindcss-animate'

const config: Config = {
	darkMode: ['class'],
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' },
				secondary: { DEFAULT: 'hsl(var(--secondary))', foreground: 'hsl(var(--secondary-foreground))' },
				destructive: { DEFAULT: 'hsl(var(--destructive))', foreground: 'hsl(var(--destructive-foreground))' },
				muted: { DEFAULT: 'hsl(var(--muted))', foreground: 'hsl(var(--muted-foreground))' },
				accent: { DEFAULT: 'hsl(var(--accent))', foreground: 'hsl(var(--accent-foreground))' },
				popover: { DEFAULT: 'hsl(var(--popover))', foreground: 'hsl(var(--popover-foreground))' },
				card: { DEFAULT: 'hsl(var(--card))', foreground: 'hsl(var(--card-foreground))' },
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
			},
			fontFamily: {
				sans: ['Inter', 'system-ui', 'sans-serif'],
			},
			keyframes: {
				'fade-in': {
					from: { opacity: '0', transform: 'translateY(10px)' },
					to: { opacity: '1', transform: 'translateY(0)' },
				},
				'scale-in': {
					from: { opacity: '0', transform: 'scale(0.92)' },
					to: { opacity: '1', transform: 'scale(1)' },
				},
				float: {
					'0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
					'33%': { transform: 'translateY(-16px) rotate(1deg)' },
					'66%': { transform: 'translateY(-8px) rotate(-1deg)' },
				},
				shimmer: {
					'0%': { backgroundPosition: '-200% 0' },
					'100%': { backgroundPosition: '200% 0' },
				},
				'pulse-ring': {
					'0%': { transform: 'scale(1)', opacity: '0.8' },
					'100%': { transform: 'scale(2.2)', opacity: '0' },
				},
				'bounce-in': {
					'0%': { transform: 'scale(0.6)', opacity: '0' },
					'60%': { transform: 'scale(1.1)', opacity: '1' },
					'100%': { transform: 'scale(1)' },
				},
				'rise-up': {
					from: { transform: 'scaleY(0)', opacity: '0' },
					to: { transform: 'scaleY(1)', opacity: '1' },
				},
				'aurora-shift': {
					'0%': { opacity: '0.7', filter: 'hue-rotate(0deg)' },
					'50%': { opacity: '1', filter: 'hue-rotate(15deg)' },
					'100%': { opacity: '0.8', filter: 'hue-rotate(-10deg)' },
				},
			},
			animation: {
				'fade-in': 'fade-in 0.45s cubic-bezier(0.22, 1, 0.36, 1) forwards',
				'scale-in': 'scale-in 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards',
				float: 'float 10s ease-in-out infinite',
				shimmer: 'shimmer 2.4s ease-in-out infinite',
				'pulse-ring': 'pulse-ring 1.6s ease-out infinite',
				'bounce-in': 'bounce-in 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards',
				'rise-up': 'rise-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards',
				'aurora-shift': 'aurora-shift 12s ease-in-out infinite alternate',
				'spin-slow': 'spin 1s linear infinite',
			},
			backgroundSize: {
				'200%': '200% 100%',
			},
		},
	},
	plugins: [animate],
}

export default config
