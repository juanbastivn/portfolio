// SmallCardButton.tsx
import styles from './SmallCardButton.module.css'

function SmallCardButton({ image, onClick, label }: { image: string, onClick?: () => void, label: string }) {
    return (
        <button className={`${styles.button} glow-border`} onClick={onClick} aria-label={label} title={label}>
            <img className={styles.icon} src={image} alt="" aria-hidden="true" />
        </button>
    );
}

export default SmallCardButton
