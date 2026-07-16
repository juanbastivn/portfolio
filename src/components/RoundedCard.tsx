// RoundedCard.tsx
import styles from './RoundedCard.module.css'

function RoundedCard({ label, icon: Icon, numeric = false }: { label: string; icon?: React.ComponentType<{ size?: number; style?: React.CSSProperties }>; numeric?: boolean }) {
    return (
        <div className={`${styles.card} ${numeric ? styles.numeric : ''} glow-border`}>
            {Icon && <Icon size={20} style={{ marginRight: '0.4rem', flexShrink: 0 }} />}
            <p className='text-s'>{label}</p>
        </div>
    );
}

export default RoundedCard      
