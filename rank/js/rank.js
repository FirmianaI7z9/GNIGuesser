window.onload = function() {
  displayRank('gni_5');
}

var rank_save = {};

function displayRank(kind) {
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
      title = '人口';
      break;
  }
  title = title + `(${kind.split('_')[1]}問版)`;
  document.getElementById('rank_title').innerHTML = `「${title}」<span style="display:inline-block;">スコアランキング</span>`;
  var clone = ele.cloneNode(false);
  ele.parentNode.replaceChild(clone, ele);
  ele = clone;

  let cnt = 1;
  const wait_get_rank = (async() => {
    if (rank_save[kind] == null) {
      rank_save[kind] = await getRank(kind);
    }
    rank_save[kind].forEach((doc) => {
      var i = item.cloneNode(true);
      i.style = "";
      if (cnt <= 3) i.className = `rank_item rank_${cnt}`;
      i.querySelector('.rank_num').innerText = `${cnt}`;
      if (cnt <= 3) i.querySelector('.rank_num').className = `rank_num rank_${cnt}_text`;
      i.querySelector('.rank_inner').querySelector('.rank_name').innerText = doc['name'];
      if (doc['score'] == 5001 * Number(kind.split('_')[1])) {
        i.querySelector('.rank_inner').querySelector('.rank_name').style = "color:#608;";
        i.querySelector('.rank_inner').querySelector('.rank_score').style = "color:#608;";
      }
      else if (doc['score'] >= 5000 * Number(kind.split('_')[1])) {
        i.querySelector('.rank_inner').querySelector('.rank_name').style = "color:#f00;";
        i.querySelector('.rank_inner').querySelector('.rank_score').style = "color:#f00;";
      }
      i.querySelector('.rank_inner').querySelector('.rank_score').innerHTML = doc['score'] + ' pts.' +
        (doc['score'] == 5001 * Number(kind.split('_')[1]) ? '<span class="title_tag" style="color:#fff;background-color:#608;">完全制覇</span>' : 
        (doc['score'] >= 5000 * Number(kind.split('_')[1]) ? '<span class="title_tag" style="color:#fff;background-color:#f00;">達人</span>' : ""));
      ele.appendChild(i);
      cnt++;
    });
  })();

  wait_get_rank;
}