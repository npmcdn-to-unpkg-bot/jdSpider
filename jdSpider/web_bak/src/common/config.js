/**
 * Created by yh on 5/15/16.
 */


var cacheData = null;
var DataLength = 0;
var currentPage = 1;
module.exports = {
  setData: function(data){
    cacheData = data;
    DataLength = data.length;
  },
  getData: function(){
    return cacheData;
  },
  getDataLength: function(){
    console.log(DataLength);
    return DataLength;
  },
  getCurrentPage: function(){
    return currentPage;
  },
  setCurrentPage: function(page){
    currentPage = page;
  }

};
