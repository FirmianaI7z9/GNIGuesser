const shuffleArr = (src) => {
  const dst = src.slice();
  let i = src.length;
  while (i > 0) {
    i--;
    const j = Math.floor(Math.random() * (i + 1));
    [dst[i], dst[j]] = [dst[j], dst[i]];
  }
  return dst;
};

var qnum = 0;
var score = 0;
var data = [];
var kind = "";
var detail = [];

function unfield_change() {
  if (document.getElementById('username').value.length >= 1) {
    document.getElementById('button_start').style = "";
  }
  else {
    document.getElementById('button_start').style = "display:none;";
  }
}

function set(){
  var val = document.getElementById('dataset').value;
  document.getElementById('dataset').value = "";
  var d = val.split('\n');
  d.forEach(element => {
    var f = element.split('\t');
    var i = { cname: f[0], jp: f[1], gni: Number(f[3]), gpc: Number(f[2]) };
  document.getElementById('dataset').value = document.getElementById('dataset').value + i.cname + " " + i.jp + " " + i.gni + " " + i.gpc + "\n";
    setData(i);
  });
}

window.onload = function() {
  document.getElementById('username').value = localStorage.getItem('username');
  if (localStorage.getItem('username') != "") document.getElementById('button_start').style = "";
}

function start_game(k) {
  if (document.getElementById('username').value == "") return;

  kind = k;
  localStorage.setItem('username', document.getElementById('username').value);
  
  const wait_start_game = (async() => {
    const res = await getData();
    data = res;
    data = shuffleArr(data);

    var pc0 = document.getElementById("pc0");
    var pc1 = document.getElementById("pc1");
    pc0.style = "display:none";
    pc1.style = "";

    set_Q();
  })();
  
  wait_start_game;
}

function set_Q() {
  if (qnum == 5) {
    result();
    return;
  }

  var cname = data[qnum]['jp'];

  document.getElementById('qnum').innerHTML = `第 ${qnum + 1} 問 (5問中)`;
  document.getElementById('cscore').innerHTML = `現在のスコア : ${score} pts.`;
  document.getElementById('cname').innerHTML = `<b>${cname}</b>`;
  if (kind == 'gni') {
    document.getElementById('snum_0').value = '';
    document.getElementById('snum_1').value = '';
    document.getElementById('snum_2').value = '';
  }
  else {
    document.getElementById('snum').value = '';
  }
  document.getElementById('answer_field').style = "display:none;";
  document.getElementById('button_next').style = "display:none;";
  document.getElementById('button_submit').style = "";
}

function judge(){
  var submit = 0;
  if (kind == 'gni') submit = Number(document.getElementById('snum_0').value) * 100000000 + Number(document.getElementById('snum_1').value) * 10000 + Number(document.getElementById('snum_2').value);
  else if (kind == 'gnipercap') submit = Number(document.getElementById('snum').value);

  var ans = data[qnum][kind];
  if (kind == 'gni') document.getElementById('ans_val').innerHTML = 
    `正解 : <b>` + (ans >= 100000000 ? `${Math.floor(ans / 100000000)}兆` : "") 
      + (ans >= 10000 ? `${Math.floor(ans % 100000000 / 10000)}億` : "")
      + `${ans % 10000}万ドル</b>`;
  else if (kind == 'gnipercap') document.getElementById('ans_val').innerHTML = `正解 : <b>${ans}ドル</b>`;

  var s = calc_score(submit, ans);

  document.getElementById('score').innerHTML = `スコア : <span style="font-size:30px;color:red;"><b>${s} pts.</b></span>`;
  score += s;

  detail.push({cname: data[qnum]['jp'], sub: submit, ans: ans, point: s});

  document.getElementById('answer_field').style = "";
  document.getElementById('button_next').style = "";
  document.getElementById('button_submit').style = "display:none;";
}

function next_game(){
  qnum++;
  set_Q();
}

function result(){
  document.getElementById('rname').innerHTML = `<b>${localStorage.getItem('username')}</b> さんの総スコア`;
  document.getElementById('rscore').innerHTML = `<b>${score} pts.</b>`;
  if (score == 25005) document.getElementById('rtitle').innerHTML = "称号 <b>- 完全制覇 -</b>";
  else if (score >= 25000) document.getElementById('rtitle').innerHTML = "称号 <b>- 達人 -</b>";
  else document.getElementById('rtitle').innerHTML = "";

  var unit = "";
  switch (kind) {
    case 'gni':
      unit = '万ドル';
      break;
    case 'gnipercap':
      unit = 'ドル';
      break;
  }
  let cnt = 0;
  detail.forEach((item) => {
    const table = document.getElementById(`rt${cnt + 1}`);
    table.querySelector('#c').innerHTML = item['cname'];
    table.querySelector('#s').innerHTML = `${item['sub']}${unit}<br>${item['ans']}${unit}`;
    table.querySelector('#p').innerHTML = `${item['point']} pts.`;
    cnt++;
  });

  const wait_get_place = (async() => {
    const res = await getPlace({kind: kind, value: score});

    document.getElementById('rrank').innerHTML = `<b>${res + 1} 位</b>`;

    setRank({kind: kind, name: localStorage.getItem('username'), score: score, time: Date.now()});

    var pc1 = document.getElementById("pc1");
    var pc2 = document.getElementById("pc2");
    pc1.style = "display:none";
    pc2.style = "";
  })();

  wait_get_place;
}

function calc_score(s, a) {
  if (a == s) return 5001;
  else if (Math.abs(a - s) <= Math.floor(a / 10)) return 5000;
  else if (s < 0) return 0;
  else if (s < a) return Math.floor(5000 * Math.pow(s / (a - Math.floor(a / 10)), 2));
  else if (s <= a * 10) return Math.floor(5000 * Math.pow((a * 10 - s) / (a * 9 - Math.floor(a / 10)), 2));
  else return 0;
}