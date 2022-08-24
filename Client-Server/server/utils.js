const {PythonShell} = require('python-shell')
const db = require('./connection')

const parse_result = (data) => {
  // console.log(Object.entries(data));
  data = Object.fromEntries(Object.entries(data).map(([k,v]) => [k,v['0']]))
  // console.log(data);
  return data
}

const format_data = (data) => {
  // console.log(Object.entries(data));
  data = Object.fromEntries(Object.entries(data).map(([k,v]) => [k,{'0':v}]))
  // console.log(data);
  return data
}

const predict = (data,client_id) => {
  data = JSON.stringify(format_data(data))
  const options = {
    args:[data]
  }
  PythonShell.run("predict.py",options,function(err,res) {
    if(err) {
      console.log('python-error: '+err);
    } else {
      res = parse_result(JSON.parse(res))
      const sql = `INSERT INTO log (client_id,attack,category,subcategory) VALUES (${client_id},${res.attack},${res.category},${res.subcategory})`;
      db.query(sql, function (err, res) {
          if (err) {
              throw err;
          }
      });
    }
  })
}

const category = ['DDoS', 'DoS', 'Normal', 'Reconnaissance', 'Theft']
const subcategory = ['Data_Exfiltration','HTTP','Keylogging','Normal','OS_Fingerprint','Service_Scan','TCP','UDP']

const get_category = () => {
  return category
}

const get_subcategory = () => {
  return subcategory
}

const get_log_data = () => {
  let sub = {}
  for (var i = 0; i < subcategory.length; i++) {
    sub[subcategory[i]] = 0;
  }
  let cat={}
  for (var i = 0; i < category.length; i++) {
    cat[category[i]] = {count:0,subcategory:{...sub}};
  }
  return cat
}

const parse_log_data = (data) => {
  const log = get_log_data()
  data.forEach(({cat_sub,count}) => {
    const [cat,sub] = cat_sub.split('_')
    log[category[cat]].count += count
    log[category[cat]].subcategory[subcategory[sub]] += count
  });
  return log
}

module.exports = {parse_result,predict,parse_log_data,get_category,get_subcategory}

// const data = JSON.parse('{"pkSeqID":{"0":3142762},"proto":{"0":"udp"},"saddr":{"0":"192.168.100.150"},"sport":{"0":"6551"},"daddr":{"0":"192.168.100.3"},"dport":{"0":"80"},"seq":{"0":251984},"stddev":{"0":1.900363},"N_IN_Conn_P_SrcIP":{"0":100},"min":{"0":0.0},"state_number":{"0":4},"mean":{"0":2.687519},"N_IN_Conn_P_DstIP":{"0":100},"drate":{"0":0.0},"srate":{"0":0.494549},"max":{"0":4.031619}}')
// const data = {
//     pkSeqID: { '0': 3142762 },
//     proto: { '0': 'udp' },
//     saddr: { '0': '192.168.100.150' },
//     sport: { '0': '6551' },
//     daddr: { '0': '192.168.100.3' },
//     dport: { '0': '80' },
//     seq: { '0': 251984 },
//     stddev: { '0': 1.900363 },
//     N_IN_Conn_P_SrcIP: { '0': 100 },
//     min: { '0': 0 },
//     state_number: { '0': 4 },
//     mean: { '0': 2.687519 },
//     N_IN_Conn_P_DstIP: { '0': 100 },
//     drate: { '0': 0 },
//     srate: { '0': 0.494549 },
//     max: { '0': 4.031619 }
//   }