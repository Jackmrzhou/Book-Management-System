function disp_input(value){
    if(value == "Add"){
        $("#del-card-input").hide();
        $("#card_info").show();
        $("#msg").html("");
    }
    else if(value == "Del"){
        $("#del-card-input").show();
        $("#card_info").hide();
        $("#msg").html("");
    }
}

function disp_input_book(value){
    if (value == "sgl"){
        $("#single").show();
        $("#multiple").hide();
        $("#sub_sgl").prop("#disabled", "disabled");
        $("#msg").html("");
    }
    else if (value == "mul"){
        $("#single").hide();
        $("#multiple").show();
        $("#msg").html("");
    }
}