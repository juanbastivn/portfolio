// SmallCardButton.tsx
import styles from './SmallCardButton.module.css'

function SmallCardButton({ image }: { image: string }) {
    return (
        <button className={`${styles.button} glow-border`}>
            <img className={styles.icon} src={image} alt="Card Icon" />
        </button>
    );
}

export default SmallCardButton