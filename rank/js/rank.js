window.onload = function() {
  displayRank('gni_5');
}

var rank_save = {};

function selectKind() {
  let e = document.getElementById('kind').value;
  e = e.split('/');
  var k = e[0].split('_');
  displayRank(e[0], (k[1] == 'sudden' ? Number(e[1]) : -1));
}

function displayRank(kind, max = -1) {
  const item = document.getElementById('rank_item_default');
  var ele = document.getElementById('rank_container');
  let title = "";
  switch (kind.split('_')[0]) {
    case 'gni':
      title = 'GNI';
      break;
    case 'gnipercap':
      title = '一人当たりGNI';
      break;
    case 'population':
      title = '国別人口';
      break;
  }
  title = title + `(${max == -1 ? kind.split('_')[1] + "問版" : "サドンデス"})`;
  document.getElementById('rank_title').innerHTML = `「${title}」<span style="display:inline-block;">スコアランキング</span>`;
  var clone = ele.cloneNode(false);
  ele.parentNode.replaceChild(clone, ele);
  ele = clone;

  let cnt = 1;
  let cur_val = 0;
  let cur_rank = 0;
  const wait_get_rank = (async() => {
    if (rank_save[kind] == null) {
      rank_save[kind] = await getRank(kind);
    }
    rank_save[kind].forEach((doc) => {
      var i = item.cloneNode(true);
      i.style = "";

      let r = cnt;
      if (doc['score'] == cur_val) r = cur_rank;
      else {
        cur_rank = r;
        cur_val = doc['score'];
      }

      if (r <= 3) i.className = `rank_item rank_${r}`;
      i.querySelector('.rank_num').innerText = `${r}`;

      if (r <= 3) i.querySelector('.rank_num').className = `rank_num rank_${r}_text`;
      i.querySelector('.rank_inner').querySelector('.rank_name').innerText = doc['name'];

      if (doc['score'] == (max == -1 ? 5001 * Number(kind.split('_')[1]) : max)) {
        i.querySelector('.rank_inner').querySelector('.rank_name').style = "color:#608;";
        i.querySelector('.rank_inner').querySelector('.rank_score').style = "color:#608;";
      }
      else if (doc['score'] >= (max == -1 ? 5000 * Number(kind.split('_')[1]) : max)) {
        i.querySelector('.rank_inner').querySelector('.rank_name').style = "color:#f00;";
        i.querySelector('.rank_inner').querySelector('.rank_score').style = "color:#f00;";
      }

      i.querySelector('.rank_inner').querySelector('.rank_score').innerHTML = doc['score'] + (max == -1 ? ' pts.' : ' 問正解') +
        (doc['score'] == (max == -1 ? 5001 * Number(kind.split('_')[1]) : max) ? '<span class="title_tag" style="color:#fff;background-color:#608;">完全制覇</span>' : 
        (doc['score'] >= (max == -1 ? 5000 * Number(kind.split('_')[1]) : max * 0.9) ? '<span class="title_tag" style="color:#fff;background-color:#f00;">達人</span>' : ""));
      
      ele.appendChild(i);
      cnt++;
    });
  })();

  wait_get_rank;
}