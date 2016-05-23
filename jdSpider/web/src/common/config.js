/**
 * Created by yh on 5/15/16.
 */


var cacheData = null;
var DataLength = 0;


module.exports = {
  setData: function(data){
    cacheData = data;
    DataLength = data.length;
  },
  getData: function(){
    return cacheData;
  },
  getDataLength: function(){
    return DataLength;
  }

};
