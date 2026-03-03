import { useTheme } from '@/contexts/useTheme';

export default function AuroraBackground() {
    const { theme } = useTheme();

    if (theme === 'light') {
        return (
            <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
                <div className="absolute inset-0 bg-background" />
            </div>
        );
    }

    // Dark mode — fundo sólido limpo
    return (
        <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
            <div className="absolute inset-0 bg-background" />
        </div>
    );
}
