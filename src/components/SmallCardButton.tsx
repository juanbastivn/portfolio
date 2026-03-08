// SmallCardButton.tsx
import styles from './SmallCardButton.module.css'

function SmallCardButton({ image, onClick }: { image: string, onClick?: () => void }) {
    return (
        <button className={`${styles.button} glow-border`} onClick={onClick}>
            <img className={styles.icon} src={image} alt="Card Icon" />
        </button>
    );
}

export default SmallCardButton