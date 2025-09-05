//index.js
Page({
  data: {
    leftList1: [],
    rightList1: [],
    leftList2: [],
    rightList2: []
  },
  navigateToDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/goods_detail/goods_detail?id=' + id
    });
  },
  navigateToSearch() {
    wx.navigateTo({
      url: '/pages/search/search'
    });
    console.log('search')
  },

  onLoad() {
    this.loadData();
  },
  loadData() {
    const mockData = [
      { id: 1, image: '/images/example.jpg', title: '两日游', price: 199 },
      { id: 2, image: '/images/example.jpg', title: '三日游', price: 299 },
      { id: 3, image: '/images/example.jpg', title: '深度游', price: 399 },
      { id: 4, image: '/images/example.jpg', title: '一日游', price: 99 },
      { id: 5, image: '/images/goods1.jpg', title: '非遗图案丝巾', price: 48 },
      { id: 6, image: '/images/goods2.jpg', title: '瓷杯盲盒', price: 68 },
    ];

    // 将数据分配到左右两列
    const leftList1 = [];
    const leftList2 = [];
    const rightList1 = [];
    const rightList2 = [];
    mockData.slice(0, -2).forEach((item, index) => {
      if (index % 2 === 0) {
        leftList1.push(item);
      } else {
        rightList1.push(item);
      }
    });
    mockData.slice(-2).forEach((item, index) => {
      if (index % 2 === 0) {
        leftList2.push(item);
      } else {
        rightList2.push(item);
      }
    });

    this.setData({ leftList1, leftList2, rightList1, rightList2 });
  }
});