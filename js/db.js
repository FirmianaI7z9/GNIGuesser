const firebaseConfig = {
  apiKey: "AIzaSyBYMEqJOlsRyAkrL8ZyJvHQkCBg5rFusQA",
  authDomain: "gniguesser.firebaseapp.com",
  projectId: "gniguesser",
  storageBucket: "gniguesser.appspot.com",
  messagingSenderId: "721716216009",
  appId: "1:721716216009:web:2df462e1998c6933a10d18",
  measurementId: "G-TR2SEZN0N3"
};

const getRank = async(e) => {
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();

  var ret = [];

  return db.collection("result_" + e).orderBy('score', 'desc').get().then((querySnapshot) => {
    let cnt = 0;
    querySnapshot.forEach((doc) => {
      if (cnt < 20) {
        var d = doc.data();
        d['id'] = doc.id;
        ret.push(d);
      }
      else if (cnt >= 25) {
        doc.ref.delete();
      }
      cnt++;
    });
    ret.sort((a, b) => a.time - b.time);
    ret.sort((a, b) => b.score - a.score);
    return ret;
  });
}

function updateRank(e){
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();

  db.collection("result_" + e.kind).doc(e.id).update({
    score: e.score, time: e.time
  });

  return;
}

function setRank(e){
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();

  db.collection("result_" + e.kind).add({
    name: e.name, score: e.score, time: e.time
  });

  return;
}

function setAchievement(e) {
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();

  db.collection("achievement").add({
    name: e.name, type: e.type, score: e.score, subscore: e.subscore, time: e.time, level: e.level
  });

  return;
}

/*
function resetRank(e){
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();

  db.collection("result_" + e).get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      db.collection("result_" + e).doc(doc.id).delete();
    });
  });

  return;
}*/

function adjustRank(e){
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();

  var name_list = [];

  db.collection("result_" + e).orderBy('score', 'desc').get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      if (name_list.some(value => value == doc.data().name) == true) {
        db.collection("result_" + e).doc(doc.id).delete();
      }
      else {
        name_list.push(doc.data().name);
      }
    });
  });

  return;
}