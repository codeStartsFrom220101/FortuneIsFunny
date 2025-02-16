document.addEventListener("DOMContentLoaded", function () {
  // 從 localStorage 取得頁面資料，若沒有資料則預設為 0
  const page = JSON.parse(localStorage.getItem("page")) || 0;
  let data = []; // 用來儲存從 JSON 讀取的資料
  
  // 讀取資料 (data.json)
  fetch('../asset/data.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json(); // 解析 JSON 數據
    })
    .then(d => {
      data = d; // 儲存資料
      setupPage(); // 當資料讀取完成後，初始化頁面
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
    });

  // 取得頁面中元素的引用
  const headerBtn = document.querySelectorAll(".menu li a");
  const menu = document.querySelector(".menu");
  const chooseBg = document.querySelector(".chooseBg");
  const chooseSign = document.querySelector(".chooseSign");
  const selectBtns = document.querySelectorAll(".selectBtns > a");
  const signTitle = document.querySelector(".frame > .signTitle");
  const signLuck = document.querySelector(".frame > .signLuck");
  const signature = document.querySelector(".frame > .signature");
  const startSign = document.querySelector(".startSign");
  const box = document.querySelector(".box");
  const signContainer = document.querySelector(".signContainer");
  const returnBtn = document.querySelector(".returnBtn");
  const wetEffect = document.querySelector(".wetEffect");
  const year = document.querySelector(".year");

  // 用來儲存頁面狀態的物件
  let state = {
    page, // 當前頁面的索引
    selectBtn: "", // 當前選擇的運勢按鈕
    pageType: ["運勢", "愛情", "工作"], // 頁面類型（運勢、愛情、工作）
    animateAction: false, // 用來控制動畫狀態，防止重複執行
  };

  // 初始化頁面
  function setupPage() {
    year.textContent = new Date().getFullYear(); // 顯示當前年份
    setMenuSelection(); // 設定選擇的頁面和菜單
    setSelectBtns(); // 更新選擇按鈕

    // 設定返回按鈕的顯示文本
    returnBtn.querySelector(".signType").textContent = state.pageType[state.page];
    returnBtn.addEventListener("click", returnToSelect); // 返回按鈕的點擊事件
  }

  // 設定 header 菜單的選擇項
  function setMenuSelection() {
    headerBtn.forEach((btn, i) => {
      if (i === state.page + 1) {
        // 根據頁面設定背景的位置
        const spacing = (menu.offsetWidth - btn.offsetWidth * headerBtn.length) / (headerBtn.length + 1);
        const d = (spacing + btn.offsetWidth);
        chooseBg.style.left = `${spacing - (chooseBg.offsetWidth / 2) + btn.offsetWidth / 2 + d * i}px`;
        btn.classList.add("action");
      }

      btn.addEventListener("click", () => {
        // 點擊時更新菜單項目的選擇
        if (i === 0 || state.animateAction) return;

        headerBtn.forEach(btn => btn.classList.remove("action")); // 移除所有按鈕的選中樣式
        const spacing = (menu.offsetWidth - btn.offsetWidth * headerBtn.length) / (headerBtn.length + 1);
        const d = (spacing + btn.offsetWidth);
        btn.classList.add("action");
        chooseBg.style.left = `${spacing - (chooseBg.offsetWidth / 2) + btn.offsetWidth / 2 + d * i}px`;

        state.page = i - 1; // 更新當前頁面
        changePage(); // 變更頁面內容
      });
    });

    chooseSign.textContent = state.pageType[state.page]; // 顯示當前頁面的名稱
  }

  // 設定選擇的運勢按鈕
  function setSelectBtns() {
    selectBtns.forEach((btn, i) => {
      let pageValue = state.pageType[state.page];
      btn.textContent = Object.keys(data[pageValue])[i]; // 設定按鈕的文本
      btn.addEventListener("click", () => {
        // 點擊選擇運勢類型按鈕
        if (state.animateAction) return;
        selectBtns.forEach(btn => btn.classList.remove("active")); // 移除所有按鈕的選中樣式
        btn.classList.add("active"); // 設置當前選中的按鈕
        state.selectBtn = i; // 記錄選中的按鈕索引
      });
    });
  }

  // 更新 menu 背景的位置
  function updateChooseBgPosition() {
    const menuWidth = menu.offsetWidth; // 取得菜單的寬度
    const totalBtnsWidth = Array.from(headerBtn).reduce((acc, btn) => acc + btn.offsetWidth, 0); // 計算所有按鈕總寬度
    const spacing = (menuWidth - totalBtnsWidth) / (headerBtn.length + 1); // 計算按鈕間的間距

    headerBtn.forEach((btn, i) => {
      if (btn.classList.contains("action")) {
        const d = (spacing + btn.offsetWidth);
        chooseBg.style.left = `${spacing - (chooseBg.offsetWidth / 2) + btn.offsetWidth / 2 + d * i}px`;
      }
    });
  }

  // 當螢幕大小變動時，更新菜單背景位置
  window.addEventListener("resize", updateChooseBgPosition);

  // 改變頁面內容
  function changePage() {
    let pageValue = state.pageType[state.page];
    chooseSign.textContent = pageValue; // 顯示頁面名稱
    returnBtn.querySelector(".signType").textContent = pageValue;

    selectBtns.forEach((btn, i) => {
      btn.textContent = Object.keys(data[pageValue])[i]; // 更新按鈕的文字
      btn.classList.remove("active"); // 移除所有按鈕的選中樣式
    });

    returnToSelect(); // 返回選擇頁面
  }

  // 回到選擇頁面
  function returnToSelect() {
    if (state.animateAction) return;
    if (state.selectBtn !== "") selectBtns[state.selectBtn].classList.remove("active");
    state.selectBtn = "";
    opacityDn(signContainer, 0);
    opacityDfb(box, 0, "block");
    signTitle.style.opacity = "0";
    signLuck.style.opacity = "0";
    signature.style.opacity = "0";
    returnBtn.style.opacity = "0";
  }

  // 隨機選擇一個運勢
  function randomSign() {
    return Math.floor(Math.random() * 50);
  }

  // 顯示結果
  function render() {
    state.animateAction = true;
    opacityDn(box, 1000);
    opacityDfb(signContainer, 1000, "flex");

    setTimeout(() => {
      wetting();
    }, 2000);

    const signNum = randomSign();
    const pageValue = state.pageType[state.page];
    const selectBtnValue = Object.keys(data[pageValue])[state.selectBtn];

    signTitle.textContent = selectBtnValue;
    signLuck.textContent = data[pageValue][selectBtnValue][signNum].type;
    signature.textContent = data[pageValue][selectBtnValue][signNum].content;
  }

  // 開始抽籤按鈕
  startSign.addEventListener("click", () => {
    if (state.selectBtn !== "") render(); // 如果選擇了按鈕，開始抽籤
  });

  // 動畫：淡出
  function opacityDn(doc, time) {
    doc.style.transition = `all ${time}ms linear`;
    doc.style.opacity = "0";
    setTimeout(() => {
      doc.style.display = "none"; // 隱藏元素
    }, time);
  }

  // 動畫：淡入
  function opacityDfb(doc, time, attr) {
    setTimeout(() => {
      doc.style.transition = `all ${time}ms linear`;
      doc.style.opacity = "0";
      doc.style.display = attr; // 設置顯示屬性
    }, time);

    setTimeout(() => {
      doc.style.opacity = "1"; // 顯示元素
    }, time * 2);
  }

  // 瀑布效果
  function wetting() {
    state.animateAction = true;
    wetEffect.classList.add("active");
    setTimeout(() => {
      wetEffect.classList.remove("active");
      signTitle.style.opacity = "1";
      signLuck.style.opacity = "1";
      signature.style.opacity = "1";
      returnBtn.style.opacity = "1";
    }, 5000);

    setTimeout(() => {
      state.animateAction = false;
    }, 7000);
  }

  // 初始化頁面設置
  setupPage();

  // 監聽視窗大小變化，重新調整背景位置
  window.addEventListener("resize", updateChooseBgPosition);
});
