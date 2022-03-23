import type { NextPage } from "next";
import Head from "next/head";
import * as LiveChat from "@livechat/agent-app-sdk";
import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";
import { KeyMap } from "@livechat/agent-app-sdk/types/utils/types";
import dynamic from "next/dynamic";

const Messagebox: NextPage = () => {
  // https://github.com/mac-s-g/react-json-view/issues/296#issuecomment-803497117
  const DynamicReactJson = dynamic(import("react-json-view"), { ssr: false });
  const [widget, setWidget] = useState<LiveChat.IMessageBoxWidget>();
  const [threads, setThreads] = useState<KeyMap<boolean>>({});

  useEffect(() => {
    LiveChat.createMessageBoxWidget().then((widget) => {
      setWidget(widget);
    });
  }, []);

  useEffect(() => {
    const initialThreads = widget?.getPrivateModeState()?.threads;
    if (initialThreads) {
      setThreads((prev) => ({ ...prev, ...initialThreads }));
    }
    widget?.on("private_mode", (update) => {
      setThreads((prev) => ({ ...prev, ...update.threads }));
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
          src={threads}
        ></DynamicReactJson>
      </main>
    </div>
  );
};

export default Messagebox;
