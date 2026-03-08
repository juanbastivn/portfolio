// SectionButton.tsx
import styles from './SectionButton.module.css'

function SectionButton({ icon: Icon, label, onClick, href }: { icon: React.ComponentType<{ size?: number; style?: React.CSSProperties; color?: string }>, label: string, onClick?: () => void, href?: string }) {
    const handleClick = () => {
        if (href) window.open(href, '_blank', 'noopener,noreferrer')
        onClick?.()
    }
    return (
        <button className={`${styles.button} glow-border`} onClick={handleClick}>
            <Icon size={24} style={{ marginRight: '0.5rem', color: 'var(--icon-color)', filter: 'var(--icon-shadow)' }} color='var(--icon-color)' />
            <span className='text-m'>{label}</span>
        </button>
    );
}

export default SectionButton