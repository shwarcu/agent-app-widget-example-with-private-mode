import type { NextPage } from 'next';
import Head from 'next/head';
import * as LiveChat from '@livechat/agent-app-sdk';
import styles from '../styles/Home.module.css';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { ICustomerProfile, SectionComponentType } from '@livechat/agent-app-sdk';

const Details: NextPage = () => {
  // https://github.com/mac-s-g/react-json-view/issues/296#issuecomment-803497117
  const DynamicReactJson = dynamic(import('react-json-view'), { ssr: false });
  const [widget, setWidget] = useState<LiveChat.IDetailsWidget>();
  const [customer, setCustomer] = useState<ICustomerProfile>();

  useEffect(() => {
    LiveChat.createDetailsWidget().then((widget) => {
      setWidget(widget);
    });
  }, []);

  useEffect(() => {
    if (widget) {
      const initialCustomer = widget.getCustomerProfile();
      if (initialCustomer) {
        setCustomer(initialCustomer);
      }
      widget.on('customer_profile', (update) => {
        setCustomer(update);
        widget.modifySection({
          title: 'Example section',
          components: [
            {
              type: SectionComponentType.Button,
              data: {
                label: update.name || 'Customer',
                id: 'example-button',
              },
            },
          ],
        });
        widget.putMessage(`customer_profile.name: ${update.name || 'Customer'}`).then(() => {
          console.log('[Example integration]', 'message put');
        });
      });
      widget.on('customer_details_section_button_click', ({ buttonId }) => {
        // perform an action when the button is clicked
        console.log('[Example integration]', 'button clicked', buttonId);
        widget.putMessage(`Message was updated because button ${buttonId} was clicked`).then(() => {
          console.log('[Example integration]', 'message put');
        });
      });
    }
  }, [widget]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Private Mode</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <p className={styles.title}>Details widget</p>
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

export default Details;
