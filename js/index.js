var foods = new Array();

function addToCart(id){
    var btnId = id.substr(6,id.length);
    var foodItem = foods.find(elem => elem.Id === parseInt(btnId));
    var qty = $("#qty",`#food${btnId}`).html();
    foodItem.Qty = qty;
    if((foodItem.IsStocked)){
        $(".btn-add",`#food${btnId}`).hide();
        $(".btn-remove",`#food${btnId}`).show();
        $(".qty-btns",`#food${btnId}`).hide();
        $("#in-cart",`#food${btnId}`).html(qty)
        .css("opacity","1");

        if("cart" in localStorage){
            let cart = JSON.parse(localStorage.getItem("cart"));
            cart.push(foodItem);
            localStorage.setItem("cart",JSON.stringify(cart));
        }else{
            let cart = new Array();
            cart.push(foodItem);
            localStorage.setItem("cart",JSON.stringify(cart));
        }
    }  
}
function removeFromCart(id){
    var btnId = id.substr(9,id.length);
    $(".btn-add",`#food${btnId }`).show();
    $(".qty-btns",`#food${btnId }`).show();
    $(".btn-remove",`#food${btnId }`).hide();
    $("#in-cart",`#food${btnId}`).css("opacity","0");
    
    if("cart" in localStorage){
        let cart = JSON.parse(localStorage.getItem("cart"));
        var index = cart.findIndex(elem => elem.Id === parseInt(btnId));
        if(index !== -1){
            cart.splice(index, 1);
            localStorage.setItem("cart",JSON.stringify(cart));
        }
    }
}

function minusQty(id){
    var btnId = id.substr(8,id.length);
    var qty = $("#qty",`#food${btnId}`).html();
    if(qty > 1) $("#qty",`#food${btnId}`).html(--qty);
}

function addQty(id){
    var btnId = id.substr(6,id.length);
    var qty = $("#qty",`#food${btnId}`).html();
    $("#qty",`#food${btnId}`).html(++qty);
}


function fetchFood(data){
    $("#food-container").html("");

    for(i=0; i<data.length; i++){
        foods.push(new Food(
            data[i].Id, data[i].Title, data[i].Description, 
            data[i].Price, data[i].Image, data[i].Ratings,
            data[i]["In-Stock"]), 1);
        
        $("#food-container").append(
        '<div id="food'+data[i].Id+'" class ="food-item">' + 
        '   <div class="in-cart" id="in-cart"></div>' +
        '   <h4 id="title'+data[i].Id+'" class="title">'+data[i].Title+'</h4>' + 
        '   <img class="food-img" src="'+data[i].Image+'">' +
        '   <div class ="star-container">' + 
        '       <img src ="/img/stars.png">' + 
        '       <div class ="starbar" style="width: calc(20% * '+data[i].Ratings+')"></div>' + 
        '   </div>' + 
        '   <div class="title">$'+data[i].Price+'</div>' + 
        '   <div id="description" class="hidden-description">' + 
        '       <div class="card-header"><button class="btn-add" onclick="addToCart(this.id)" id="addBtn'+data[i].Id+'">Add To Cart</button>' + 
        '       <button class="btn-remove" onclick="removeFromCart(this.id)" id="removeBtn'+data[i].Id+'">Remove From Cart</button>' +
        '       <div class="qty-btns">' +
        '           <button id="minusQty'+data[i].Id+'" onclick="minusQty(this.id)">-</button><span id="qty">1</span>' +
        '           <button id="addQty'+data[i].Id+'" onclick="addQty(this.id)">+</button></div></div>' + 
        '       <p>'+data[i].Description+'</p>' + 
        '   </div>' + 
        '</div>');
        
        if(!(data[i]["In-Stock"] === true)){
            $(`#addBtn${data[i].Id}`).html("Out Of Stock")
            .css("backgroundColor","darkred")
            .css("width","150px")
            .attr("onclick", "").unbind("click");
            $(".qty-btns",`#food${data[i].Id}`).hide();
        }

        $(".btn-remove",`#food${data[i].Id}`).hide();

        $(`#food${data[i].Id}`).on({
            mouseenter: function () {
                $("h4",this).css("opacity","0");
            },
            mouseleave: function () {
                $("h4",this).css("opacity","1");
            }
        });
    }
    if("cart" in localStorage){
        var cart = JSON.parse(localStorage.getItem("cart"));
        for(i=0; i<cart.length;i++){
            id = parseInt(cart[i].Id);
            $(".btn-add",`#food${id}`).hide();
            $(".btn-remove",`#food${id}`).show();
            $(".qty-btns",`#food${id}`).hide();
            $("#in-cart",`#food${id}`).html(cart[i].Qty)
            .css("opacity","1"); 
        } 
    }
}

$(function(){

    $.ajax({
        
        type: "GET",
        url: "/menu.json",
        dataType: "json",
        success: fetchFood,
        error: function(request, error) {
            alert("Unable to fetch data " + error);
        }
       
    });
});