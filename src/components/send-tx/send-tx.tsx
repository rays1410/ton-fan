import { Cell } from "@ton/core";
import {
  CHAIN,
  TonConnectUI,
  useTonConnectModal,
  useTonConnectUI,
  useTonWallet,
} from "@tonconnect/ui-react";
import { FC, useState } from "react";
import { waitForTx } from "../../utils/tonapi";
import styles from "./send-tx.module.css";

interface ISendTx {
  e: React.FormEvent<HTMLFormElement>;
  tonAmount: string;
  tonAddress: string;
  tonConnectUI: TonConnectUI;
  setTxPending: React.Dispatch<React.SetStateAction<boolean>>;
  setTxResult: React.Dispatch<React.SetStateAction<string>>;
}

const onSendTx = async ({
  e,
  tonAmount,
  tonAddress,
  tonConnectUI,
  setTxPending,
  setTxResult,
}: ISendTx) => {
  e.preventDefault();

  console.log(`you sending ${tonAmount} nano TON`);
  const result = await tonConnectUI.sendTransaction({
    validUntil: Math.round(Date.now() / 1000) + 60 * 5,
    messages: [
      {
        address: tonAddress,
        amount: tonAmount,
      },
    ],
    network: CHAIN.TESTNET,
  });

  const imMsgCell = Cell.fromBase64(result.boc);
  const inMsgHash = imMsgCell.hash().toString("hex");

  try {
    const tx = await waitForTx(inMsgHash, 0);
    console.log("the transaction was found: ", tx);
    setTxResult("Success!");
  } catch (e) {
    console.log("catch from onSendTx, error: " + e);
    setTxResult("Failed!");
  } finally {
    setTxPending(false);
  }
};

interface SendTxProps {
  tonAddress: string;
}

export const SendTx: FC<SendTxProps> = ({ tonAddress }) => {
  const wallet = useTonWallet();
  const { open } = useTonConnectModal();
  const [tonConnectUI] = useTonConnectUI();

  const [tonAmount, setTonAmount] = useState<string>("");
  const [txPending, setTxPending] = useState<boolean>(false);
  const [txResult, setTxResult] = useState<string>("");

  if (!wallet) {
    return <button onClick={open}>Connect wallet</button>;
  }

  return (
    <>
      <form
        className={styles.formStyle}
        onSubmit={(e) =>
          onSendTx({
            e,
            tonAmount,
            tonAddress,
            tonConnectUI,
            setTxPending,
            setTxResult,
          })
        }
      >
        <input
          placeholder="Введите сумму в ton"
          onChange={(e) => {
            setTonAmount((parseFloat(e.target.value) * 1e9).toString());
          }}
        ></input>
        <button type="submit">SendTx</button>
        {txPending && "Pending..."}
        {!txPending && txResult}
      </form>
    </>
  );
};
