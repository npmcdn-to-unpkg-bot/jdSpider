/**
 * Created by yh on 5/15/16.
 */


var cacheData = null;
var DataLength = 0;
var currentPage = 1;
var searchIndex = "";
var searchName = "";
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
  },
  getSearchIndex: function(){
    return searchIndex;
  },
  getSearchName: function(){
    return searchName;
  },
  setSearchIndex: function(Index){
    searchIndex = Index;
    console.log("searchIndex"+searchIndex)
  },
  setSearchName: function(Name){
    searchName = Name;
     console.log("searchName"+searchName)
  }

};
