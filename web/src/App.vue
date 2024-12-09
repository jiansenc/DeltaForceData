<template>
  <div class="deltaForceData">

    <div v-if="backToTopButton" @click="gotop" class=" top">
      TOP↑
    </div>
    <div class="ner">
      <div class="search">
        <h3 class="tt">小学生DeltaForce</h3>
        <div class="line">
          <!-- 鼠标回车  -->
          <input @keyup.enter="onsearch" v-model="searchValue" type="text" placeholder="搜索物品名称">
          <div class="sbtn" @click="onsearch">搜索</div>
        </div>
      </div>
      <div class="searchContent">
        <ul class="nav">
          <li v-for="(item, index) in treeList" :key="index">
          <li>
            <p>{{ item.name }}</p>
          </li>
          <ul class="child">
            <li v-for="child in item.children" :class="{ act: child.name === acname }" @click="changeType(child)">{{
              child.name }}</li>
          </ul>
          </li>
        </ul>
        <ul class="objectList">
          <li data-aos="fade-up" data-aos-duration="300" :data-aos-delay="(index % 6) * 100"
            v-for="(item, index) in filteredItems" :key="item.id" :class="`L${item.grade}`">
            <div class="image">
              <img v-lazy="item.pic" width="50" height="50">
            </div>
            <div class="info">
              <h3>{{ item.objectName }}</h3>
              <div class="taglist">
                <span :data-in="item.style" v-for="(tag, index) in getRowTag(item)" class="tag">{{ tag.name }}</span>
              </div>
              <p> {{ item.desc }}</p>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <div v-if="vshowloading" class="loadDtaa">
      <div class="sb">
        <p>{{ loadingJsName }}</p>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
const filteredItems = ref([])
import Fuse from 'fuse.js'

const backToTopButton = ref(false)
const vshowloading = ref(false)
const loadingJsName = ref('')
const searchValue = ref('')
const acname = ref('消耗品')
let treeList = [
  {
    "name": "道具",
    "children": [
      { "name": "消耗品", "path": "./json/props/consume.json", "type": "consume" },
      { "name": "收集品", "path": "./json/props/collection.json", "type": "collection" },
      { "name": "钥匙", "path": "./json/props/key.json", "type": "key" },
      { "name": "曼德尔转", "path": "./json/props/mandel.json", "type": "mandel" }

    ]
  },
  {
    "name": "装备",
    "children": [
      { "name": "护甲", "path": "./json/protect/armor.json", "type": "armor" },
      { "name": "背包", "path": "./json/protect/bag.json", "type": "bag" },
      { "name": "胸挂", "path": "./json/protect/chest.json", "type": "chest" },
      { "name": "头盔", "path": "./json/protect/helmet.json", "type": "helmet" }
    ]
  },
  {
    "name": "配件",
    "children": [
      { "name": "后握把", "path": "./json/acc/accBackGrip.json", "type": "accBackGrip" },
      { "name": "枪管", "path": "./json/acc/accBarrel.json", "type": "accBarrel" },
      { "name": "前握把", "path": "./json/acc/accForeGrip.json", "type": "accForeGrip" },
      { "name": "功能性配件", "path": "./json/acc/accFunctional.json", "type": "accFunctional" },
      { "name": "护木", "path": "./json/acc/accHandGuard.json", "type": "accHandGuard" },
      { "name": "弹匣", "path": "./json/acc/accMagazine.json", "type": "accMagazine" },
      { "name": "枪口", "path": "./json/acc/accMuzzle.json", "type": "accMuzzle" },
      { "name": "瞄具", "path": "./json/acc/accScope.json", "type": "accScope" },
      { "name": "枪托", "path": "./json/acc/accStock.json", "type": "accStock" }
    ]
  },
  {
    "name": "枪械",
    "children": [
      { "name": "全部", "path": "./json/gun/gunRifle.json", "type": "gunRifle" }
    ]
  },

]
var fuse = {}
let allData = {}
let allList = []

window.addEventListener('scroll', () => {
  if (window.scrollY > 700) { // 调整 100 为您需要的像素值
    backToTopButton.value = true
  } else {
    backToTopButton.value = false
  }
});


function gotop() {
  window.scrollTo(0, 0)
}
async function loadScript() {
  vshowloading.value = true
  for (let i = 0; i < treeList.length; i++) {
    for (let j = 0; j < treeList[i].children.length; j++) {

      let item = treeList[i].children[j]

      loadingJsName.value = `正在加载 ${treeList[i].name}-${item.name}..`
      let list = await getJsonData(item)
      allData[item.type] = list
      loadingJsName.value = `...`
      allList = allList.concat(list)
    }
  }
  loadingJsName.value = `准备加载完成..`
  setTimeout(() => {
    vshowloading.value = false
  }, 1 * 1000);

  const fuseOptions = {
    keys: [
      "objectName",
      "desc.firstName"
    ]
  };

  fuse = new Fuse(allList, fuseOptions);
  let first = treeList[0].children[0]
  changeType(first)
}

function onsearch() {
  if (!searchValue.value) {
    return
  }
  let result = fuse.search(searchValue.value)
  filteredItems.value = result.map(item => item.item)
}

function changeType(row) {
  acname.value = row.name
  filteredItems.value = allData[row.type]
}
let objectMap = {
  availableCount: {
    label: '可用次数',
    unit: '次',

  },
  activeTime: {
    label: '启用时间',
    unit: '秒'
  },
  capacity: {
    label: '容量',
    unit: '格'
  },
  type: {
    label: '类型',
  },
  propsSource: {
    label: '',
  },
  replyEffect: {},
  repairPoints: {
    label: '修复',
    unit: '点'
  },
  durability: {
    label: '耐久度',
    unit: '%'
  },
  repairEfficiency: {
    label: '修复效率',
  },
  activeTime: {
    label: '启用时间',
    unit: '秒',
    style: `    background-color: #ffcc81;
    color: #70500d;`
  }

}
function getRowTag(row) {
  let obj = {}
  if (row.propsDetail) {
    obj = row.propsDetail
  }
  if (row.protectDetail) {
    obj = row.protectDetail
  }
  let list = []

  if (row.secondClassCN) {
    list.push({
      name: row.secondClassCN,
    })
  }
  if (row.thirdClassCN) {
    list.push({
      name: row.thirdClassCN,
    })
  }
  Object.keys(obj).map(item => {
    if (objectMap[item]) {
      let name = (objectMap[item].label || '') + obj[item] + (objectMap[item].unit || '')
      name = name.replace(/秒秒/, '秒')
      list.push({
        name: name,
        style: objectMap[item].style || ''
      })
    }
  })
  return list
}

async function getJsonData(row) {
  let res = await fetch(row.path).then(response => {
    return response.json();
  })
  return res.jData.data.data.list
}
loadScript()
</script>
<style lang="scss">
.loadDtaa {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: #000000c2;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99;

  .sb {
    z-index: 100;
    width: 400px;
    height: 200px;
    background-color: #FFFFFF;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 10px;
  }
}

.top {
  position: fixed;
  right: 20px;
  bottom: 20px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  box-shadow: 1px 2px 6px #0000007d;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  background-color: #FFFFFF;
  transition: 0.3s;

  &:hover {
    background-color: #2364c0;
    color: #FFFFFF;
  }
}

.deltaForceData {
  height: 100vh;
  background-image: linear-gradient(to right, #9bb3c3, #9eb0ca);

  .ner {
    background-color: #f4f4f4;

    .search {
      height: 200px;
      background-color: #000000;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;

      .tt {
        color: #FFFFFF;
        font-weight: bold;
        position: absolute;
        top: 20px;
        font-size: 24px;
        color: #45f79b;
        font-weight: bold;
      }

      .line {
        position: absolute;
        width: 600px;
        display: flex;
        border-radius: 10px;
        background-color: #FFFFFF;
        height: 50px;
        overflow: hidden;
        padding-left: 20px;

        input {

          outline: none;
          width: 400px;
          border: none;
        }

        .sbtn {
          width: 120px;
          background-color: #3688fc;
          position: absolute;
          color: #FFFFFF;
          right: 5px;
          top: 5px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          transition: 0.3s ease-in-out;
          cursor: pointer;

          &:hover {
            background-color: #2364c0;
          }
        }
      }
    }

    .searchContent {
      display: flex;
      padding: 10px;

      .nav {
        position: sticky;
        top: 15px;
        bottom: 15px;
        width: 300px;
        flex-shrink: 0;
        background-color: #fff;
        border-radius: 16px;
        margin-right: 10px;
        padding: 20px;
        height: calc(100vh - 20px);

        &>li {
          font-size: 14px;
          text-transform: uppercase;
          cursor: pointer;

          p {
            background-color: #FFFFFF;
            font-size: 12px;
            font-family: 'OPPO Sans Regular';
            border-radius: 5px;
            color: #a2a2a2;
            height: 30px;
            line-height: 30px;
            padding: 0px 20px;
          }

          .child {

            li {
              font-size: 14px;
              line-height: 28px;
              padding: 5px 20px;
              transition: 0.1s;
              border-radius: 5px;

              &.act {
                background-color: #2e67fb;
                color: #fff;
              }

              &:hover {
                background-color: #d5d5d570;
                color: #0085ef;
              }
            }
          }
        }
      }

      .objectList {
        width: 100%;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        /* 自适应列数 */
        grid-auto-rows: min-content;
        /* 行高自适应 */
        gap: 15px;

        /* 项目之间的间隙 */
        li {
          border-radius: 15px;
          overflow: hidden;
          padding: 20px;
          position: relative;
          box-shadow: 2px 2px 3px rgb(0 0 0 / 2%);

          &::before {
            content: '';
            position: absolute;
            left: 0;
            right: 0;
            top: 240px;
            bottom: 0;
            background-color: #fff;
            z-index: 1;
          }

          .taglist {
            display: flex;
            flex-wrap: wrap;
            gap: 5px;
            margin-bottom: 10px;
          }

          .tag {
            font-size: 12px;
            padding: 5px 10px;
            border-radius: 3px;
            font-family: '新宋体';
            background-color: #346bf826;
            color: #0f3caf;
          }

          .image {
            padding: 10px;
            box-sizing: content-box;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 20px;

            img {
              flex-shrink: 0;
              width: 200px;
              height: 200px;
              object-fit: contain;
              margin: 0 auto;
              filter: drop-shadow(13px 8px 14px rgba(0, 0, 0, 0.2));
            }
          }

          &.L6 {
            background-image: linear-gradient(to bottom, #97434c 0%, #fff 70%);
          }

          &.L5 {
            background-image: linear-gradient(to bottom, #8a5e3e 0%, #fff 70%);
          }

          &.L4 {
            background-image: linear-gradient(to bottom, #6c57a0 0%, #fff 70%);
          }

          &.L3 {
            background-image: linear-gradient(to bottom, #3a749f 0%, #fff 70%);
          }

          &.L2 {
            background-image: linear-gradient(to bottom, #238d6f 0%, #fff 70%);
          }

          &.L1 {
            background-image: linear-gradient(to bottom, #748084 0%, #fff 70%);
          }


          .info {
            position: relative;
            z-index: 2;

            h3 {
              font-size: 16px;
              margin-bottom: 5px;
            }

            p {
              font-size: 12px;
              font-family: "微软雅黑";
            }
          }
        }
      }
    }
  }

}
</style>