Page({
  data: {
    searchInputValue: '',
    searchResults: [],
    allResults: [],
    timer: null,
    showTitleAndKeywords: true
  },
  onLoad: function() {
    // 模拟初始数据
    this.setData({
      allResults: [
        { id: 1, image: '/images/example.jpg', title: '两日游', price: 199 },
      { id: 2, image: '/images/example.jpg', title: '三日游', price: 299 },
      { id: 3, image: '/images/example.jpg', title: '深度游', price: 399 },
      { id: 4, image: '/images/example.jpg', title: '一日游', price: 99 },
        { id: 5, image: '../../images/goods1.jpg', title: '丝巾', price: 58 },
        { id: 6, image: '../../images/goods2.jpg', title: '瓷杯', price: 98 }
      ],
      searchResults: [],
      keywords: ['丝巾', '瓷杯', '纪念品', '工艺品']
    });
  },
  onSearchInput: function(e) {
    const value = e.detail.value;
    clearTimeout(this.data.timer);
    this.setData({
      timer: setTimeout(() => {
        this.filterResults(value);
      }, 300)
    });
  },
  filterResults: function(keyword) {
    const filtered = this.data.allResults.filter(item => {
      return item.title.includes(keyword);
    });
    this.setData({
      searchResults: filtered
    });
  },
  onSearch: function() {
    const value = this.data.searchInputValue;
    if (value.trim() === '') {
      wx.showToast({
        title: '请输入搜索内容',
        icon: 'none'
      });
      return;
    }
    this.filterResults(value);
    this.setData({
      showTitleAndKeywords: false
    });
  },
  navigateToDetail: function(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../goods_detail/goods_detail?id=' + id
    });
  },
  onKeywordClick: function(e) {
    const keyword = e.currentTarget.dataset.keyword;
    this.setData({
      showTitleAndKeywords: false,
      searchInputValue: keyword
    });
    wx.nextTick(() => {
      this.filterResults(keyword);
    });
    this.filterResults(keyword);
    this.setData({
      searchInputValue: keyword
    });
  }
})