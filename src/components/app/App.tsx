import { useEffect, useState } from "react";

import WebAppSDK from "@twa-dev/sdk";
import { Routes, Route } from "react-router-dom";
import { ROUTES } from "../../utils/router";
import { Donation } from "../../pages/donation/donation";
import Header from "../header/header";

declare global {
  interface Window {
    Telegram?: any;
  }
}

function App() {
  const [firstRender, setFirstRender] = useState<boolean>(false);
  const [targetWallet, setTargetWallet] = useState<string>("");
  const [targetUserName, setTargerUserName] = useState<string>("");

  useEffect(() => {
    if (!firstRender) {
      setFirstRender(true);

      const isTgCheck = window.Telegram.WebApp.initData !== "";
      const bodyStyle = document.body.style;

      if (isTgCheck) {
        WebAppSDK.ready();
        WebAppSDK.enableClosingConfirmation();
        WebAppSDK.expand();

        bodyStyle.backgroundColor = "var(--tg-theme-bg-color)";
        bodyStyle.setProperty(
          "background-color",
          "var(--tg-theme-bg-color)",
          "important"
        );

        console.log(
          WebAppSDK.initDataUnsafe.start_param,
          WebAppSDK.initDataUnsafe.user?.username
        );
        setTargetWallet(WebAppSDK.initDataUnsafe.start_param || "");
        setTargerUserName(WebAppSDK.initDataUnsafe.user?.username || "");
      } else {
        console.log("this is not telegram");
      }
    }
  }, []);

  return (
    <>
      <Header />
      <Routes>
        <Route
          path={ROUTES.HOME}
          element={
            <Donation
              targetUserName={targetUserName || "unknown wallet"}
              targetWallet={targetWallet || "unknown username"}
            />
          }
        />
      </Routes>
    </>
  );
}

export default App;
