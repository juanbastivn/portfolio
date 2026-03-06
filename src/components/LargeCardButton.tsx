// LargeCardButton.tsx
import styles from './LargeCardButton.module.css'

function LargeCardButton({ image, label }: { image: string; label: string }) {
    return (
        <button className={`${styles.button} glow-border`}>
            <img className={styles.icon} src={image} alt="Card Icon" />
            <span className='text-l'>{label}</span>
        </button>
    );
}

export default LargeCardButton