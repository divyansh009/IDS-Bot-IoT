import React, { useEffect, useState } from "react";
import useInterval from 'use-interval'
import Lower from "./Lower";
import styles from "./styles.module.css";
import ClientView from "./ClientView";
import View from "./View";
import DateRangePicker from 'rsuite/DateRangePicker';
import axios from "axios-server";

const Server = (props) => {

  const [data,setData] = useState({DDoS: {
    count: 8,
    subcategory: {
        Data_Exfiltration: 4,
        HTTP: 1,
        Keylogging: 1,
        Normal: 2,
        OS_Fingerprint: 0,
        Service_Scan: 1,
        TCP: 9,
        UDP: 5
    }
  },
  DoS: {
    count: 224,
    subcategory: {
        Data_Exfiltration: 11,
        HTTP: 13,
        Keylogging: 14,
        Normal: 15,
        OS_Fingerprint: 25,
        Service_Scan: 145,
        TCP: 1,
        UDP: 0
    }
  },
  Normal: {
    count: 6,
    subcategory: {
        Data_Exfiltration: 3,
        HTTP: 0,
        Keylogging: 0,
        Normal: 0,
        OS_Fingerprint: 1,
        Service_Scan: 0,
        TCP: 2,
        UDP: 0
    }
  },
  Reconnaissance: {
    count: 46,
    subcategory: {
        Data_Exfiltration: 0,
        HTTP: 1,
        Keylogging: 1,
        Normal: 1,
        OS_Fingerprint: 39,
        Service_Scan: 0,
        TCP: 4,
        UDP: 0
    }
  },
  Theft: {
    count: 9,
    subcategory: {
        Data_Exfiltration: 1,
        HTTP: 1,
        Keylogging: 1,
        Normal: 1,
        OS_Fingerprint: 2,
        Service_Scan: 1,
        TCP: 1,
        UDP: 1
    }
  }})

  const [clients,setClients] = useState(null)
  const [intervalLower,setIntervalLower] = useState(-1);
  const [intervalUpper,setIntervalUpper] = useState(-1);
  const [client,setClient] = useState(-1)

  const [intervalId, setIntervalId] = useState({});

  const getLogs = async () => {
    // console.log('getUpdate');
    let body = {}
    body.interval = [0,Date.now()]
    if(intervalLower>0 && intervalUpper>0) {
      body.interval = [intervalLower,intervalUpper]
    }
    if(client>0) body.client_id=client
    // console.log(body);
    const { data } = await axios.post('/logs', body);
    // console.log(data);
    setData(data)
  }

  const getClients = async () => {
    const { data } = await axios.get('/clients');
    setClients(data)
  }

  useInterval(
    () => {
      getLogs()
      getClients()
    },
    1000,
    true
  )

  const handleSelectRange = (e) => {
    if(e) {
      setIntervalLower(e[0].getTime())
      setIntervalUpper(e[1].getTime())
    } else {
      setIntervalLower(-1)
      setIntervalUpper(-1)
    }
  }

  const getClient = () => {
    return clients.find(c => c.client_id === client);
  }

  let comp = null
  if(clients) {
    comp = client<0 ?  (clients && <View clients={clients} setClient={setClient}/>) : (<ClientView client={getClient()} setClient={setClient}/>)
  }

  return (
    <div className={styles.root}>
      <div className={styles.uppperBox}>
        {comp}
      </div>
      <div className={styles.midBox}>
        <DateRangePicker format="yyyy-MM-dd HH:mm:ss" onChange={(e) => handleSelectRange(e)}/>
      </div>
      <div className={styles.lowerBox}><Lower data={data}/></div>
    </div>
  );
};

export default Server;