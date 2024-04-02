import { HttpClient, Api } from "tonapi-sdk-js";

const httpClient = new HttpClient({
  baseUrl: "https://testnet.tonapi.io/",
  baseApiParams: {
    headers: {
      // 1 rps limited token
      Authorization: `Bearer ${"AGFV6APRKXRMU2QAAAADZIPGN3AQMN7XNVVIZF7LVQSKYKOWR355TA6ANRJUY5MEQU67QBA"}`,
      "Content-type": "application/json",
    },
  },
});

export const tonapi = new Api(httpClient);

export async function waitForTx(msgHash: string, attempt = 0) {
  try {
    console.log("try to find the transaction, attempt " + attempt);
    return await tonapi.blockchain.getBlockchainTransactionByMessageHash(
      msgHash
    );
  } catch (e) {
    if (attempt >= 10) {
      console.log("limit of attempts for finding transcaction");
      throw e;
    }

    await new Promise((resolve) => setTimeout(resolve, 3000));

    return waitForTx(msgHash, attempt + 1);
  }
}
