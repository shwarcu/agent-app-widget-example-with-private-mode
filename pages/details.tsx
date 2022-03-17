import type { NextPage } from "next";
import Head from "next/head";
import * as LiveChat from "@livechat/agent-app-sdk";
import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";
import { KeyMap } from "@livechat/agent-app-sdk/types/utils/types";

const Details: NextPage = () => {
  const [widget, setWidget] = useState<LiveChat.IDetailsWidget>();
  const [threads, setThreads] = useState<KeyMap<boolean>>();

  useEffect(() => {
    LiveChat.createDetailsWidget().then((widget) => {
      setWidget(widget);
    });
  }, []);

  useEffect(() => {
    const initialThreads = widget?.getPrivateModeThreads()?.threads;
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
        <h1 className={styles.title}>Private mode! (details)</h1>
        <p>{JSON.stringify(threads)}</p>
      </main>
    </div>
  );
};

export default Details;
