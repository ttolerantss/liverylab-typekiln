import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.left}>
          <span className={styles.copyright}>
            LiveryLab · © 2026 All Rights Reserved
          </span>
          <a
            href="https://danielswork.shop"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.project}
          >
            <span>A</span>
            {/* Footer Logo SVG */}
            <svg viewBox="0 0 20 6.6" className={styles.projectLogo}>
              <path fill="currentColor" d="M6.1,6.6c1.7,0,2.6,0,3.2-1.4l.8-1.7.3-.6h0v3.7h2.7L16.4,0h-2.5l-1.7,4.1h0V0h-2.2l-.3.6-1.6,3.4h0V0h0s-4.8,0-4.8,0L0,6.6h6.1ZM5.1,5h-2.3l1.6-3.3h1.4c1.2,0,1.5.6,1.3,1.6-.2.9-.6,1.4-1.4,1.6-.2,0-.4,0-.6,0Z"/>
              <polygon fill="currentColor" points="15.2 6.6 18.5 0 16.9 0 13.7 6.6 15.2 6.6"/>
              <polygon fill="currentColor" points="16.8 6.6 20 0 19 0 15.8 6.6 16.8 6.6"/>
            </svg>
            <span>PROJECT</span>
          </a>
        </div>

        <div className={styles.right}>
          <a href="#" className={styles.link}>
            Privacy Policy
          </a>
          <a href="#" className={styles.link}>
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
}
