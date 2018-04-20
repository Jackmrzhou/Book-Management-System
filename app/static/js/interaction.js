
$.ajaxSetup({ 
    async : false 
}); 
function borrow_book(){
    var card = document.getElementsByName("card_num")[0];
    var book = document.getElementsByName("book_num")[0];
    $.get("/borrowapi", {"cardnum":card.value, "booknum": book.value},function(data){
            var d = document.getElementById("msg");
            if (data.status == 1){
                check_card();
                book.value = "";
                $("#bor").prop("disabled","disabled");
                $("#ret").prop("disabled", "disabled");
                d.innerHTML = create_success_alert(data.msg);
            }
            else if (data.status == 2){
                book.value = "";
                $("#bor").prop("disabled","disabled");
                $("#ret").prop("disabled", "disabled");
                if (data.msg != null)
                    d.innerHTML = create_warning_alert(data.msg) + `
                    <div id="myAlert" class="alert alert-primary">
                        <a href="#" class="close" data-dismiss="alert">&times;</a>
                        <strong>The latest returning date:</strong>{}
                    </div>
                    `.replace("{}", data.date);
                else 
                    d.innerHTML = create_warning_alert("The Book has not been returned!");
            }
            else{
                d.innerHTML = create_warning_alert(data.msg);
            }
        })
}

function return_book(){
    var card = document.getElementsByName("card_num")[0];
    var book = document.getElementsByName("book_num")[0];
    $.get("/returnapi", {"cardnum":card.value, "booknum":book.value}, function(data){
        var d = document.getElementById("msg");
        if (data.status == 1){
            check_card();
            book.value = "";
            $("#bor").prop("disabled","disabled");
            $("#ret").prop("disabled", "disabled");
            d.innerHTML = create_success_alert(data.msg);
        }
        else{
            d.innerHTML = create_warning_alert(data.msg);
        }
    })
}

function check_card(){
    var card = document.getElementsByName("card_num")[0];
    $.get("/cardapi", {"cardnum" : card.value}, function(data){
        document.getElementById("msg").innerHTML = "";
        var d = document.getElementById("check_result");
        if (data.status == 0){
            d.innerHTML = create_warning_alert(data.msg);
            return;
        }
        var tab = `
            <center>
                <h3><span class='label label-primary'>{}</span></h3>
            </center>
            <table class='table table-striped'>
                <thead>
                    <tr>
                        <th>Book Number</th>
                        <th>Category</th>
                        <th>Title</th>
                        <th>Publisher</th>
                        <th>Year</th>
                        <th>Author</th>
                        <th>Price</th>
                        <th>Total</th>
                        <th>Stock</th>
                    </tr>
                </thead>
                <tbody>
            `.replace("{}", data.msg);
        attrs = ["book_num", "category", "name", "publisher", "year", "author",
                    "price", "total", "stock"]
        for (let b of data.Book){
            var tr = "<tr>";
            for (let attr of attrs){
                if (attr == "price")
                    tr += "<td>" + (parseFloat(b[attr])).toFixed(2) + "</td>";
                else 
                    tr += "<td>" + b[attr] + "</td>";
            }
            tr += "</tr>";
            tab += tr;
        }
        tab += "</tbody></table>";
        d.innerHTML = tab;
    })
}

function button_control(){
    $("input[name=card_num]").on("input",function(evt){
        if($(this).val().trim().length>0 &&$(this).val().trim().length<=20){ 
            $("#sub").removeAttr("disabled");
        }else{
            $("#sub").prop("disabled","disabled");
        }
    });
    $("input[name=book_num]").on("input",function(evt){
        if($(this).val().trim().length >0 && $(this).val().trim().length <=30){
            $("#bor").removeAttr("disabled");
            $("#ret").removeAttr("disabled");
        }else{
            $("#bor").prop("disabled","disabled");
            $("#ret").prop("disabled", "disabled");
        }
    });
}

function check_input(){
    var len0 = $("input[name=card_num]").val().trim().length;
    if (len0 > 0 && len0 <= 20)
    {
        if ($("#op").val() == "Add"){
            var len1 = $("input[name=name]").val().trim().length;
            var len2 = $("input[name=department]").val().trim().length;
            var len3 = $("input[name=type]").val().trim().length;
            if (len1>0 && len1 <= 20 && len2>0 && len2 <= 40 && len3>0 && len3 <= 10)
                return true;
            return false;
        }
        return true;
    }
    return false;
}

function Card_button_control(){
    $("input[name=card_num]").on("input",function(evt){
        if (check_input()){
            $("#sub").removeAttr("disabled");
        }else{
            $("#sub").prop("disabled","disabled");
        }
    });
    $("input[name=name]").on("input",function(evt){
        if (check_input()){
            $("#sub").removeAttr("disabled");
        }else{
            $("#sub").prop("disabled","disabled");
        }
    });
    $("input[name=department]").on("input",function(evt){
        if (check_input()){
            $("#sub").removeAttr("disabled");
        }else{
            $("#sub").prop("disabled","disabled");
        }
    });
    $("input[name=type]").on("input",function(evt){
        if (check_input()){
            $("#sub").removeAttr("disabled");
        }else{
            $("#sub").prop("disabled","disabled");
        }
    });
}

function send_data(){
    if ($("#op").val()=="Add"){
        $.post("/createcardapi", {
            "card_num": $("input[name=card_num]").val(),
            "name" : $("input[name=name]").val(),
            "department" : $("input[name=department]").val(),
            "type": $("input[name=type]").val()
        },function(data){
            var d = document.getElementById("msg");
            if (data.status == 0){
                d.innerHTML = create_warning_alert(data.msg);
            }
            else {
                d.innerHTML = create_success_alert(data.msg);
            }
            $("input[name=card_num]").val("");
            $("input[name=name]").val("");
            $("input[name=department]").val("");
            $("input[name=type]").val("");
        });
    }
    else {
        $("#confirm_del").modal("show");
    }
}

function del_confirmed(){

    $.get("/delcardapi", {"cardnum":$("input[name=card_num]").val()},function(data){
        var d = document.getElementById("msg");
        if (data.status == 0){
            d.innerHTML = create_warning_alert(data.msg);
        }
        else {
            $("input[name=card_name]").val() = "";
            d.innerHTML = create_success_alert(data.msg);
        }
        $("#confirm_del").modal("hide");
        $("#confirmbtn").removeAttr("disabled");
    });
    $("#confirmbtn").prop("disabled", "disables");
}

function create_warning_alert(msg){
    var tmp = `
    <div id="myAlert" class="alert alert-warning">
        <a href="#" class="close" data-dismiss="alert">&times;</a>
        <strong>Warning!</strong>{}
    </div>
    `.replace("{}", msg);
    return tmp;
}

function create_success_alert(msg){
    var tmp = `
    <div id="myAlert" class="alert alert-success">
        <a href="#" class="close" data-dismiss="alert">&times;</a>
        <strong>Success!</strong>{}
    </div>
    `.replace("{}", msg);
    return tmp;
}

function check_ID_passwd(){
    var len0 = $("input[name=ID]").val().trim().length;
    var len1 = $("input[name=passwd]").val().trim().length;
    if (len0 >0 && len1 <= 20 && len1 > 0 && len1 <= 20)
        return true;
    return false;
}

function login_control(){
    $("input[name=ID]").on("input",function(evt){
        if (check_ID_passwd()){
            $("#sub").removeAttr("disabled");
        }else{
            $("#sub").prop("disabled","disabled");
        }
    });
    $("input[name=passwd]").on("input",function(evt){
        if (check_ID_passwd()){
            $("#sub").removeAttr("disabled");
        }else{
            $("#sub").prop("disabled","disabled");
        }
    });
}

function book_button_control(){
    names = ["Book_Number", "Category", "Book_Title", "Publisher", 
            "Year", "Author", "Price", "Total"]
    
    for (let n of names){
        $("input[name={}]".replace("{}", n)).on("input", function(evt){
            if (check_book_input(names)){
                $("#sub_sgl").removeAttr("disabled");
            }else{
                $("#sub_sgl").prop("disabled","disabled");
            }
        })
    }
}

function check_book_input(names){
    for (let n of names){
        if ($("input[name={}]".replace("{}", n)).val().trim().length==0){
            return false;
        }
        // need revisit
    }
    return true;
}