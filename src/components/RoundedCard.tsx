// RoundedCard.tsx
import styles from './RoundedCard.module.css'

function RoundedCard({ label }: { label: string }) {
    return (
        <div className={`${styles.card} glow-border`}>
            <p className='text-s'>{label}</p>
        </div>
    );
}

export default RoundedCard      
