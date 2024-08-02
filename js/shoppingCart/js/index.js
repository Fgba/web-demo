class UIGoods {
  constructor(g) {
    this.data = g;
    this.choose = 0;
  }

  // 获取总价
  getTotalPrice() {
    return this.data.price * this.choose;
  }

  // 是否选中了此件商品
  isChoose() {
    return this.choose > 0;
  }
  // 选择的数量+1
  increase() {
    this.choose++;
  }
  // 选择的数量-1
  decrease() {
    if (this.choose === 0) {
      return;
    }
    this.choose--;
  }
}
class UIData {
  constructor() {
    const uiGoods = goods.map((g) => new UIGoods(g));
    this.uiGoods = uiGoods;
    this.deliverThreshold = 30;
    this.deliverPrice = 5;
  }
  getTotalPrice() {
    let sum = 0;
    this.uiGoods.forEach((g) => (sum += g.getTotalPrice()));
    return sum;
  }
  // 指定下标的商品选择的数量+1
  increase(index) {
    this.uiGoods[index].increase();
  }
  // 指定下标的商品选择的数量-1
  decrease(index) {
    this.uiGoods[index].decrease();
  }

  getTotalChooseNumber() {
    let totalChooseNumber = 0;
    this.uiGoods.forEach((g) => (totalChooseNumber += g.choose));
    return totalChooseNumber;
  }
  hasGoodsInCar() {
    return this.getTotalChooseNumber() > 0;
  }

  isCrossDeliverThreshold() {
    return this.getTotalPrice() > this.deliverThreshold;
  }
  isChoose(index) {
    return this.uiGoods[index].isChoose();
  }
}

class UI {
  constructor() {
    this.uiData = new UIData();
    this.doms = {
      goodsContainer: document.querySelector(".goods-list"),
      deliverPrice: document.querySelector(".footer-car-tip"),
      footerPay: document.querySelector(".footer-pay"),
      footerPayInnerSpan: document.querySelector(".footer-pay span"),
      totalPrice: document.querySelector(".footer-car-total"),
      footerCar: document.querySelector(".footer-car"),
      footerCarBadge: document.querySelector(".footer-car-badge"),
    };

    let carRect = this.doms.footerCar.getBoundingClientRect();
    this.jumpTarget = {
      x: carRect.left + carRect.width / 2,
      y: carRect.top + carRect.height / 5,
    };
    this.createHTML();
    this.updateFooter();
    this.listenEvent();
  }
  // 监听各种事件
  listenEvent() {
    this.doms.footerCar.addEventListener("animationend", () => {
      this.doms.footerCar.classList.remove("animate");
    });
  }
  // 根据商品数据创建商品列表元素
  createHTML() {
    let html = "";
    this.uiData.uiGoods.forEach((uig, index) => {
      html += `
         <div class="goods-item">
          <img src="${uig.data.pic}" alt="" class="goods-pic" />
          <div class="goods-info">
            <h2 class="goods-title">${uig.data.title}</h2>
            <p class="goods-desc">
              ${uig.data.desc}
            </p>
            <p class="goods-sell">
              <span>月售 ${uig.data.sellNumber}</span>
              <span>好评率${uig.data.favorRate}%</span>
            </p>
            <div class="goods-confirm">
              <p class="goods-price">
                <span class="goods-price-unit">￥</span>
                <span>${uig.data.price}</span>
              </p>
              <div class="goods-btns">
                <i data-index=${index} class="iconfont i-jianhao"></i>
                <span>${uig.choose}</span>
                <i data-index=${index} class="iconfont i-jiajianzujianjiahao"></i>
              </div>
            </div>
          </div>
        </div>
        `;
    });
    this.doms.goodsContainer.innerHTML = html;
  }

  increase(index) {
    this.uiData.increase(index);
    this.updateGoodsItem(index);
    this.updateFooter();
    this.jump(index);
  }
  decrease(index) {
    this.uiData.decrease(index);
    this.updateGoodsItem(index);
    this.updateFooter();
  }
  // 更新某个商品元素的显示状态
  updateGoodsItem(index) {
    const goodsDom = this.doms.goodsContainer.children[index];
    if (this.uiData.isChoose(index)) {
      goodsDom.classList.add("active");
    } else {
      goodsDom.classList.remove("active");
    }
    const span = goodsDom.querySelector(".goods-btns span");
    span.textContent = this.uiData.uiGoods[index].choose;
  }
  // 更新页脚
  updateFooter() {
    //设置起送费
    this.doms.deliverPrice.textContent = `配送费￥${this.uiData.deliverPrice}`;
    //获取总价数据
    const total = this.uiData.getTotalPrice();
    // 设置起送费还差多少
    if (this.uiData.isCrossDeliverThreshold()) {
      //   到达起送点
      this.doms.footerPay.classList.add("active");
    } else {
      this.doms.footerPay.classList.remove("active");
      // 更新还差多少钱
      let dis = this.uiData.deliverThreshold - total;
      dis = Math.floor(dis);
      this.doms.footerPayInnerSpan.textContent = `还差￥${dis}元起送`;
    }
    //  总价元素
    this.doms.totalPrice.textContent = total.toFixed(2);
    //设置购物车的样式状态
    if (this.uiData.hasGoodsInCar()) {
      this.doms.footerCar.classList.add("active");
    } else {
      this.doms.footerCar.classList.remove("active");
    }
    //设置购物车中的数量
    this.doms.footerCarBadge.textContent = this.uiData.getTotalChooseNumber();
  }

  carAnimate() {
    this.doms.footerCar.classList.add("animate");
  }
  // 抛物线跳跃的元素
  jump(index) {
    const btnAdd = this.doms.goodsContainer.children[index].querySelector(
      ".i-jiajianzujianjiahao"
    );
    let rect = btnAdd.getBoundingClientRect();
    let start = {
      x: rect.left,
      y: rect.top,
    };
    const div = document.createElement("div");
    div.className = "add-to-car";
    const i = document.createElement("i");
    i.className = "iconfont i-jiajianzujianjiahao";

    //   设置初始位置
    div.style.transform = `translateX(${start.x}px)`;
    i.style.transform = `translateY(${start.y}px)`;
    div.appendChild(i);
    document.body.appendChild(div);
    requestAnimationFrame(() => {
      //   设置结束位置
      div.style.transform = `translateX(${this.jumpTarget.x}px)`;
      i.style.transform = `translateY(${this.jumpTarget.y}px)`;
      div.addEventListener(
        "transitionend",
        () => {
          div.remove();
          this.carAnimate();
        },
        { once: true }
      );
    });
  }
}
const ui = new UI();

ui.doms.goodsContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("i-jiajianzujianjiahao")) {
    //获取data-index
    ui.increase(e.target.dataset.index);
  } else if (e.target.classList.contains("i-jianhao")) {
    //获取data-index
    ui.decrease(e.target.dataset.index);
  }
});


window.addEventListener('keypress', (e) => {
    if (e.code === 'Equal') {
        ui.increase(0);
    }else if (e.code === 'Minus') {
        ui.decrease(0);
    }
})
