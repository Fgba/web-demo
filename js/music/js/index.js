/**
 * 解析歌词字符串
 * @returns 得到一个歌词对象的数组，每个歌词对象：{time:开始时间, words:歌词内容}
 */
function parseLrc() {
  const lines = lrc.split("\n");
  return lines.map((line) => {
    const parts = line.split("]");
    let timeStr = parts[0].substring(1);
    return {
      time: parseTime(timeStr),
      words: parts[1],
    };
  });
}
/**
 * 将一个时间字符串解析为数字（秒）
 * @param {string} timeStr 时间字符串
 * @returns 数字
 */
function parseTime(timeStr) {
  let parts = timeStr.split(":");
  return +parts[0] * 60 + +parts[1];
}
const lrcData = parseLrc();
// 获取需要的dom
const doms = {
  audio: document.querySelector("audio"),
  ul: document.querySelector(".container ul"),
  container: document.querySelector(".container"),
};
/**
 * 计算出，在当前播放器播放到第几秒的情况下
 * lrcData数组中，应该高亮显示的歌词下标
 * @returns lrcData数组的下标，当没有歌词需要显示的时候返回-1
 */
function findIndex() {
  // 播放器当前时间
  let curTime = doms.audio.currentTime;
  let index = lrcData.findIndex((data) => data.time > curTime);
  if (index == -1) {
    //显示最后一个下标
    return lrcData.length - 1;
  }
  return index - 1;
}

/**
 * 创建歌词元素 li
 */
function createLrcElements() {
  const frag = document.createDocumentFragment();
  for (let i = 0; i < lrcData.length; i++) {
    const li = document.createElement("li");
    li.textContent = lrcData[i].words;
    // 先加到文档片段，文档片段与DOM树无关
    frag.appendChild(li);
  }
  //加到dom树中
  doms.ul.appendChild(frag);
}

createLrcElements();
// 容器高度
const containerHeight = doms.container.clientHeight;
// 每个 li 高度
const liHeight = doms.ul.children[0].clientHeight;
// 最大偏移量
const maxOffset = doms.ul.clientHeight - containerHeight;
/**
 * 设置 ul 元素的偏移量
 */
function setOffset() {
  let index = findIndex();
  let offset = index * liHeight + liHeight / 2 - containerHeight / 2;
  //最小值为0，不能为负数
  offset = Math.max(offset, 0);
  //最大值不能超过最大偏移量
  offset = Math.min(offset, maxOffset);

  doms.ul.style.transform = `translateY(-${offset}px)`;
  const lastActiveLi = doms.ul.querySelector(".active");
  if (lastActiveLi) {
    lastActiveLi.classList.remove("active");
  }
  const li = doms.ul.children[index];
  if (li) {
    li.classList.add("active");
  }
}

doms.audio.addEventListener("timeupdate", setOffset);
