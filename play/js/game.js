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

var mqnum = 0;
var qnum = 0;
var score = 0;
var subscore = -1;
var data = [];
var kind = "";
var detail = [];
var position = 0;
var suddendeath = false;
var dead = false;

function unfield_change() {
  if (document.getElementById('username').value.length >= 1) {
    for (let i = 1; i <= 5; i++){
      if (document.getElementById(`button_start${i}`) != null) {
        document.getElementById(`button_start${i}`).style = "";
      }
    }
  }
  else {
    for (let i = 1; i <= 5; i++){
      if (document.getElementById(`button_start${i}`) != null) {
        document.getElementById(`button_start${i}`).style = "display:none;";
      }
    }
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
  if (localStorage.getItem('username') != "") {
    for (let i = 1; i <= 5; i++){
      if (document.getElementById(`button_start${i}`) != null) {
        document.getElementById(`button_start${i}`).style = "";
      }
    }
  }
}

function start_game(k, n) {
  if (document.getElementById('username').value == "") return;

  if (n == 0) suddendeath = true;
  
  mqnum = n;
  kind = k;
  localStorage.setItem('username', document.getElementById('username').value.replace(' ', ''));
  
  function load_file() {
    const promise = new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', `data/${kind}.txt`);
      xhr.addEventListener('load', (f) => resolve(xhr));
      xhr.send();
    });
    return promise;
  }

  load_file().then((xhr) => {
    var arr = xhr.response.split('/');
    arr.forEach((item) => {
      item = item.split(' ');
      if (kind == 'city-coordinates') data.push({jp: item[0], value1:item[1], value2: item[2]});
      else data.push({jp: item[0], value:item[1]});
    });
    data = shuffleArr(data);
    if (suddendeath == true) mqnum = data.length;

    var pc0 = document.getElementById("pc0");
    var pc1 = document.getElementById("pc1");
    pc0.style = "display:none";
    pc1.style = "";

    set_Q();
  });
}

function set_Q() {
  if (qnum == mqnum) {
    result();
    return;
  }
  else if (suddendeath == true && dead == true) {
    result();
    return;
  }
  document.getElementById('button_next').style = "display:none;";

  var cname = data[qnum].jp;

  document.getElementById('qnum').innerHTML = `第 ${qnum + 1} 問 (${mqnum}問中)`;
  document.getElementById('cscore').innerHTML = `現在のスコア : ${score} pts.`;
  document.getElementById('cname').innerHTML = `<b>${cname}</b>`;

  /* 種別追加時設定必須 */
  if (kind == 'gni') {
    document.getElementById('snum_0').value = '';
    document.getElementById('snum_1').value = '';
  }
  else if (kind == 'gnipercap') {
    document.getElementById('snum').value = '';
  }
  else if (kind == 'population') {
    document.getElementById('snum_0').value = '';
    document.getElementById('snum_1').value = '';
  }
  else if (kind == 'population-jp') {
    document.getElementById('snum').value = '';
  }
  else if (kind == 'populcity-jp') {
    document.getElementById('snum_0').value = '';
    document.getElementById('snum_1').value = '';
  }
  else if (kind == 'manuproval-jp') {
    document.getElementById('snum_0').value = '';
    document.getElementById('snum_1').value = '';
  }
  else if (kind == 'city-coordinates') {
    document.getElementById('snum_0').value = '';
    document.getElementById('snum_1').value = '';
  }

  document.getElementById('answer_field').style = "display:none;";
  document.getElementById('button_next').style = "display:none;";
  document.getElementById('button_submit').style = "";
}

function judge(){
  var submit = 0,submit1 = 0.0,submit2 = 0.0;

  /* 種別追加時設定必須 */
  if (false) submit = Number(document.getElementById('snum_0').value) * 100000000 + Number(document.getElementById('snum_1').value) * 10000 + Number(document.getElementById('snum_2').value);
  else if (kind == 'gni' || kind == 'population' || kind == 'manuproval-jp' || kind == 'populcity-jp') submit = Number(document.getElementById('snum_0').value) * 10000 + Number(document.getElementById('snum_1').value);
  else if (kind == 'gnipercap' || kind == 'population-jp') submit = Number(document.getElementById('snum').value);
  else if (kind == 'city-coordinates') {
    if (Number(document.getElementById('snum_0').value) == NaN || document.getElementById('snum_0').value == '') submit1 = 999;
    else submit1 = Number(document.getElementById('snum_0').value);
    if (Number(document.getElementById('snum_1').value) == NaN || document.getElementById('snum_1').value == '') submit2 = 999;
    else submit2 = Number(document.getElementById('snum_1').value);
  }

  if ((kind != 'city-coordinates' && submit == 0) || (kind == 'city-coordinates' && (submit1 == 999 || submit2 == 999 || Math.abs(submit1) > 90 || Math.abs(submit2) > 180))) return;

  var ans,ans1,ans2;
  if (kind == 'city-coordinates') {
    ans1 = data[qnum].value1;
    ans2 = data[qnum].value2;
  }
  else ans = data[qnum].value;

  const ans_val = document.getElementById('ans_val');
  var dist;

  /* 種別追加時設定必須 */
  if (kind == 'gni') ans_val.innerHTML = `正解 : <b>` + (ans >= 10000 ? `${Math.floor(ans / 10000)}兆` : "") + `${ans % 10000}億ドル</b>`;
  else if (kind == 'gnipercap') ans_val.innerHTML = `正解 : <b>${ans}ドル</b>`;
  else if (kind == 'population') ans_val.innerHTML = `正解 : <b>` + (ans >= 10000 ? `${Math.floor(ans / 10000)}億` : "") + `${ans % 10000}万人</b>`;
  else if (kind == 'population-jp') ans_val.innerHTML = `正解 : <b>${ans}万人</b>`;
  else if (kind == 'manuproval-jp') ans_val.innerHTML = `正解 : <b>` + (ans >= 10000 ? `${Math.floor(ans / 10000)}兆` : "") + `${ans % 10000}億円</b>`;
  else if (kind == 'populcity-jp') ans_val.innerHTML = `正解 : <b>` + (ans >= 10000 ? `${Math.floor(ans / 10000)}万` : "") + `${ans % 10000}人</b>`;
  else if (kind == 'city-coordinates') {
    ans_val.innerHTML = `正解 : <br><b>緯度 : ${ans1}度<br>経度 : ${ans2}度</b>`;
    dist = calc_dist(submit1, submit2, ans1, ans2).toFixed(2);
    document.getElementById('ans_dist').innerHTML = `<b>距離誤差 : ${dist} km</b>`;
  }

  var s = (kind == "city-coordinates" ? calc_score2(dist) : calc_score(submit, ans));

  text_cntup(document.getElementById('score'), 0, s, 1, 'スコア : <span style="font-size:30px;color:red;"><b>', ' pts.</b></span>');
  score += s;

  if (suddendeath == true && s < 4000) {
    document.getElementById('info').style = "font-size:24px;color:red;font-weight:600;";
    dead = true;
  }

  if (kind == 'city-coordinates') detail.push({cname: data[qnum].jp, sub1: submit1, sub2: submit2, ans1: ans1, ans2: ans2, point: s, dist: dist});
  else detail.push({cname: data[qnum].jp, sub: submit, ans: ans, point: s});

  document.getElementById('answer_field').style = "";
  document.getElementById('ans_dist').style = "";
  document.getElementById('button_next').style = "";
  document.getElementById('button_submit').style = "display:none;";
}

function next_game(){
  qnum++;
  set_Q();
}

function result(){
  document.getElementById('button_next').style = "display:none;";
  document.getElementById('rname').innerHTML = `<b>${localStorage.getItem('username')}</b> さんの総スコア`;

  if (suddendeath) {
    subscore = score;
    score = qnum + (dead ? -1 : 0);
    text_cntup(document.getElementById('rscore'), 0, score, 3, '<b>', ' 問</b>');
  }
  else {
    text_cntup(document.getElementById('rscore'), 0, score, 3, '<b>', ' pts.</b>');
  }

  if ((!suddendeath && score == mqnum * 5001) || (suddendeath && score == mqnum)) {
    document.getElementById('rtitle').innerHTML = "称号 <b>- 完全制覇 -</b>";
    setAchievement({
      name: localStorage.getItem('username'), type: `${kind}_${suddendeath ? "sudden" : mqnum}`,
      score: score, subscore: subscore, time: Date.now(), level: "完"
    });
  }
  else if ((!suddendeath && score >= mqnum * 5000) || (suddendeath && score >= mqnum * 0.9)) {
    document.getElementById('rtitle').innerHTML = "称号 <b>- 達人 -</b>";
    setAchievement({
      name: localStorage.getItem('username'), type: `${kind}_${suddendeath ? "sudden" : mqnum}`,
      score: score, subscore: subscore, time: Date.now(), level: "達"
    });
  }
  else {
    document.getElementById('rtitle').innerHTML = "";
  }

  var unit = "";

  /* 種別追加時設定必須 */
  switch (kind) {
    case 'gni':
      unit = '億ドル';
      break;
    case 'gnipercap':
      unit = 'ドル';
      break;
    case 'population':
    case 'population-jp':
      unit = '万人';
      break;
    case 'manuproval-jp':
      unit = '億円';
      break;
    case 'populcity-jp':
      unit = '人';
      break;
    case 'city-coordinates':
      unit = '度';
      break;
  }

  let cnt = 0;
  const table = document.getElementById("rt");
  detail.forEach((item) => {
    var clone = table.cloneNode(true);
    clone.querySelector('#c').innerHTML = item['cname'];
    if (kind != 'city-coordinates') clone.querySelector('#s').innerHTML = `${item['sub']}${unit}<br><span style="color:#f00">${item['ans']}${unit}</span>`;
    else clone.querySelector('#s').innerHTML = `${item['sub1']}, ${item['sub2']}<br><span style="color:#f00">${item['ans1']}, ${item['ans2']}</span><br>(${item['dist']} km)`;
    clone.querySelector('#p').innerHTML = `${item['point']} pts.`;
    clone.style = "";
    table.parentNode.appendChild(clone);
    cnt++;
  });

  const wait_get_place = (async() => {
    var rank = await getRank(`${kind}_${suddendeath ? "sudden" : mqnum}`);

    if (rank.length > 0) {
      let cnt = 1;
      rank.forEach((item) => {
        if (score < item.score) cnt++;
      });

      document.getElementById('rrank').innerHTML = `<b>${Math.min(cnt, 21)} 位${cnt > 20 ? "以下" : ""}</b>`;
      position = cnt;

      if (cnt <= 20) {
        let isFirst = true;
        rank.forEach((item) => {
          if (localStorage.getItem('username') == item.name) {
            if (score > item.score && isFirst) {
              updateRank({kind: `${kind}_${suddendeath ? "sudden" : mqnum}`, score: score, time: Date.now(), id: item.id});
            }
            isFirst = false;
          }
        });

        if (isFirst) {
          setRank({kind: `${kind}_${suddendeath ? "sudden" : mqnum}`, name: localStorage.getItem('username'), score: score, time: Date.now()});
        }
      }
    }
    else {
      document.getElementById('rrank').innerHTML = `?位`;
      setRank({kind: `${kind}_${suddendeath ? "sudden" : mqnum}`, name: localStorage.getItem('username'), score: score, time: Date.now()});
    }

    var pc1 = document.getElementById("pc1");
    var pc2 = document.getElementById("pc2");
    pc1.style = "display:none";
    pc2.style = "";
  })();

  wait_get_place;
}

function calc_score(s, a) {
  /* 種別追加時設定必須 */
  const val = {
    gni: {m: 200000, al: 200},
    gnipercap: {m: 200000, al: 20},
    population: {m: 200000, al: 36},
    'population-jp': {m: 2000, al: 20},
    'manuproval-jp': {m: 200000, al: 20},
    'populcity-jp': {m: 5000000, al: 40}
  };

  let l = (Math.log2(a / val[kind].m)) / Math.log2(val[kind].al);
  let w = a * Math.pow(0.5, l + 1) / 10, d = a * (1 + Math.pow(0.333, l));

  if (a == s) return 5001;
  else if (Math.abs(a - s) <= w) return 5000;
  else if (s < 0 || s > d) return 0;
  else if (s < a) return Math.floor(5000 * Math.pow(s / (a - w), 1.5));
  else if (s <= d) return Math.floor(5000 * Math.pow((d - s) / (d - a - w), 1.5));
  else return 0;
}

function calc_score2(d) {
  if (d == 0) return 5001;
  else if (d <= 100) return 5000;
  else if (d <= 10000) return Math.floor(5000 / 9900 * (10000 - d));
  else return 0;
}

function text_cntup(text, from, to, duration, prefix, suffix) {
  var max = Math.floor(duration * 60);
  var max_inv = 1 / max / max;
  function f(x) {
    return Math.floor((from - to) * max_inv * Math.pow(x - max, 2) + to);
  };

  text.innerHTML = prefix + `${from}` + suffix;

  for (let i = 1; i <= max; i++) {
    var x = f(i);
    text.innerHTML = prefix + `${x}` + suffix;
  }

  var i = 1;
  const cntup = setInterval(() => {
    var x = f(i);
    text.innerHTML = prefix + `${x}` + suffix;
    i++;
    if (i > max) {
      clearInterval(cntup);
    }
  }, 16);

  text.innerHTML = prefix + `${to}` + suffix;

  return;
}

function tweet() {
  /* 種別追加時設定必須 */
  let kindjp = {gni: "GNI", gnipercap: "一人当たりGNI", population: "国別人口", 'population-jp': "都道府県別人口", 'manuproval-jp': "都道府県別製造業出荷額", 'populcity-jp': "日本の市の人口", 'city-coordinates': "主要都市座標"};

  let text = `${localStorage.getItem('username')} が「${kindjp[kind]} (${suddendeath ? "サドンデス" : mqnum + "問版"})」で` +
    ` ${score} ${suddendeath ? "問正解" : "pts.を獲得"}！`;
  
  if ((!suddendeath && score == mqnum * 5001) || (suddendeath && score == mqnum)) text += "%0a称号 - 完全制覇 -";
  else if ((!suddendeath && score >= mqnum * 5000) || (suddendeath && score >= mqnum * 0.9)) text += "%0a称号 - 達人 -";
  if (position <= 20) text += `%0a( ${position} 位相当)%0a`;
  else text += "%0a(ランキング圏外)%0a";

  let hashtags = "GNIGuesser";
  let url = "https://firmianai7z9.github.io/GNIGuesser/index.html";

  window.open("https://twitter.com/share?text=" + text + "&hashtags=" + hashtags + "&url=" + url);
}

function calc_dist(x1,y1,x2,y2) {
  x1=deg2rad(x1);
  x2=deg2rad(x2);
  y1=deg2rad(y1);
  y2=deg2rad(y2);
  var RX = 6378.137,RY=6356.752;
  var p1 = Math.atan(RY / RX * Math.tan(x1));
  var p2 = Math.atan(RY / RX * Math.tan(x2));
  var X = Math.acos(Math.sin(p1) * Math.sin(p2) + Math.cos(p1) * Math.cos(p2) * Math.cos(y1 - y2));
  var F = (RX - RY) / RX;
  var dr = F/8 * ((Math.sin(X)-X)*Math.pow((Math.sin(p1)+Math.sin(p2)), 2.0)/Math.pow(Math.cos(X/2), 2.0) - (Math.sin(X)+X)*Math.pow((Math.sin(p1)-Math.sin(p2)), 2.0)/Math.pow(Math.sin(X/2), 2.0));
  return RX * (X + dr);
}

function deg2rad(d) {
  return d * Math.PI / 180.0;
}