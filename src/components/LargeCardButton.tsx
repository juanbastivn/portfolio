// LargeCardButton.tsx
import styles from './LargeCardButton.module.css'

function LargeCardButton({ image, label, onClick }: { image: string; label: string; onClick?: () => void }) {
    return (
        <button className={`${styles.button} glow-border`} onClick={onClick}>
            <img className={styles.icon} src={image} alt="" aria-hidden="true" />
            <span className='text-l text-button'>{label}</span>
        </button>
    );
}

export default LargeCardButton
