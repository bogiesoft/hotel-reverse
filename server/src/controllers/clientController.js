import db from '../db';
import moment from 'moment';
import crypto from 'crypto';
import helpers from '../config/helpers';
import email from '../config/email';

//////////////////////////////////////////////////////////////////////////
// client
//
// function        method    url
// ----------------------------------------------------------------------
// signup          post,     /client/signup
// signin          post,     /client/signin
// bid             put       /client/bid/:client_Email (or id)
// bid(all)        post      /client/bid/:client_Email (or :email or :phone)
// bid(specific)   post      /user/bid/:client_Email/:booking_Num
// cancel bid      delete    /client/bid/:client_Email/:booking_Num
// feedback        post      /client/feedback/:client_Email/:booking_Num
// update client   post      /client/info/:client_Email
//
////////////////////////////////////////////////////////////////////////

export default (express) => {
  let router = express.Router();

  router.post('/signup', (req, res) => {
    let crypted = helpers.encrypt(req.body.client_PW);
    db.Client.create({
      client_Email: req.body.client_Email,
      client_PW: crypted,
      client_Name: req.body.client_Name,
      billingInfo: req.body.billingInfo,
      member: req.body.member,
    })
    .then((client) => {
      console.log('client signup: ', client.dataValues);
      res.status(201).send({
        id_token: helpers.createToken(client.dataValues),
      });
    })
    .catch((error) => {
      console.log("fail to register to the DB:", error);
      res.status(400).send(error);
    });
  });

  router.post('/signin', (req, res) => {
    db.Client.findOne({ where: {
      client_Email: req.body.client_Email
    }})
    .then((client) => {
      if (req.body.client_PW === helpers.decrypt(client.dataValues.client_PW)) {
        console.log('successfully loged in');
        console.log(client.dataValues);
        res.status(200).send({
          id_token: helpers.createToken(client.dataValues),
        });
      } else {
        console.log("cannot log in");
        res.status(404);
      }
    })
    .catch((error) => {
      console.log("cannot log in:", error);
      res.status(400).send(error);
    })
  });

  router.put('/bid/:client_Email', (req, res) => {
    db.Client.findOne({
      where: {
        client_Email: req.params.client_Email
      }
    })
    .then((client) => {
      console.log(client.dataValues.client_Index);
      return client.dataValues.client_Index;
    })
    .then((client_Index) => {
      let now = new Date();
      let tomorrow = moment(now).add(1, 'day');

      let makeTime = (date) => {
        let yyyymmdd = date.toISOString().split('T')[0];
        let second = date.toISOString().split('T')[1];
        let hhmmss = second.split('.')[0];

        return yyyymmdd + ' ' + hhmmss;
      }

      return db.Deal.create({
        imp_uid: req.body.imp_uid,
        client_Index: client_Index,
        checkIn_Date: req.body.checkIn_Date,
        checkOut_Date: req.body.checkOut_Date,
        mainArea_Name: req.body.mainArea_Name,
        subArea_Name: req.body.subArea_Name,
        bid_Price: req.body.bid_Price,
        bid_StartTime: makeTime(now),
        bid_EndTime: makeTime(tomorrow),
        bid_Transaction: false
      })
    })
    .then((bid) =>{
      console.log('>>>> bid');
      console.log(bid.dataValues);
      res.status(200).send(bid.dataValues);
    })
    .catch((error) => {
      console.log("fail to make contract: ", error);
      res.status(400).send(error);
    })
  });

  router.post('/bid/:client_Email', (req, res) => {
    db.Client.findOne({
      where: {
        client_Email: req.params.client_Email
      }
    })
    .then((client) => {
      console.log(client.dataValues.client_Index);
      return client.dataValues.client_Index;
    })
    .then((client_Index) => {
      return db.Deal.findAll({
        where: {
          client_Index: client_Index,
          bid_Transaction: true
        }
      })
    })
    .then((deals) => {
      console.log('>>>> deals');
      let results = [];
      for (let i = 0; i < deals.length; i++) {
        console.log(deals[i].dataValues);
        results.push(deals[i].dataValues);
      }
      res.status(200).send(results);
    })
    .catch((error) => {
      console.log("cannot get contract information: ", error);
      res.status(500).send(error);
    })
  });

  router.post('/bid/:client_Email/:booking_Num', (req, res) => {
    db.Client.findOne({
      where: {
        client_Email: req.params.client_Email
      }
    })
    .then((client) => {
      console.log(client.dataValues.client_Index);
      return client.dataValues.client_Index;
    })
    .then((client_Index) => {
      return db.Deal.findAll({
        where: {
          client_Index: client_Index,
          bid_Transaction: true,
          booking_Num: req.params.booking_Num
        }
      })
    })
    .then((deal) => {
      console.log(deal[0].dataValues);
      res.status(200).send(deal[0].dataValues);
    })
    .catch((error) => {
      console.log("cannot get contract information:", error);
      res.status(500).send(error);
    })
  });

  //router.delete('/bid/:client_Email/:booking_Num', clientController.cancelContract);
  //router.post('/feedback/:client_Email/:booking_Num', clientController.makeFeedback);

  router.post('/info/:client_Email', (req, res) => {
    db.Client.findOne({
      where: {
        client_Email: req.params.client_Email
      }
    })
    .then((client) => {
      return client.dataValues;
    })
    .then((client) => {
      let data = {};
      let body = req.body;

      body.client_PW === undefined ?
          data.client_PW = client.client_PW :
          data.client_PW = body.client_PW;

      body.client_Name === undefined ?
          data.client_Name = client.client_Name :
          data.client_Name = body.client_Name;

      body.billingInfo === undefined ?
          data.billingInfo = client.billingInfo :
          data.billingInfo = body.billingInfo;

      return data;
    })
    .then((data) => {
      return db.Client.update({
        client_PW: data.client_PW,
        client_Name: data.client_Name,
        billingInfo: data.billingInfo
      }, {
        where: {
          client_Email: req.params.client_Email
        }
      })
    })
    .then((result) => {
      console.log("# of updated rows: ", result);
      res.status(200).send("successfully updated");
    })
    .catch((error) => {
      console.log("cannot update user information:", error);
      res.status(500).send(error);
    })
  });

  return router;
};
