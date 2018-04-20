function disp_input(value){
    if(value == "Add"){
        document.getElementById("card_info").style.display = "";
        $("#sub").prop("disabled","disabled");
    }
    else if(value == "Del"){
        document.getElementById("card_info").style.display = "none";
        if(check_input()){
            $("#sub").removeAttr("disabled");
        }
    }
}

function disp_input_book(value){
    if (value == "sgl"){
        $("#single").show();
        $("#multiple").hide();
        $("#sub_sgl").prop("#disabled", "disabled");
    }
    else if (value == "mul"){
        $("#single").hide();
        $("#multiple").show();
    }
}