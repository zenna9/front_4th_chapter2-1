let saleItemList, itemDropbox_Elmt, addBtn, cartItem_Elmt, sum, stockInfo;
let lastSel, bonusPts=0, totalPrice=0, itemCnt=0;
function main() {
  saleItemList=[
    {id: 'p1', name: '상품1', price: 10000, amount: 50 },
    {id: 'p2', name: '상품2', price: 20000, amount: 30 },
    {id: 'p3', name: '상품3', price: 30000, amount: 20 },
    {id: 'p4', name: '상품4', price: 15000, amount: 0 },
    {id: 'p5', name: '상품5', price: 25000, amount: 10 }
  ];
  
  let cont=document.createElement('div');
  cont.className='bg-gray-100 p-8';

  let wrap=document.createElement('div');
  wrap.className='max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8';
  
  let hTxt=document.createElement('h1');
  hTxt.className='text-2xl font-bold mb-4';
  hTxt.textContent='장바구니';

  cartItem_Elmt=document.createElement('div');
  cartItem_Elmt.id='cart-items';

  sum=document.createElement('div');
  sum.id='cart-total';
  sum.className='text-xl font-bold my-4';

  itemDropbox_Elmt=document.createElement('select');
  itemDropbox_Elmt.id='product-select';
  itemDropbox_Elmt.className='border rounded p-2 mr-2';

  addBtn=document.createElement('button');
  addBtn.id='add-to-cart';
  addBtn.className='bg-blue-500 text-white px-4 py-2 rounded';
  addBtn.textContent='추가';
  
  stockInfo=document.createElement('div');
  stockInfo.id='stock-status';
  stockInfo.className='text-sm text-gray-500 mt-2';

  setSaleItemDropbox();
  wrap.appendChild(hTxt);
  wrap.appendChild(cartItem_Elmt);
  wrap.appendChild(sum);
  wrap.appendChild(itemDropbox_Elmt);
  wrap.appendChild(addBtn);
  wrap.appendChild(stockInfo);
  cont.appendChild(wrap);
  document.getElementById('app').appendChild(cont);

  calcTotalPrice();

  setTimeout(function () {
    setInterval(function () {
      let luckyItem=saleItemList[Math.floor(Math.random() * saleItemList.length)];
      if(Math.random() < 0.3 && luckyItem.amount > 0) {
        luckyItem.price=Math.round(luckyItem.price * 0.8);
        alert('번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');
        setSaleItemDropbox();
      }
    }, 30000);
  }, Math.random() * 10000);

  setTimeout(function () {
    setInterval(function () {
      if(lastSel) {
        let suggest=saleItemList.find(function (item) { return item.id !== lastSel && item.amount > 0; });
        if(suggest) {
          alert(suggest.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!');
          suggest.price=Math.round(suggest.price * 0.95);
          setSaleItemDropbox();
        }
      }
    }, 60000);
  }, Math.random() * 20000);

};

// 상품 선택 드롭박스 innerHTML 생성
function setSaleItemDropbox() {
  let innerHtmlString ="";
  saleItemList.forEach(function (item) {
    innerHtmlString += `
      <option value="${item.id}"${item.amount === 0 ? " disabled" : ""}>`
        +item.name + ' - ' + item.price+ '원'
      +`</option>`;
  });
  itemDropbox_Elmt.innerHTML=innerHtmlString;
}


function calcTotalPrice() {
  totalPrice=0;
  itemCnt=0;
  let cartItems=cartItem_Elmt.children;
  let subTot=0;
  for (let i=0; i < cartItems.length; i++) {
    (function () {
      let curItem;
      for (let j=0; j < saleItemList.length; j++) {
        if(saleItemList[j].id === cartItems[i].id) {
          curItem=saleItemList[j];
          break;
        }
      }
      let q=parseInt(cartItems[i].querySelector('span').textContent.split('x ')[1]);
      let itemTot=curItem.price* q;
      let disc=0;
      itemCnt += q;
      subTot += itemTot;
      if(q >= 10) {
        if(curItem.id === 'p1') disc=0.1;
        else if(curItem.id === 'p2') disc=0.15;
        else if(curItem.id === 'p3') disc=0.2;
        else if(curItem.id === 'p4') disc=0.05;
        else if(curItem.id === 'p5') disc=0.25;
      }
      totalPrice += itemTot * (1 - disc);
    })();
  }
  let discRate=0;
  if(itemCnt >= 30) {
    let bulkDisc=totalPrice * 0.25;
    let itemDisc=subTot - totalPrice;
    if(bulkDisc > itemDisc) {
      totalPrice=subTot * (1 - 0.25);
      discRate=0.25;
    } else {
      discRate=(subTot - totalPrice) / subTot;
    }
  } else {
    discRate=(subTot - totalPrice) / subTot;
  }
  if(new Date().getDay() === 2) {
    totalPrice *= (1 - 0.1);
    discRate=Math.max(discRate, 0.1);
  }
  sum.textContent='총액: ' + Math.round(totalPrice) + '원';
  if(discRate > 0) {
    let span=document.createElement('span');
    span.className='text-green-500 ml-2';
    span.textContent='(' + (discRate * 100).toFixed(1) + '% 할인 적용)';
    sum.appendChild(span);
  }
  updateStockInfo();
  renderBonusPts();
}

//보너스 포인트 계산
function renderBonusPts() {
  bonusPts = Math.floor(totalPrice / 1000);

  let ptsTag=document.getElementById('loyalty-points');
  if(!ptsTag) {
    sum.innerHTML += `<span id="loyalty-points" class="text-blue-500 ml-2"></span>`;
    ptsTag = document.getElementById('loyalty-points');
  }
  ptsTag.textContent='(포인트: ' + bonusPts + ')';
};

function updateStockInfo() {
  let infoMsg='';
  saleItemList.forEach(function (item) {
    if(item.amount < 5) {infoMsg += item.name + ': ' + (item.amount > 0 ? '재고 부족 ('+item.amount+'개 남음)' : '품절') + '\n';
    }
  });
  stockInfo.textContent=infoMsg;
}

main();

addBtn.addEventListener('click', function () {
  let selItem=itemDropbox_Elmt.value;
  let itemToAdd=saleItemList.find(function (p) { return p.id === selItem; });

  if(itemToAdd && itemToAdd.amount > 0) {
    let item=document.getElementById(itemToAdd.id);

    if(item) {
      let newQty=parseInt(item.querySelector('span').textContent.split('x ')[1]) + 1;

      if(newQty <= itemToAdd.amount) {
        item.querySelector('span').textContent=itemToAdd.name + ' - ' + itemToAdd.price+ '원 x ' + newQty;
        itemToAdd.amount--;
      } else {
        alert('재고가 부족합니다.');
      }

    } else {
      let newItem=document.createElement('div');
      newItem.id=itemToAdd.id;
      newItem.className='flex justify-between items-center mb-2';
      newItem.innerHTML='<span>' + itemToAdd.name + ' - ' + itemToAdd.price+ '원 x 1</span><div>' +
        '<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="' + itemToAdd.id + '" data-change="-1">-</button>' +
        '<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="' + itemToAdd.id + '" data-change="1">+</button>' +
        '<button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="' + itemToAdd.id + '">삭제</button></div>';
      cartItem_Elmt.appendChild(newItem);
      itemToAdd.amount--;
    }

    calcTotalPrice();
    lastSel=selItem;
  }
});

cartItem_Elmt.addEventListener('click', function (event) {
  let tgt=event.target;

  if(tgt.classList.contains('quantity-change') || tgt.classList.contains('remove-item')) {
    let prodId=tgt.dataset.productId;
    let itemElem=document.getElementById(prodId);
    let prod=saleItemList.find(function (p) { return p.id === prodId; });

    if(tgt.classList.contains('quantity-change')) {
      let qtyChange=parseInt(tgt.dataset.change);
      let newQty=parseInt(itemElem.querySelector('span').textContent.split('x ')[1]) + qtyChange;

      if(newQty > 0 && newQty <= prod.amount + parseInt(itemElem.querySelector('span').textContent.split('x ')[1])) {
        itemElem.querySelector('span').textContent=itemElem.querySelector('span').textContent.split('x ')[0] + 'x ' + newQty;
        prod.amount -= qtyChange;

      } else if (newQty <= 0) {
        itemElem.remove();
        prod.amount -= qtyChange;

      } else {
        alert('재고가 부족합니다.');
      }

    } else if(tgt.classList.contains('remove-item')) {
      let remQty=parseInt(itemElem.querySelector('span').textContent.split('x ')[1]);
      prod.amount += remQty;
      itemElem.remove();
    }
    calcTotalPrice();
  }
});