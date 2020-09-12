require('dotenv').config();
const mongoose = require("mongoose");
// const User = require("../models/userModel.js");
// const Webinar = require("../models/webinarModel.js");
const { User, Webinar } = require("../models");

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});

const users = ["Bill", "Edward", "Pablo", "Gil", "Francesca", "Edith", "Sasha"];

let UserSeed = [];

const role = () => {
  const biNum = (Math.floor(Math.random() * 2) + 1)
  if (biNum === 1) {
    return "Virtuoso";
  } else {
    return "Prodigy";
  }
}

UserSeed = users.map(user => ({
  firstname: user,
  lastname: `${user}son`,
  email: `${user.toLowerCase()}@testmail.com`,
  password: "password",
  role: role()
}));

const webinars = ["Data and you!", "Best Financing Practices", "Putting the We in Web dev!", "How to get a raise in 10 days!", "What to do when you become the boss", "Uh Oh, my database has been wiped!"]
const topics = ["JavaScript", "Python", "Angular", "React", "Node JS", "MongoDB"];
let WebinarSeed = [];

const skill = () => {
  const triNum = (Math.floor(Math.random() * 3) + 1);
  if (triNum === 1) {
    return "Beginner";
  } else if (triNum === 2) {
    return "Intermediate"
  } else {
    return "Advanced";
  }
}
const month = () => {
  return (Math.floor(Math.random() * 3) + 10);
}
const day = () => {
  return (Math.floor(Math.random() * 28) + 1);
}
const ranMainTopic = () => {
  return topics[Math.floor(Math.random()*topics.length)]
}

const dayGen = () => {
  return `2020-${month()}-${day()}`;
}

WebinarSeed = webinars.map(webinar => ({
  title: webinar,
  description: "This is a really awesome Webinar!!!",
  date: {
    date: dayGen(),
    duration: 60,
    event: {
      title: webinar,
      color: 'blue',
      textColor: 'white'
    }
  },
  mainTopic: ranMainTopic(),
  skillLevel: skill(),
  tags: {
    educational: true,
    networking: true,
    finance: true,
    marketing: false,
    engineering: false
  }
}));

const UserSeeder = async () => {

  for (userDoc of UserSeed) {
    let newUser = new User(userDoc);
    await newUser.save();
  }
  // const a = await User.find();
  // console.log('user: ', a);
}

const WebinarSeeder = async () => {

  for (webinarDoc of WebinarSeed) {
    let newWebinar = await new Webinar(webinarDoc);
      newWebinar.date.event.start = `${newWebinar.date.date}T09:00:00`;
      newWebinar.date.event.end = `${newWebinar.date.date}T10:00:00`;
    await newWebinar.save();

    let creatorCase = await User.findOne({ firstname: "Bill" });
    await Webinar.findOneAndUpdate({ title: webinarDoc.title }, { created_by: creatorCase, hosts: creatorCase });

    for (user of UserSeed) {
      let userUp = await User.findOne({ firstname: user.firstname });
      console.log(userUp)
      userUp.registered.push(newWebinar);
      userUp.favorite.push(newWebinar);
      userUp.save();

    }

  }

}

User.deleteMany({}).then(() => UserSeeder());
Webinar.deleteMany({}).then(() => WebinarSeeder());


// User.deleteMany({})
//   .then(() => {
//     return Webinar.deleteMany({})
//   })
//   .then(() => {
//     return User.insertMany(UserSeed);
//   })
//   .then(() => {
//     return Webinar.insertMany(WebinarSeed);
//   })
//   .then(
//     data => {
//       console.log(`${data.length} records inserted!`);
//       process.exit(0);
//     })
//   .catch(err => {
//     console.error(err);
//     process.exit(1);
//   });
