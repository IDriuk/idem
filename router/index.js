const _ = require('lodash');
const path = require('path');
const md5 = require('md5');
const { User, Invite, addInvite } = require('./models');

module.exports = function(app) {

  app.post('/archive', (req, res) => {
    const {subscription, uid: subscriber, hash, url} = req.body;

    User.findOne({ hash }, function(err, owner) {

      Invite.findOne({ 'owner': owner.uid, url }, function(err, invite){
        const {subscribe, unsubscribe, archive } = invite;

        if ( subscription == 'archive' ) {
          invite.unsubscribe = _.filter(unsubscribe, (uid) => uid != subscriber);
          invite.subscribe = _.filter(subscribe, (uid) => uid != subscriber);
          _.indexOf(archive, subscriber) < 0 ? invite.archive.push(subscriber) : '';
        } else {
          invite.archive = _.filter(archive, (uid) => uid != subscriber);
        }

        invite.save(function(err) {
          res.send('archive');
        });
      });
    });
  });

  app.post('/subscribe', (req, res) => {
    const { subscription, url, hash } = req.body;

    User.findOne({ hash }, function(err, user) {
      const { uid: subscriber } = user;

      Invite.findOne({ url }, function(err, invite) {
        const {subscribe, unsubscribe } = invite;

        invite.unsubscribe = _.filter(unsubscribe, (uid) => uid != subscriber);
        invite.subscribe = _.filter(subscribe, (uid) => uid != subscriber);
        subscription == 'subscribe' ? invite.subscribe.push(subscriber)
                                    : invite.unsubscribe.push(subscriber);

        invite.save(function(err) {
          res.send(JSON.stringify(invite));
        });
      })
    });

  })

  app.get('/fetch/:user_hash', (req, res) => {

    const { params: { user_hash: hash }} = req;

    User.findOne({ hash }, function(err, user) {
      if (!user || user.black != "false") {
        res.send('вы не зарегистрированны или в чёрном списке');
        return;
      }

      const { uid: owner } = user;

      Invite.find({}).sort({position: -1}).lean().exec( function(err, invites) {
        const owners = _.map(invites, 'owner');
        const subscribers = _.uniq(
          _.flatten(
            _.map( _.filter(invites, { owner }), ( invite ) => {
                const { subscribe, unsubscribe, archive } = invite;
                return  subscribe.concat(unsubscribe).concat(archive);
        })));

        User.find(
          { uid: {$in: _.concat(owners, subscribers)}},
          { _id: 0, uid: 1, first_name: 1, photo_rec: 1},
          function(err, users) {

            const enhanceInvites = _.map(invites, (invite) => {
              const { subscribe, unsubscribe, archive } = invite;

              invite.isSubscribed = _.indexOf(subscribe, owner) > -1 ? true : false;
              invite.subCount = subscribe.length;

              if (invite.owner == owner) {

                invite.isOwner = true;
                invite.subscribe = _.map(subscribe, (uid) => _.find(users, {uid})).reverse();
                invite.unsubscribe = _.map(unsubscribe, (uid) => _.find(users, {uid})).reverse();
                invite.archive = _.map(archive, (uid) => _.find(users, {uid})).reverse();
              } else {

                invite.isOwner = false;
                invite.subscribe = [];
                invite.unsubscribe = [];
                invite.archive = [];
              }

              invite.owner = _.find(users, {uid: invite.owner});

              return invite;
            });

            res.send(JSON.stringify(enhanceInvites));
        });
      });
    });

  });

  app.post('/signin', (req, res) => {
    const { VK_APP_ID, VK_SECRET_KEY } = process.env;
    const { uid, first_name, last_name, photo, photo_rec, hash } = req.body;

    const testHash = md5(VK_APP_ID + uid + VK_SECRET_KEY);

    if (testHash == hash) {

      User.count({ hash }, function(err, count) {
        if (err) {
          res.send('user count error');
        } else {
          if (count == 0) {
            const black = "false";
            const newUser = new User({uid, first_name, last_name, photo, photo_rec, hash, black});
            newUser.save(function(err) {
              if (err) {
                res.send('user save error');
              } else {
                res.send('user save success');
              }
            });
          } else {
            res.send('user already exists');
          }
        }
      });
    } else {
        res.send('user hash error');
    }

  });

  // app.post(`/addInvite`, (req, res) => {
  //   const { invite, user } = req.body;
  //   addInvite(invite, user);
  // });

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../index.html'));
  });

}
