// SectionButton.tsx
import styles from './SectionButton.module.css'

function SectionButton({ icon: Icon, label }: { icon: React.ComponentType<{ size?: number; style?: React.CSSProperties; color?: string }>, label: string }) {
    return (
        <button className={`${styles.button} glow-border`}>
            <Icon size={24} style={{ marginRight: '0.5rem' }} color='#ffffff99' />
            <span className='text-m'>{label}</span>
        </button>
    );
}

export default SectionButton