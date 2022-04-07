import type { NextPage } from "next";
import Head from "next/head";
import * as LiveChat from "@livechat/agent-app-sdk";
import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { ICustomerProfile } from "@livechat/agent-app-sdk";

const Messagebox: NextPage = () => {
  // https://github.com/mac-s-g/react-json-view/issues/296#issuecomment-803497117
  const DynamicReactJson = dynamic(import("react-json-view"), { ssr: false });
  const [widget, setWidget] = useState<LiveChat.IMessageBoxWidget>();
  const [customer, setCustomer] = useState<ICustomerProfile>();

  useEffect(() => {
    LiveChat.createMessageBoxWidget().then((widget) => {
      setWidget(widget);
    });
  }, []);

  useEffect(() => {
    const initialCustomer = widget?.getCustomerProfile();
    if (initialCustomer) {
      setCustomer(initialCustomer);
    }
    widget?.on("customer_profile", (update) => {
      setCustomer(update);
    });
  }, [widget]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Private Mode</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <p className={styles.title}>Messagebox widget</p>
        <br></br>
        <DynamicReactJson
          enableClipboard={false}
          quotesOnKeys={false}
          src={customer ? customer : {}}
          name="customer_profile"
        ></DynamicReactJson>
      </main>
    </div>
  );
};

export default Messagebox;
