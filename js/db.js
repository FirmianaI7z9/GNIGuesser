const firebaseConfig = {
  apiKey: "AIzaSyBYMEqJOlsRyAkrL8ZyJvHQkCBg5rFusQA",
  authDomain: "gniguesser.firebaseapp.com",
  projectId: "gniguesser",
  storageBucket: "gniguesser.appspot.com",
  messagingSenderId: "721716216009",
  appId: "1:721716216009:web:2df462e1998c6933a10d18",
  measurementId: "G-TR2SEZN0N3"
};

const getData = async() => {
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();

  var ret = [];

  return db.collection("gni_data").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      ret.push(doc.data());
    });
    return ret;
  });
}

const getRank = async(e) => {
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();

  var ret = [];

  return db.collection("result_" + e).orderBy('score', 'desc').limit(20).get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      ret.push(doc.data());
    });
    return ret;
  });
}

const getPlace = async(e) => {
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();

  return db.collection("result_" + e.kind).orderBy('score', 'asc').startAfter(e.value).get().then((querySnapshot) => {
    return querySnapshot.size;
  });
}

function setRank(e){
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();

  db.collection("result_" + e.kind).add({
    name: e.name, score: e.score, time: e.time
  });

  return;
}

function setData(e){
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();

  db.collection("gni_data").doc(e.cname).set({
    gni: e.gni, gnipercap: e.gpc, jp: e.jp, type: false
  });

  return;
}