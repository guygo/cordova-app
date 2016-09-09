



function post(WebServiceURL,functionname,mdata,callback) {
   
 var newsession=false; 
 if(sessionStorage["data"])
{
    sessionStorage["data"]=JSON.stringify(mdata);
    newsession=true;
}
if(sessionStorage["data"]!=JSON.stringify(mdata))
{
sessionStorage["data"]=JSON.stringify(mdata);
 newsession=true;
}
else if(!newsession)
 {

    return;
 }

 
    $.ajax({
        url: "http://proj.ruppin.ac.il/cegroup11/prod/"+WebServiceURL +"/"+ functionname,
        dataType: "json",
        type: "POST",
        data: JSON.stringify(mdata),
        contentType: "application/json; charset=utf-8",
        error: function (err) {
            alert(JSON.stringify(err));
        },
        success: function (data) { callback(data) },


    });






}

var appcompent = {};
appcompent.app = {
    // Application Constructor
    initialize: function() {
                  document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    
    onDeviceReady: function() {

        document.getElementById("cameraTakePicture").addEventListener("click", cameraTakePicture);
        document.getElementById("cameraTakeItemPicture").addEventListener("click", cameraTakePicture);
    }
   
};

$(document).on("pageinit", "#LoginPage", function (event) {
    
    wireEventsLoginPage();
});

function wireEventsLoginPage() {

    

   
    $('#RegisterBtn').on('tap', function () {
        var mdata = { name: $('#LPName').val(), password: $('#LPPassword').val() };
        if ($('#LPName').val().indexOf("'") > -1 || $('#LPName').val().indexOf('"') > -1 || $('#LPName').val() == "" || $('LPPassword').val() == "") {
            alert("please enter valid user name and no commas");
            return;
        }

        if ($('#LPPassword').val().indexOf("'") > -1 || $('#LPPassword').val().indexOf('"') > -1 || $('#LPPassword').val()=="" || $('#LPPassword').val()=="") {
            alert("please enter valid password and no commas");
            return;
        }

        var WebServiceURL = "UserWS.asmx";
        post(WebServiceURL, "Register", mdata, function (data) {
            if (/^\d+$/.test(data.d)) {
                sessionStorage["userid"] = data.d;
                $.mobile.changePage('#CreateShopPage', { 'transition': 'flip' });
            }
            else
                alert(data.d);
        });
    });      
        $('#LoginBtn').on('tap', function () {

            var mdata = { name: $('#LPName').val(), password: $('#LPPassword').val() };
            if ($('#LPName').val().indexOf("'") > -1 || $('#LPName').val().indexOf('"') > -1) {
                alert("please enter valid user name no commas");
                return;
            }

            if ($('#LPPassword').val().indexOf("'") > -1 || $('#LPPassword').val().indexOf('"') > -1) {
                alert("please enter valid user name no commas");
                return;
            }

            WebServiceURL = "UserWS.asmx";
           
           
            post(WebServiceURL, "Login", mdata, function (data) {
                if (/^\d+$/.test(data.d)) {
                    sessionStorage["userid"] = data.d;
                    $.mobile.changePage('#CreateShopPage', { 'transition': 'flip' });
                }
                else
                    alert (data.d);
            });   
        });
   
}

$(document).on("pageshow", "#AddItems", function (event) {
    
    if (sessionStorage["shopid"] != undefined) 
     
    wireEventsAddItemsPage();
});

function wireEventsAddItemsPage() {

    WebServiceURL = "ItemsWS.asmx";
    $('#ItemsSelect').empty();
    
    
    post(WebServiceURL, "GetItems", {shopid:sessionStorage["shopid"]}, function (data) {
        var key;
        var value;
        var lbl;
        var check;
        var row = "";
        $("#tbody").empty();
        for (var i = 0; i < data.d.length; i++) {
           
            key = data.d[i].id;
            value = data.d[i].Title;
            if (i % 2 == 0) {


                $("#tbody").append(row);
                row = $("<tr></tr>");
            }
            if (data.d[i].check) {
                lbl = '<label for="check' + i + '">' + value + '</label>';
                check = '<input type="checkbox" id="check' + i + '" name="check' + i + '" value=' + key + ' data-mini="true" class="custom" disabled>';
            }
            else {
                lbl = '<label for="check' + i + '">' + value + '</label>';
                check = '<input type="checkbox" id="check' + i + '" name="check' + i + '" value=' + key + ' data-mini="true" class="custom">';
            }
            row.append("<td>" + lbl + check + "</td>");


        }
        $("#tbody").append(row);
        //$("#tbody").trigger('create');
        $("#tableProp").trigger('create');

    });
       
    $("#checkbutton").on('tap', function () {
        var items = [];
        $('input[type="checkbox"]').filter('.custom').each(function () {
            if ($(this).is(':checked')) {
                items.push( $(this).val());
            }
            else {
                // perform operation for unchecked
            }

        });
        mydata = {
            name: $("#itemname").val()||"null", description: $('textarea#description').val()||"null", pic: $("#itemimage").attr("src")||"null", shopid: sessionStorage["shopid"], choosenitems: items };
        
       
            post("ItemsWS.asmx", "AddToStore", mydata, function (data) {

                alert(data.d?"the items are now exist in the store":"sorry an error has been occured");

            });

        });


    
}


$(document).on("pageinit", "#CreateShopPage", function (event) {
      
    wireEventsCreateShopPage();
});

function wireEventsCreateShopPage() {
  
    var WebUrl="UserStore.asmx"; 
    post(WebUrl, "GetUserStore", {userid:sessionStorage["userid"]}, function (data) {
        
        for (var i = 0; i < data.d.length;i++){
           
            $("#selectshop").append($("<option></option>")
                        .attr("value", data.d[i].shopid)
                        .text(data.d[i].shopname));

        }
       
        $("#selectshop").selectmenu('refresh', true);

    });
    
    
      
    $("#pickstore").click(function () {

     
        if ($("#selectshop").val() == undefined)
            return;
        if ($("#selectshop").val() == "") {
            alert("please select store if there is any");
            return;
        }
        sessionStorage["shopname"] = $("#selectshop option:selected").text();
       
        sessionStorage["shopid"] = $("#selectshop").val();
        $.mobile.changePage('#AddItems', { 'transition': 'flip' });
      
    });
    

    $("#send").click(function () {

       
       
        mdata = {name: $('#shopname').val(), phone: $('#phone').val(), address:$("#address").val(),pic:$("#myimage").attr("src"),userid:sessionStorage["userid"]};
        for (var index in mdata) {
            value = mdata[index];
            if (index!="pic")
            {
                if (value == "") {
                    alert("please fill all the input");
                   return;
                }
                if (value.indexOf("'") > -1 || value.indexOf('"') > -1) {
                    alert("wrong input");
                    return;
                }
             
            }
            
        }
        sessionStorage["shopname"] = $('#shopname').val();
       
        var WebServiceURL = "UserStore.asmx";
        post(WebServiceURL, "AddStores", mdata, function (data) {
            if (/^\d+$/.test(data.d)) {
                sessionStorage["shopid"] = data.d;
                $.mobile.changePage('#AddItems', { 'transition': 'flip' });
            }
            else
                alert("sorry error has bee occur");
        });
        
           
    });
    


}



$(document).on("pageshow", "#ShowOrders", function (event) {
    if (sessionStorage["shopid"]!=undefined)
    wireEventsShowOrders();
});

function wireEventsShowOrders() {


    WebServiceURL = "ShowOrdersAndMeetingWS.asmx";
    


    post(WebServiceURL, "GetOrders", { shopid: sessionStorage["shopid"] }, function (data) {
        
        var res = '<table data-role="table" id="table-column-toggle" data-mode="reflow" class="ui-responsive table-stroke">' + ' <thead>' + '<tr>' + '<th data-priority="1">item</th>' + '<th data-priority="2">phone</th>' + '<th data-priority="3">mail</th>' + '</tr>' + '</thead>' + '<tbody>';
        if (data.d.length == 0)
        {
            $("#tableCont").empty().append("it seems there is no orders.");
            return;
        }
        for (var i = 0; i < data.d.length; i++) {
           
            var item = data.d[i].item;
            
            var mail = data.d[i].mail;
            var phone = data.d[i].phone;
            res += '<tr>'
            res += '<td>' + item + '</td>';
            res += '<td>' + mail + '</td>';
            res += '<td>' + phone + '</td>';
            res += '</tr>'
          

         }
        

        res += "</tbody>";
        res += "</table>";
       
        var resultsTable = $(res);
        $("#tableCont").empty().append(resultsTable).enhanceWithin();
       
    });


}

$(document).on("pageshow", "#ShowMeeting", function (event) {
    if (sessionStorage["shopname"] != undefined)
    wireEventsShowMeeting();
});

function wireEventsShowMeeting() {

    WebServiceURL = "ShowOrdersAndMeetingWS.asmx";

    

    post(WebServiceURL, "GetMeetings", { shopname: sessionStorage["shopname"] }, function (data) {


        if (data.d.length == 0) {
            $("#dtable").empty().append("it seems there is no appointments.");
            return;
        }

        var res = '<table data-role="table" id="table-column-toggle" data-mode="reflow" class="ui-responsive table-stroke">' + ' <thead>' + '<tr>' + '<th data-priority="1">name</th>' + '<th data-priority="2">phone</th>' + '<th data-priority="3">date And Time</th>' + '</tr>' + '</thead>' + '<tbody>';
       
        for (var i = 0; i < data.d.length; i++) {
           
            var date = data.d[i].date;
            var time = data.d[i].time;
            var phone = data.d[i].phone;
            var name = data.d[i].name;
            res += '<tr>'
            res += '<td>' + name + '</td>';
            res += '<td>' + phone + '</td>';
            res += '<td>' + date+"  "+time + '</td>';
            res += '</tr>'
          

        }
        

        res += "</tbody>";
        res += "</table>";
       
        var resultsTable = $(res);
        $("#dtable").empty().append(resultsTable).enhanceWithin();
    });
    }



function cameraTakePicture() {
    var buttonname = this.name;
    navigator.camera.getPicture(onSuccess, onFail, {
        quality: 100, //0-100
        destinationType: Camera.DestinationType.FILE_URI, //DATA_URL (returns base 64) or FILE_URI (returns image path)
        sourceType: Camera.PictureSourceType.CAMERA,
        allowEdit: true, //allow cropping
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 225, //what widht you want after capaturing
        targetHeight: 150,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: false
    });
    
    function onSuccess(fileuri) {
     
       
        var element = $("#" + buttonname);
        element.attr("src", fileuri);
        uploadFile(fileuri,element);
    }

    function onFail(message) {
        alert('Failed because: ' + message);
    }
}

function uploadFile(fileuri, element) {

    var fileURL = fileuri;
   

    var uri = encodeURI("http://proj.ruppin.ac.il/cegroup11/prod"+"/fileUploader.ashx/");

    var options = new FileUploadOptions();
    
    options.fileKey = "file";
    options.fileName = fileURL.substr(fileURL.lastIndexOf('/')+1);
    options.mimeType = "text/plain";

    var headers = {'headerParam':'headerValue'};
    options.headers = headers;

    var ft = new FileTransfer();

    ft.upload(fileURL, uri, onSuccess, onError, options);

    function onSuccess(r) {
 alert('Done!');
        //full url
        
       
        element.attr("src", "http://proj.ruppin.ac.il/cegroup11/prod/pics/" + r.response);
        
        clearCache();
        retries = 0;
      

    }

    function onError(error) {
        alert("An error has occurred: Code = " + error.code);
     
    }
    
}

appcompent.app.initialize();