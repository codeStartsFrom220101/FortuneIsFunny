document.addEventListener("DOMContentLoaded", function () {
  const prevButton = document.querySelector(".prev");
  const nextButton = document.querySelector(".next");
  const slide = document.querySelector(".slide>.box");
  const signContainers = document.querySelectorAll(".signContainer");
  const totalSlides = signContainers.length;
  let currentSlide = 0;

  // 更新輪播位置
  function updateSlidePosition() {
    const slideWidth = 100 / totalSlides; // 每個幻燈片的寬度
    console.log(currentSlide * slideWidth);
    slide.style.transform = `translateX(-${currentSlide * slideWidth}%)`;
  }

  // 下一張
  nextButton.addEventListener("click", function () {
    if (currentSlide < totalSlides - 1) {
      currentSlide++;
    } else {
      currentSlide = 0; // 循環回到第一張
    }
    updateSlidePosition();
  });

  // 上一張
  prevButton.addEventListener("click", function () {
    if (currentSlide > 0) {
      currentSlide--;
    } else {
      currentSlide = totalSlides - 1; // 循環回到最後一張
    }
    updateSlidePosition();
  });

  // 自動輪播：每 3 秒切換一次
  let autoSlideInterval = setInterval(function () {
    if (currentSlide < totalSlides - 1) {
      currentSlide++;
    } else {
      currentSlide = 0; // 循環回到第一張
    }
    updateSlidePosition();
  }, 3000);  // 每 3000 毫秒自動切換一次

  // 初始化位置
  updateSlidePosition();
});

const signBtns = document.querySelectorAll(".frame");

signBtns.forEach((btn, i) => {
  btn.addEventListener("click", () => {
    localStorage.setItem("page", JSON.stringify(i));
    console.log(localStorage.getItem("page"));
  });
});
