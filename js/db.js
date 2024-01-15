const firebaseConfig = {
  apiKey: "AIzaSyBYMEqJOlsRyAkrL8ZyJvHQkCBg5rFusQA",
  authDomain: "gniguesser.firebaseapp.com",
  projectId: "gniguesser",
  storageBucket: "gniguesser.appspot.com",
  messagingSenderId: "721716216009",
  appId: "1:721716216009:web:2df462e1998c6933a10d18",
  measurementId: "G-TR2SEZN0N3"
};

const getData = async(e) => {
  var ret = [];
  let rURL = `data/${e}.text`;
  let r = new XMLHttpRequest();
  r.open('GET', rURL);
  r.responseType = 'json';
  r.send();
  r.onload = function() {
    d = r.response;
    console.log(d);
    var arr = d.split('\n');
    arr.forEach((item) => {
      item = item.split('\t');
      ret.push({jp: item[0], value: item[1]});
    });
    return ret;
  }
}

const getRank = async(e) => {
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();

  var ret = [];

  return db.collection("result_" + e).orderBy('score', 'desc').get().then((querySnapshot) => {
    let cnt = 0;
    querySnapshot.forEach((doc) => {
      if (cnt < 20) {
        ret.push(doc.data());
        cnt++;
      }
      else {
        doc.ref.delete();
      }
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