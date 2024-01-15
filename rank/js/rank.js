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
  }
  title = title + `(${kind.split('_')[1]}問版)`;
  document.getElementById('rank_title').innerHTML = `「${title}」スコアランキング`;
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
      i.querySelector('.rank_inner').querySelector('.rank_score').innerText = doc['score'] + ' pts.';
      ele.appendChild(i);
      cnt++;
    });
  })();

  wait_get_rank;
}