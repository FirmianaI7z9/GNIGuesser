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
var data = [];
var kind = "";
var detail = [];
var position = 0;
var suddendeath = false;
var dead = false;

function unfield_change() {
  if (document.getElementById('username').value.length >= 1) {
    document.getElementById('button_start1').style = "";
    document.getElementById('button_start2').style = "";
    document.getElementById('button_start3').style = "";
  }
  else {
    document.getElementsById('button_start1').style = "display:none;";
    document.getElementsById('button_start2').style = "display:none;";
    document.getElementsById('button_start3').style = "display:none;";
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
    document.getElementById('button_start1').style = "";
    document.getElementById('button_start2').style = "";
    document.getElementById('button_start3').style = "";
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
      data.push({jp: item[0], value:item[1]});
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

  var cname = data[qnum].jp;

  document.getElementById('qnum').innerHTML = `第 ${qnum + 1} 問 (${mqnum}問中)`;
  document.getElementById('cscore').innerHTML = `現在のスコア : ${score} pts.`;
  document.getElementById('cname').innerHTML = `<b>${cname}</b>`;
  if (kind == 'gni') {
    document.getElementById('snum_0').value = '';
    document.getElementById('snum_1').value = '';
    document.getElementById('snum_2').value = '';
  }
  else if (kind == 'gnipercap') {
    document.getElementById('snum').value = '';
  }
  else if (kind == 'population') {
    document.getElementById('snum_0').value = '';
    document.getElementById('snum_1').value = '';
  }
  document.getElementById('answer_field').style = "display:none;";
  document.getElementById('button_next').style = "display:none;";
  document.getElementById('button_submit').style = "";
}

function judge(){
  var submit = 0;
  if (kind == 'gni') submit = Number(document.getElementById('snum_0').value) * 100000000 + Number(document.getElementById('snum_1').value) * 10000 + Number(document.getElementById('snum_2').value);
  else if (kind == 'gnipercap') submit = Number(document.getElementById('snum').value);
  else if (kind == 'population') submit = Number(document.getElementById('snum_0').value) * 10000 + Number(document.getElementById('snum_1').value);

  if (submit == 0) return;

  var ans = data[qnum].value;
  if (kind == 'gni') document.getElementById('ans_val').innerHTML = 
    `正解 : <b>` + (ans >= 100000000 ? `${Math.floor(ans / 100000000)}兆` : "") 
      + (ans >= 10000 ? `${Math.floor(ans % 100000000 / 10000)}億` : "")
      + `${ans % 10000}万ドル</b>`;
  else if (kind == 'gnipercap') document.getElementById('ans_val').innerHTML = `正解 : <b>${ans}ドル</b>`;
  else if (kind == 'population') document.getElementById('ans_val').innerHTML =
    `正解 : <b>` + (ans >= 10000 ? `${Math.floor(ans / 10000)}億` : "")
      + `${ans % 10000}万人</b>`;

  var s = calc_score(submit, ans);

  text_cntup(document.getElementById('score'), 0, s, 1, 'スコア : <span style="font-size:30px;color:red;"><b>', ' pts.</b></span>');
  score += s;

  if (suddendeath == true && s < 4000) {
    document.getElementById('info').style = "font-size:24px;color:red;font-weight:600;";
    dead = true;
  }

  detail.push({cname: data[qnum].jp, sub: submit, ans: ans, point: s});

  document.getElementById('answer_field').style = "";
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
    score = qnum + (dead ? -1 : 0);
    text_cntup(document.getElementById('rscore'), 0, score, 3, '<b>', ' 問</b>');
  }
  else text_cntup(document.getElementById('rscore'), 0, score, 3, '<b>', ' pts.</b>');
  if ((!suddendeath && score == mqnum * 5001) || (suddendeath && score == mqnum)) document.getElementById('rtitle').innerHTML = "称号 <b>- 完全制覇 -</b>";
  else if ((!suddendeath && score >= mqnum * 5000) || (suddendeath && score >= mqnum * 0.9)) document.getElementById('rtitle').innerHTML = "称号 <b>- 達人 -</b>";
  else document.getElementById('rtitle').innerHTML = "";

  var unit = "";
  switch (kind) {
    case 'gni':
      unit = '万ドル';
      break;
    case 'gnipercap':
      unit = 'ドル';
      break;
    case 'population':
      unit = '万人';
      break;
  }
  let cnt = 0;
  const table = document.getElementById("rt");
  detail.forEach((item) => {
    var clone = table.cloneNode(true);
    clone.querySelector('#c').innerHTML = item['cname'];
    clone.querySelector('#s').innerHTML = `${item['sub']}${unit}<br><span style="color:#f00">${item['ans']}${unit}</span>`;
    clone.querySelector('#p').innerHTML = `${item['point']} pts.`;
    clone.style = "";
    table.parentNode.appendChild(clone);
    cnt++;
  });

  const wait_get_place = (async() => {
    var rank = await getRank(`${kind}_${suddendeath ? "sudden" : mqnum}`);

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
          if (score > item.score) {
            updateRank({kind: `${kind}_${suddendeath ? "sudden" : mqnum}`, score: score, time: Date.now(), id: item.id});
          }
          isFirst = false;
        }
      });

      if (isFirst == true) {
        setRank({kind: `${kind}_${suddendeath ? "sudden" : mqnum}`, name: localStorage.getItem('username'), score: score, time: Date.now()});
      }
    }

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
  else if (s < a) return Math.floor(5000 * Math.pow(s / (a - Math.floor(a / 10)), 1.5));
  else if (s <= a * 5) return Math.floor(5000 * Math.pow((a * 5 - s) / (a * 4 - Math.floor(a / 10)), 1.5));
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
  let kindjp = {gni: "GNI", gnipercap: "一人当たりGNI", population: "国別人口"};
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