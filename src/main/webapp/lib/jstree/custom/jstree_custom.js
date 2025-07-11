var LoadedIds = [];
var hostURL = opener.hostURL;
var hostPjtCd = opener.hostPjtCd;

$(document).ready(function(){

  $(".tabs-tree > li").each(function(){
    $(this).on("click",function(){
      let tbaIdx = $(this).index();

      $(this).closest(".tabs-tree").children("li").removeClass("on");
      $(this).addClass("on");

      $(this).closest(".wrap-tree").find(".tabConts-tree").children(".tabCont").removeClass("on");
      $(this).closest(".wrap-tree").find(".tabConts-tree").children(".tabCont").eq(tbaIdx).addClass("on");

    });
  });

  
});





var tree = {

  sendChecked: function(){
    var checked_VUP = []; 
    var checked_ids1 = []; 
    var checked_ids2 = []; 
    var checkedNodes = $('#tree1').jstree("get_checked", true);
    $.each(checkedNodes, function() {
  
      if(this.parent == 'VUP')
      {
        //console.log(this.id);
        checked_VUP.push(this.id);
      }
      else if(this.parent != 'Construct')
        checked_ids1.push(this.id);
      else 
        checked_ids2.push(this.id);
    });
    
    if(0 >= checked_ids1.length && 0 >= checked_ids2.length && 0 >= checked_VUP.length)
    {
      bimplayer.CloseAll();
    }
    else
    {
      if(0 < checked_VUP.length)
      {
        if(checked_VUP == "F01")
        {
          let ids = ["http://192.168.0.230:8080/revits/file/F01_AXX.dtdx/download", "http://192.168.0.230:8080/revits/file/F01_PXX.dtdx/download"];
          bimload.OpenURL(ids, checked_VUP, true);
        }
        else if(checked_VUP == "F02")
        {
          let ids = ["http://192.168.0.230:8080/revits/file/F03_PXX.dtdx/download", "http://192.168.0.230:8080/revits/file/F03_AXX.dtdx/download"];
          bimload.OpenURL(ids, checked_VUP, true);
        }
        else if(checked_VUP == "F03")
        {
          let ids = ["http://192.168.0.230:8080/revits/file/F03_PXX.dtdx/download", "http://192.168.0.230:8080/revits/file/F03_AXX.dtdx/download"];
          bimload.OpenURL(ids, checked_VUP, true);
        }
      }
      if(0 < checked_ids1.length)
      {
        bimload.OpenSessionData(checked_ids1, true);
      }
      if(0 < checked_ids2.length)
      {
        bimload.OpenConstructTypeData(checked_ids2);
      }
    }
    LoadedIds = null;
    LoadedIds = checked_ids1;// + checked_ids2;

    $('#checkview-1').prop("checked", false);
    $('#checkview-2').prop("checked", false);
  },

  OnClickNode: function(nodeId){
    
    var parentNode = $('#tree1').jstree(true).get_node(nodeId).parent;
      while(parentNode != undefined)
      {
        $('#tree1').jstree('open_node', parentNode);
        parentNode = $('#tree1').jstree(true).get_node(parentNode).parent;
      }
      $("#tree1").jstree("check_node", nodeId);
  },

  _OnClickNode: function(nodeIdList){

    var templist = nodeIdList.split(',');

    templist.forEach(nodeId => {
      this.OnClickNode(nodeId);
    });
  },


  UnCheckAll: function(){
    $('#tree1').jstree("uncheck_all");
  }

}
