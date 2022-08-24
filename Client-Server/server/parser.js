
const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');

const db = require('./connection')
db.connect(err => {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
  console.log('connected as id ' + db.threadId);
});

var sql = "INSERT INTO packet (seq, stddev, N_IN_Conn_P_SrcIP, min, state_number, mean, N_IN_Conn_P_DstIP, drate, srate, max) VALUES "
fs.createReadStream(path.resolve(__dirname, 'UNSW_2018_IoT_Botnet_Final_10_best_Testing.csv'))
    .pipe(csv.parse({ headers: true }))
    .on('error', error => console.error(error))
    .on('data', row => {
      const sql2 = sql + `('${row.seq}', '${row.stddev}', '${row.N_IN_Conn_P_SrcIP}', '${row.min}', '${row.state_number}', '${row.mean}', '${row.N_IN_Conn_P_DstIP}', '${row.drate}', '${row.srate}', '${row.max}');`
      db.query(sql2, function (err, data) {
        if (err) {
            console.log('ERROR')
            throw err;
        }
      });
    })
    .on('end', rowCount => {
      console.log(`Parsed ${rowCount} rows`)
    });