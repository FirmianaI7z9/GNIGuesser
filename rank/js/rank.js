window.onload = function() {
  displayRank('gni');
}

function displayRank(kind) {
  const item = document.getElementById('rank_item_default');
  var ele = document.getElementById('rank_container');
  let title = "";
  switch (kind) {
    case 'gni':
      title = 'GNI';
      break;
    case 'gnipercap':
      title = '一人当たりGNI';
      break;
  }
  document.getElementById('rank_title').innerHTML = `「${title}」スコアランキング`;
  var clone = ele.cloneNode(false);
  ele.parentNode.replaceChild(clone, ele);
  ele = clone;

  let cnt = 1;
  const wait_get_rank = (async() => {
    const res = await getRank(kind);
    res.forEach((doc) => {
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