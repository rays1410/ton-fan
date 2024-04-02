import styles from "./header.module.css";
import { TonConnectButton } from "@tonconnect/ui-react";

const Header = () => {
  return (
    <header className={styles.mainBlock}>
      <span className={styles.rightBlock}>
        <TonConnectButton />
      </span>
    </header>
  );
};

export default Header;
