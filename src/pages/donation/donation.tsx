/* eslint-disable import/no-extraneous-dependencies */
import { FC, useEffect} from "react";
import WebAppSDK from "@twa-dev/sdk";
import {
  useTonConnectUI,
  useTonWallet,
} from "@tonconnect/ui-react";
import { SendTx } from "../../components/send-tx/send-tx";
import styles from "./donation.module.css";

interface DonationProps {
  targetWallet: string;
  targetUserName: string;
}

export const Donation: FC<DonationProps> = ({
  targetWallet,
  targetUserName,
}) => {
  const [tonConnectUI] = useTonConnectUI();
  const wallet = useTonWallet();

  useEffect(() => {
    if (!tonConnectUI.connected) {
      WebAppSDK.MainButton.disable();
      WebAppSDK.MainButton.text = "Wallet not found";
      WebAppSDK.MainButton.textColor = WebAppSDK.themeParams.hint_color;
      WebAppSDK.MainButton.color = WebAppSDK.themeParams.secondary_bg_color;
    }
  }, [tonConnectUI.connected]);

  return (
    <div
      className={`${styles.mainBlock} ${
        tonConnectUI.connected ? styles.mainStandard : styles.mainShifted
      }`}
    >
      {wallet ? (
        <>
          {"name" in wallet ? (
            <>
              <div>
                Название кошелька:{" "}
                <img
                  className={styles.wallet}
                  src={wallet.imageUrl}
                  height="50px"
                  width="50px"
                />{" "}
                {wallet.name}
              </div>

              <div>Тг никнейм автора канала: {targetUserName}</div>
              <div>Кошелек автора канала: {targetWallet}</div>
              <SendTx tonAddress={targetWallet} />
            </>
          ) : (
            <></>
          )}
        </>
      ) : (
        <div className={styles.noWallet}>Кошелек не подключен</div>
      )}
    </div>
  );
};
