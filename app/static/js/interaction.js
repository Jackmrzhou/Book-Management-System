
$.ajaxSetup({
    async: false
});

var global_vars = {}


function borrow_book() {
    var card = document.getElementsByName("card_num")[0];
    var book = document.getElementsByName("book_num")[0];
    $.get("/borrowapi", { "cardnum": card.value, "booknum": book.value }, function (data) {
        var d = document.getElementById("msg");
        if (data.status == 1) {
            check_card();
            book.value = "";
            $("#bor").prop("disabled", "disabled");
            $("#ret").prop("disabled", "disabled");
            d.innerHTML = create_success_alert(data.msg);
        }
        else if (data.status == 2) {
            book.value = "";
            $("#bor").prop("disabled", "disabled");
            $("#ret").prop("disabled", "disabled");
            if (data.msg != null)
                d.innerHTML = create_danger_alert(data.msg) + `
                    <div id="myAlert" class="alert alert-info">
                    <center>
                        <a href="#" class="close" data-dismiss="alert">&times;</a>
                        <strong>The latest returning date:</strong>{}
                    </center>
                    </div>
                    `.replace("{}", data.date);
            else
                d.innerHTML = create_danger_alert("The Book has not been returned!");
        }
        else {
            d.innerHTML = create_danger_alert(data.msg);
        }
    })
}

function return_book() {
    var card = document.getElementsByName("card_num")[0];
    var book = document.getElementsByName("book_num")[0];
    $.get("/returnapi", { "cardnum": card.value, "booknum": book.value }, function (data) {
        var d = document.getElementById("msg");
        if (data.status == 1) {
            check_card();
            book.value = "";
            $("#bor").prop("disabled", "disabled");
            $("#ret").prop("disabled", "disabled");
            d.innerHTML = create_success_alert(data.msg);
        }
        else {
            d.innerHTML = create_danger_alert(data.msg);
        }
    })
}

function check_card() {
    var card = document.getElementsByName("card_num")[0];
    $.get("/cardapi", { "cardnum": card.value }, function (data) {
        global_vars.book_data = data;
        global_vars.pagesize = 7;
        global_vars.label = "book_info";
        render_books_info();
    })
}

function button_control() {
    $("#card-div").append(
        `<label id='card-error-label' style="display:none;" class="control-label">
            Input length must between 1 and 20.
        </label>`);
    $("input[name=card_num]").on("input", function (evt) {
        if ($(this).val().trim().length > 0 && $(this).val().trim().length <= 20) {
            $(this).closest('.form-group').removeClass('has-error');
            $(this).closest('.form-group').addClass('has-success');
            $("#card-error-label").hide();
            $("#sub").removeAttr("disabled");
        } else {
            $(this).closest('.form-group').removeClass('has-success');
            $(this).closest('.form-group').addClass('has-error');
            $("#sub").prop("disabled", "disabled");
            $("#card-error-label").show();
        }
    });
    $("#book-div").append(`
        <label id='book-error-label' style="display:none;" class="control-label">
            Input length must between 1 and 30.
        </label>
    `);
    $("input[name=book_num]").on("input", function (evt) {
        if ($(this).val().trim().length > 0 && $(this).val().trim().length <= 30) {
            $("#book-error-label").hide();
            $(this).closest('.form-group').removeClass('has-error');
            $(this).closest('.form-group').addClass('has-success');
            $("#bor").removeAttr("disabled");
            $("#ret").removeAttr("disabled");
        } else {
            $("#book-error-label").show();
            $(this).closest('.form-group').removeClass('has-success');
            $(this).closest('.form-group').addClass('has-error');
            $("#bor").prop("disabled", "disabled");
            $("#ret").prop("disabled", "disabled");
        }
    });
}

function check_input() {
    var len0 = $("input[name=card_num]").val().trim().length;
    if (len0 > 0 && len0 <= 20) {
        if ($("#op").val() == "Add") {
            var len1 = $("input[name=name]").val().trim().length;
            var len2 = $("input[name=department]").val().trim().length;
            var len3 = $("input[name=type]").val().trim().length;
            if (len1 > 0 && len1 <= 20 && len2 > 0 && len2 <= 40 && len3 > 0 && len3 <= 10)
                return true;
            return false;
        }
        return true;
    }
    return false;
}

function card_input_control() {
    $("#del_card").validate({
        highlight: function (element, errorClass) {
            $(element).closest('.form-group').removeClass('has-success');
            $(element).closest('.form-group').addClass('has-error');
        },
        unhighlight: function (element, errorClass) {
            $(element).closest('.form-group').removeClass('has-error');
            $(element).closest('.form-group').addClass('has-success');
        },
        rules: {
            card_num_1: {
                required: true,
                rangelength: [1, 20]
            }
        },
        messages: {
            card_num_1: {
                rangelength: "Input length must between 1 and 20."
            }
        },
        submitHandler: function (form) {
            $("#confirm_del").modal("show");
        }
    });
    $("#create_card").validate({
        highlight: function (element, errorClass) {
            $(element).closest('.form-group').removeClass('has-success');
            $(element).closest('.form-group').addClass('has-error');
        },
        unhighlight: function (element, errorClass) {
            $(element).closest('.form-group').removeClass('has-error');
            $(element).closest('.form-group').addClass('has-success');
        },
        rules: {
            card_num_2: {
                required: true,
                rangelength: [1, 20]
            },
            name: {
                required: true,
                rangelength: [1, 20]
            },
            department: {
                required: true,
                rangelength: [1, 40]
            },
            type: {
                required: true,
                rangelength: [1, 10]
            }
        },
        messages: {
            card_num_2: {
                rangelength: "Input length must between 1 and 20."
            },
            name: {
                rangelength: "Input length must between 1 and 20."
            },
            department: {
                rangelength: "Input length must between 1 and 40."
            },
            type: {
                rangelength: "Input length must between 1 and 10."
            }
        },
        submitHandler: function (form) {
            $.post("/createcardapi", $("#create_card").serialize(), function (data) {
                var d = document.getElementById("msg");
                if (data.status == 0) {
                    d.innerHTML = create_danger_alert(data.msg);
                }
                else {
                    var ds = $("div.has-success");
                    for (let p of ds) {
                        $(p).removeClass("has-success");
                    }
                    $("#create_card")[0].reset();
                    d.innerHTML = create_success_alert(data.msg);
                }
            });
        }
    });
}

function del_confirmed() {

    $.get("/delcardapi", { "cardnum": $("#card_num_1").val() }, function (data) {
        var d = document.getElementById("msg");
        if (data.status == 0) {
            d.innerHTML = create_danger_alert(data.msg);
        }
        else {
            var ds = $("div.has-success");
            for (let p of ds) {
                $(p).removeClass("has-success");
            }
            $("#del_card")[0].reset();
            d.innerHTML = create_success_alert(data.msg);
        }
        $("#confirm_del").modal("hide");
        $("#confirmbtn").removeAttr("disabled");
    });
    $("#confirmbtn").prop("disabled", "disables");
}

function create_danger_alert(msg) {
    var tmp = `
    <div id="myAlert" class="alert alert-danger">
        <center>
            <a href="#" class="close" data-dismiss="alert">&times;</a>
            <strong>Failed!</strong>{}
        </center>
    </div>
    `.replace("{}", msg);
    return tmp;
}

function create_success_alert(msg) {
    var tmp = `
    <div id="myAlert" class="alert alert-success">
        <center>
            <a href="#" class="close" data-dismiss="alert">&times;</a>
            <strong>Success!</strong>{}
        </center>
    </div>
    `.replace("{}", msg);
    return tmp;
}

function check_ID_passwd() {
    var len0 = $("input[name=ID]").val().trim().length;
    var len1 = $("input[name=passwd]").val().trim().length;
    if (len0 > 0 && len1 <= 20 && len1 > 0 && len1 <= 20)
        return true;
    return false;
}

function login_control() {
    $("input[name=ID]").on("input", function (evt) {
        if (check_ID_passwd()) {
            $("#sub").removeAttr("disabled");
        } else {
            $("#sub").prop("disabled", "disabled");
        }
    });
    $("input[name=passwd]").on("input", function (evt) {
        if (check_ID_passwd()) {
            $("#sub").removeAttr("disabled");
        } else {
            $("#sub").prop("disabled", "disabled");
        }
    });
}

function check_book_input() {
    $("#sgl_form").validate({
        highlight: function (element, errorClass) {
            $(element).closest('.form-group').removeClass('has-success');
            $(element).closest('.form-group').addClass('has-error');
        },
        unhighlight: function (element, errorClass) {
            $(element).closest('.form-group').removeClass('has-error');
            $(element).closest('.form-group').addClass('has-success');
        },
        rules: {
            Book_Number: {
                required: true,
                rangelength: [1, 30]
            },
            Category: {
                required: true,
                rangelength: [1, 60]
            },
            Book_Title: {
                required: true,
                rangelength: [1, 100]
            },
            Publisher: {
                required: true,
                rangelength: [1, 100]
            },
            Year: {
                required: true,
                digits: true,
                range: [0, 2018]
            },
            Author: {
                required: true,
                rangelength: [1, 30]
            },
            Price: {
                required: true,
                number: true,
                min: 0
            },
            Total: {
                required: true,
                digits: true,
                min: 1
            }
        },
        messages: {
            Book_Number: {
                rangelength: "Input length must between 1 and 30."
            },
            Category: {
                rangelength: "Input length must betwwen 1 and 60."
            },
            Book_Title: {
                rangelength: "Input length must between 1 and 100."
            },
            Publisher: {
                rangelength: "Input length must betweeen 1 and 100."
            },
            Year: {
                digits: "Input must be a integer.",
                range: "Input value must between 0 and 2018."
            },
            Author: {
                rangelength: "Input length must between 1 and 30."
            },
            Price: {
                number: "Input must be a number.",
                min: "Input value must be no less than 0."
            },
            Total: {
                digits: "Input must be a integer.",
                min: "Input value must be no less than 1."
            }
        },
        submitHandler: function (form) {
            $.post("/addbookapi", $("#sgl_form").serialize(), function (data) {
                if (data.status == 1) {
                    $("#msg").html(create_success_alert(data.msg));
                    var ds = $("div.has-success");
                    for (let p of ds) {
                        $(p).removeClass("has-success");
                    }
                    $("#sgl_form")[0].reset();
                }
                else {
                    $("#msg").html(create_danger_alert(data.msg));
                }
            });
        }
    });
}

function bind_submit() {
    $("#mul_form").submit(function (e) {
        e.preventDefault();
        var formData = new FormData();
        var file = $("#my-file-selector")[0].files[0];
        formData.append("file", file);
        formData.append("name", file.name);
        $.ajax({
            url: "/uploadapi",
            type: "POST",
            processData: false,
            data: formData,
            contentType: false,
            success: function (data) {
                if (data.status == 1) {
                    $("#msg").html(create_success_alert("Uploading successfully!"));
                }
                else {
                    $("#msg").html(create_danger_alert("Uploading failed!"));
                }
                $('#mul_form')[0].reset();
                $("#upload-file-info").html("");
            }
        })
    });
}

function check_search_input(){
    $("#search-form").validate({
        highlight: function (element, errorClass) {
            $(element).closest('.form-group').removeClass('has-success');
            $(element).closest('.form-group').addClass('has-error');
        },
        unhighlight: function (element, errorClass) {
            $(element).closest('.form-group').removeClass('has-error');
            $(element).closest('.form-group').addClass('has-success');
        },
        rules:{
            Category: {
                rangelength: [1, 60]
            },
            Title: {
                rangelength: [1, 100]
            },
            Publisher: {
                rangelength: [1, 100]
            },
            Author:{
                rangelength :[1, 30]
            },
            Year_start:{
                digits: true,
                range: [0, 2018]
            },
            Year_end:{
                digits: true,
                range: [0, 2018]
            },
            Price_start:{
                number: true,
                min: 0
            },
            Price_end:{
                number: true,
                min: 0
            }
        },
        messages:{
            Category: {
                rangelength: "Input length must betwwen 1 and 60."
            },
            Title: {
                rangelength: "Input length must between 1 and 100."
            },
            Publisher: {
                rangelength: "Input length must betweeen 1 and 100."
            },
            Year_end: {
                digits: "Input must be a integer.",
                range: "Input value must between 0 and 2018."
            },
            Author: {
                rangelength: "Input length must between 1 and 30."
            },
            Year_start: {
                digits: "Input must be a integer.",
                range: "Input value must between 0 and 2018."
            },
            Price_end: {
                number: "Input must be a number.",
                min: "Input value must be no less than 0."
            },
            Price_start: {
                number: "Input must be a number.",
                min: "Input value must be no less than 0."
            }
        },
        submitHandler:function(form){
            $("#msg").html("");
            $("#book_info").html("");
            var flag = true;
            for (let t of $("input")){
                if (t.type != "submit" && t.type!="hidden" && t.value != "")
                    flag =false;
            }
            if (flag){
                $("#msg").html(create_danger_alert("Search conditions can't be empty!"))
                var ds = $("div.has-success");
                for (let p of ds) {
                    $(p).removeClass("has-success");
                }
                return false;
            }
            else {
                $.post("/searchapi", $(form).serialize(), function(data){
                    if (data.status == 1){
                        global_vars.book_data = data;
                        global_vars.pagesize = 5;
                        global_vars.label = "book_info";
                        render_books_info();
                    }
                    else {
                        $("#msg").html(create_danger_alert(data.msg));
                    }
                });
            }
        }
    });
}

function render_books_info(){
    var data = global_vars.book_data;
    var pagesize = global_vars.pagesize;
    var label = global_vars.label;
    $("#msg").html("");
    if (data.status == 0) {
        $("#msg").html(create_danger_alert(data.msg));
        return;
    }
    var total_size = data.Book.length;
    var pages = Math.ceil(total_size / pagesize);
    var page_tmp=`
    <nav aria-label="Page navigation" style="text-align: center;">
        <ul class="pagination">
            <li>
                <a class="cur_view" onclick="jumpto(1);">Top</a>
            </li>
            <li id="prev" class="disabled">
                <a aria-label="Previous" onclick="pre_page();" class="cur_view">
                    <span aria-hidden="true">Previous</span>
                </a>
            </li>
            {}
            <li id="next">
                <a aria-label="Next" onclick="next_page();" class="cur_view">
                    <span aria-hidden="true">Next</span>
                </a>
            </li>
            <li>
                <a class="cur_view" onclick="jumpto([]);">Bottom</a>
            </li>
        </ul>
	</nav>
    `.replace("[]", pages);
    var inner = ``;
    for (var i = 1; i <= pages; i++){
        inner += "<li id='page_{}'><a class='cur_view' onclick='jumpto({});'>{}</a></li>".replace(/{}/g, i);
    }
    page_tmp = page_tmp.replace("{}", inner);
    $("#page").html(page_tmp);
    global_vars.crt_page = 1;
    jumpto(1);
}

function render_books(){
    var data = global_vars.book_data;
    var start = (global_vars.crt_page-1)*global_vars.pagesize;
    var end = (global_vars.crt_page)*global_vars.pagesize;
    var label = global_vars.label;
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
                    <th>Press</th>
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
    for (let b of data.Book.slice(start, end)) {
        var tr = "<tr>";
        for (let attr of attrs) {
            if (attr == "price")
                tr += "<td>" + (parseFloat(b[attr])).toFixed(2) + "</td>";
            else
                tr += "<td>" + b[attr] + "</td>";
        }
        tr += "</tr>";
        tab += tr;
    }
    tab += "</tbody></table>";
    $("#"+label).html(tab);
}

function jumpto(page){
    $("li.active").removeClass("active");
    $("#page_{}".replace("{}", page)).addClass("active");
    if($("#page_{}".replace("{}", page)).prev().attr("id") == "prev"){
        $("#prev").addClass("disabled");
    }
    else {
        $("#prev").removeClass("disabled");
    }
    if($("#page_{}".replace("{}", page)).next().attr("id")=="next"){
        $("#next").addClass("disabled");
    }
    else{
        $("#next").removeClass("disabled");
    }
    global_vars.crt_page = page;
    render_books();
}
function pre_page(){
    jumpto(global_vars.crt_page-1);
}

function next_page(){
    jumpto(global_vars.crt_page+1);
}