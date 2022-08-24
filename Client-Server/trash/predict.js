
// const {PythonShell} = require('python-shell')
// const {parse_result} = require('./utils')

// const predict = (data) => {
//   const options = {
//     args:[data]
//   }
//   PythonShell.run("predict.py",options,function(err,res) {
//     if(err) {
//       console.log('python-error: '+err);
//     } else {
//       // console.log('python-results '+res);
//      console.log((parse_result(JSON.parse(res))))
//     }
//   })
// }

// const data = JSON.parse('{"pkSeqID":{"0":3142762},"proto":{"0":"udp"},"saddr":{"0":"192.168.100.150"},"sport":{"0":"6551"},"daddr":{"0":"192.168.100.3"},"dport":{"0":"80"},"seq":{"0":251984},"stddev":{"0":1.900363},"N_IN_Conn_P_SrcIP":{"0":100},"min":{"0":0.0},"state_number":{"0":4},"mean":{"0":2.687519},"N_IN_Conn_P_DstIP":{"0":100},"drate":{"0":0.0},"srate":{"0":0.494549},"max":{"0":4.031619}}')
// const data_json = JSON.stringify(data)
// // console.log(data_json);
// predict(data_json)

const data = {"DDoS": {
  "count": 0,
  "subcategory": {
      "Data_Exfiltration": 0,
      "HTTP": 0,
      "Keylogging": 0,
      "Normal": 0,
      "OS_Fingerprint": 0,
      "Service_Scan": 0,
      "TCP": 0,
      "UDP": 0
  }
},
"DoS": {
  "count": 0,
  "subcategory": {
      "Data_Exfiltration": 0,
      "HTTP": 0,
      "Keylogging": 0,
      "Normal": 0,
      "OS_Fingerprint": 0,
      "Service_Scan": 0,
      "TCP": 0,
      "UDP": 0
  }
},
"Normal": {
  "count": 0,
  "subcategory": {
      "Data_Exfiltration": 0,
      "HTTP": 0,
      "Keylogging": 0,
      "Normal": 0,
      "OS_Fingerprint": 0,
      "Service_Scan": 0,
      "TCP": 0,
      "UDP": 0
  }
},
"Reconnaissance": {
  "count": 0,
  "subcategory": {
      "Data_Exfiltration": 0,
      "HTTP": 0,
      "Keylogging": 0,
      "Normal": 0,
      "OS_Fingerprint": 0,
      "Service_Scan": 0,
      "TCP": 0,
      "UDP": 0
  }
},
"Theft": {
  "count": 0,
  "subcategory": {
      "Data_Exfiltration": 0,
      "HTTP": 0,
      "Keylogging": 0,
      "Normal": 0,
      "OS_Fingerprint": 0,
      "Service_Scan": 0,
      "TCP": 0,
      "UDP": 0
  }
}}
console.log(data);
console.log(JSON.parse(data));

// {
//   pkSeqID: { '0': 3142762 },
//   proto: { '0': 'udp' },
//   saddr: { '0': '192.168.100.150' },
//   sport: { '0': '6551' },
//   daddr: { '0': '192.168.100.3' },
//   dport: { '0': '80' },
//   seq: { '0': 251984 },
//   stddev: { '0': 1.900363 },
//   N_IN_Conn_P_SrcIP: { '0': 100 },
//   min: { '0': 0 },
//   state_number: { '0': 4 },
//   mean: { '0': 2.687519 },
//   N_IN_Conn_P_DstIP: { '0': 100 },
//   drate: { '0': 0 },
//   srate: { '0': 0.494549 },
//   max: { '0': 4.031619 }
// }

// const [data,setData] = useState({DDoS: {
//   count: 0,
//   subcategory: {
//       Data_Exfiltration: 0,
//       HTTP: 0,
//       Keylogging: 0,
//       Normal: 0,
//       OS_Fingerprint: 0,
//       Service_Scan: 0,
//       TCP: 0,
//       UDP: 0
//   }
// },
// DoS: {
//   count: 0,
//   subcategory: {
//       Data_Exfiltration: 0,
//       HTTP: 0,
//       Keylogging: 0,
//       Normal: 0,
//       OS_Fingerprint: 0,
//       Service_Scan: 0,
//       TCP: 0,
//       UDP: 0
//   }
// },
// Normal: {
//   count: 0,
//   subcategory: {
//       Data_Exfiltration: 0,
//       HTTP: 0,
//       Keylogging: 0,
//       Normal: 0,
//       OS_Fingerprint: 0,
//       Service_Scan: 0,
//       TCP: 0,
//       UDP: 0
//   }
// },
// Reconnaissance: {
//   count: 0,
//   subcategory: {
//       Data_Exfiltration: 0,
//       HTTP: 0,
//       Keylogging: 0,
//       Normal: 0,
//       OS_Fingerprint: 0,
//       Service_Scan: 0,
//       TCP: 0,
//       UDP: 0
//   }
// },
// Theft: {
//   count: 0,
//   subcategory: {
//       Data_Exfiltration: 0,
//       HTTP: 0,
//       Keylogging: 0,
//       Normal: 0,
//       OS_Fingerprint: 0,
//       Service_Scan: 0,
//       TCP: 0,
//       UDP: 0
//   }
// }})