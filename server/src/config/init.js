var mysql = require('mysql');

var crypto = require('crypto');
/*--------------------------------------------------------------------
  1. Create a MySQL database connection and export it
  - host: localhost
  - user: root
  - password: (root password of individual installation,
               in my case: lion0787)
  - database: hotel-reverse (let's determine database name)
  2. Then connect to 'hotel-reverse' database
 --------------------------------------------------------------------*/


var secret = 'hotelreverse';
var algorithm = 'aes-256-ctr';



function encrypt(text) {
  var cipher = crypto.createCipher(algorithm,secret);
  var crypted = cipher.update(text,'utf8','hex');
  crypted += cipher.final('hex');
  return crypted;
}

var connection = mysql.createConnection({
  host: 'hotel-reverse-db.cd1q4y4851fd.ap-northeast-2.rds.amazonaws.com',
  user: 'hotel',
  password: 'hotelreverse',
  database: 'hotelreverse'
});

connection.connect((err) => {
  if (err) {
    console.log("can't connect to mysql database");
    return;
  }
    console.log('successfully connected to database...');
});

//delete all rows in client, deal, hotel
connection.query('DELETE FROM Deal', (err, results, fields)  => {
  if(err) throw err;
  console.log("Deal, Successfully deleted");
});

connection.query('DELETE FROM Client', (err, results, fields)  => {
  if(err) throw err;
  console.log("Client, Successfully deleted");
});

connection.query('DELETE FROM Hotel', (err, results, fields)  => {
  if(err) throw err;
  console.log("Hotel, Successfully deleted");
});

//create dummy data in client, deal, hotel
var client = [
  {
    client_Email: '000a@gmail.com',
    client_PW: '000a',
    client_Name: 'Minjung',
    billingInfo: '000a-0001-0002-0003',
    member: 1
  },
  {
    client_Email: '000b@gmail.com',
    client_PW: '000b',
    client_Name: 'Nyeon',
    billingInfo: '000b-0001-0002-0003',
    member: 1
  },
  {
    client_Email: '00c@gmail.com',
    client_PW: '000c',
    client_Name: 'Sangwook',
    billingInfo: '000c-0001-0002-0003',
    member: 1
  },
  {
    client_Email: '000d@gmail.com',
    client_PW: '000d',
    client_Name: 'Steven Tyler',
    billingInfo: '000d-0001-0002-0003',
    member: 1
  },
  {
    client_Email: '000e@gmail.com',
    client_PW: '000e',
    client_Name: 'Brooks Koyeka',
    billingInfo: '000e-0001-0002-0003',
    member: 1
  },
  {
    client_Email: '00f@gmail.com',
    client_PW: '000f',
    client_Name: 'King James',
    billingInfo: '000f-0001-0002-0003',
    member: 1
  },
  {
    client_Email: '000g@gmail.com',
    client_PW: '000g',
    client_Name: 'Harry Porter',
    billingInfo: '000g-0001-0002-0003',
    member: 1
  },
  {
    client_Email: '000h@gmail.com',
    client_PW: '000h',
    client_Name: 'Dustin Johnson',
    billingInfo: '000h-0001-0002-0003',
    member: 1
  },
  {
    client_Email: '000i@gmail.com',
    client_PW: '000i',
    client_Name: 'Rhee Jongwon',
    billingInfo: '000i-0001-0002-0003',
    member: 1
  },
  {
    client_Email: '000j@gmail.com',
    client_PW: '000j',
    client_Name: 'Jerry Porter',
    billingInfo: '000j-0001-0002-0003',
    member: 1
  },
  {
    client_Email: '00k@gmail.com',
    client_PW: '000k',
    client_Name: 'Kustin Kohnson',
    billingInfo: '000k-0001-0002-0003',
    member: 1
  },
  {
    client_Email: '000l@gmail.com',
    client_PW: '000l',
    client_Name: 'Lhee Longwon',
    billingInfo: '000l-0001-0002-0003',
    member: 1
  }
];

var deal = [
  {
    hotel_ID: null,
    checkIn_Date: '2016-06-20',
    checkOut_Date: '2016-06-30',
    mainArea_Name: 'Seoul-si',
    subArea_Name: 'Gangnam-gu',
    bid_Price: 350000,
    bid_Transaction: 0,
    imp_uid: 'imp_448280090638'
  },
  {
    hotel_ID: null,
    checkIn_Date: '2016-07-14',
    checkOut_Date: '2016-07-29',
    mainArea_Name: 'Seoul-si',
    subArea_Name: 'Seocho-gu',
    bid_Price: 600000,
    bid_Transaction: 0,
    imp_uid: 'imp_448280090639'
  },
  {
    hotel_ID: null,
    checkIn_Date: '2016-12-04',
    checkOut_Date: '2016-12-23',
    mainArea_Name: 'Jeju-do',
    subArea_Name: 'Seogipo-si',
    bid_Price: 300000,
    bid_Transaction: 0,
    imp_uid: 'imp_448280090640'
  },
  {
    hotel_ID: null,
    checkIn_Date: '2016-07-05',
    checkOut_Date: '2016-07-08',
    mainArea_Name: 'Seoul-si',
    subArea_Name: 'Seocho-gu',
    bid_Price: 700000,
    bid_Transaction: 0,
    imp_uid:'imp_448280090641'
  },
  {
    hotel_ID: null,
    checkIn_Date: '2016-08-14',
    checkOut_Date: '2016-08-17',
    mainArea_Name: 'Seoul-si',
    subArea_Name: 'Seocho-gu',
    bid_Price: 300000,
    bid_Transaction: 0,
    imp_uid: 'imp_448280090642'
  },
  {
    hotel_ID: null,
    checkIn_Date: '2016-07-24',
    checkOut_Date: '2016-07-29',
    mainArea_Name: 'Jeju-do',
    subArea_Name: 'Seogipo-si',
    bid_Price: 550000,
    bid_Transaction: 0,
    imp_uid: 'imp_448280090643'
  },
  {
    hotel_ID: 'a2',
    checkIn_Date: '2016-09-05',
    checkOut_Date: '2016-09-08',
    mainArea_Name: 'Seoul-si',
    subArea_Name: 'Seocho-gu',
    bid_Price: 7770000,
    bid_Transaction: 1,
    imp_uid:'imp_448280090641'
  },
  {
    hotel_ID: 'a2',
    checkIn_Date: '2016-09-14',
    checkOut_Date: '2016-09-17',
    mainArea_Name: 'Seoul-si',
    subArea_Name: 'Seocho-gu',
    bid_Price: 333000,
    bid_Transaction: 1,
    imp_uid: 'imp_448280090642'
  },
  {
    hotel_ID: 'a3',
    checkIn_Date: '2016-09-24',
    checkOut_Date: '2016-09-29',
    mainArea_Name: 'Jeju-do',
    subArea_Name: 'Seogipo-si',
    bid_Price: 550000,
    bid_Transaction: 1,
    imp_uid: 'imp_448280090643'
  },
  {
    hotel_ID: 'a2',
    checkIn_Date: '2016-11-05',
    checkOut_Date: '2016-11-08',
    mainArea_Name: 'Seoul-si',
    subArea_Name: 'Seocho-gu',
    bid_Price: 6000000,
    bid_Transaction: 1,
    imp_uid:'imp_448280090650'
  },
  {
    hotel_ID: 'a5',
    checkIn_Date: '2016-09-14',
    checkOut_Date: '2016-09-17',
    mainArea_Name: 'Seoul-si',
    subArea_Name: 'Seocho-gu',
    bid_Price: 333000,
    bid_Transaction: 1,
    imp_uid: 'imp_448280090651'
  },
  {
    hotel_ID: 'a6',
    checkIn_Date: '2016-10-01',
    checkOut_Date: '2016-10-03',
    mainArea_Name: 'Jeju-do',
    subArea_Name: 'Seogipo-si',
    bid_Price: 900000,
    bid_Transaction: 1,
    imp_uid: 'imp_448280090652'
  }

];

var hotel = [
  {
    hotel_ID: 'a1',
    hotel_PW: 'a1',
    hotel_Name: 'a1 hotel',
    hotel_Address: 'Seoul-si Gangnam-gu',
    mainArea_Name: 'Seoul-si',
    subArea_Name: 'Gangnam-gu',
    hotel_Rate: 3,
    mgr_Name: 'Odong-gil'
  },
  {
    hotel_ID: 'a2',
    hotel_PW: 'a2',
    hotel_Name: 'a2 hotel',
    hotel_Address: 'Seoul-si Seocho-gu',
    mainArea_Name: 'Seoul-si',
    subArea_Name: 'Seocho-gu',
    hotel_Rate: 5,
    mgr_Name: 'Park Junkeum'
  },
  {
    hotel_ID: 'a3',
    hotel_PW: 'a3',
    hotel_Name: 'a3 hotel',
    hotel_Address: 'Jeju-do Seogipo-si',
    mainArea_Name: 'Jeju-do',
    subArea_Name: 'Seogipo-si',
    hotel_Rate: 2,
    mgr_Name: 'Yangseo-li'
  },
  {
    hotel_ID: 'a4',
    hotel_PW: 'a4',
    hotel_Name: 'a4 hotel',
    hotel_Address: 'Seoul-si Gangnam-gu',
    mainArea_Name: 'Seoul-si',
    subArea_Name: 'Gangnam-gu',
    hotel_Rate: 5,
    mgr_Name: 'Baek Sunggil'
  },
  {
    hotel_ID: 'a5',
    hotel_PW: 'a5',
    hotel_Name: 'a5 hotel',
    hotel_Address: 'Seoul-si Seocho-gu',
    mainArea_Name: 'Seoul-si',
    subArea_Name: 'Seocho-gu',
    hotel_Rate: 5,
    mgr_Name: 'Park Myunghee'
  },
  {
    hotel_ID: 'a6',
    hotel_PW: 'a6',
    hotel_Name: 'a6 hotel',
    hotel_Address: 'Jeju-do Seogipo-si',
    mainArea_Name: 'Jeju-do',
    subArea_Name: 'Seogipo-si',
    hotel_Rate: 2,
    mgr_Name: 'JangHa-li'
  }
];

for(var i = 0; i < client.length; i++) {
  var query1 = 'INSERT INTO Client SET client_Email=?, client_PW=?, client_Name=?, billingInfo=?, member=?';
  var query2 = [client[i].client_Email, encrypt(client[i].client_PW), client[i].client_Name, client[i].billingInfo, client[i].member];

  connection.query(query1, query2, function(err, results, fields) {
    if (err) {
      console.log('Client Insertion unsuccessful: ' + err);
    } else {
      console.log('Client Insertion successful!');
    }
  })
}


for (var i = 0; i < hotel.length; i++) {
  var query1 = 'INSERT INTO Hotel SET hotel_ID=?, hotel_PW=?, hotel_Name=?, hotel_Address=?, mainArea_Name=?, subArea_Name=?, hotel_Rate=?, mgr_Name=?';
  var query2 = [hotel[i].hotel_ID, encrypt(hotel[i].hotel_PW), hotel[i].hotel_Name, hotel[i].hotel_Address, hotel[i].mainArea_Name, hotel[i].subArea_Name, hotel[i].hotel_Rate, hotel[i].mgr_Name];

  connection.query(query1, query2, (err, results, fields) => {
    if (err) {
      console.log('Hotel Insertion unsuccessful: ' + err);
    } else {
      console.log('Hotel Insertion successful!');
    }
  })
}


connection.query('SELECT client_Index FROM Client', (err, rows, fields) => {
  if (err) {
    console.log('Selecting client_Index unsuccessful: ' + err);
  } else {
    console.log("results is : ", rows);

    for (var i = 0; i < deal.length; i++) {
      var query1 = 'INSERT INTO Deal SET client_Index=?, hotel_ID=?, checkIn_Date=?, checkOut_Date=?, mainArea_Name=?, subArea_Name=?, bid_Price=?, bid_Transaction=?, bid_StartTime=now(), bid_EndTime=now()+INTERVAL 1 DAY, imp_uid=?';
      var query2 = [rows[i].client_Index, deal[i].hotel_ID, deal[i].checkIn_Date, deal[i].checkOut_Date, deal[i].mainArea_Name, deal[i].subArea_Name, deal[i].bid_Price, deal[i].bid_Transaction, deal[i].imp_uid];

      connection.query(query1, query2, function(err, results, fields){
        if(err){
          console.log('Deal is unsuccessful!');
          console.log(err);
        }else{
          console.log('Deal is successful!');
        }
      })
    }

    connection.end();
  }
})
