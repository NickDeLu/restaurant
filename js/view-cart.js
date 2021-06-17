function removeFromCart(id){
    $(`#row${id}`).hide();
    $("#totals").html("");
    if("cart" in localStorage){
        let cart = JSON.parse(localStorage.getItem("cart"));
        var index = cart.findIndex(elem => elem.Id === parseInt(id));
        if(index !== -1){
            cart.splice(index, 1);
            localStorage.setItem("cart",JSON.stringify(cart));
        }
        updateTotals(cart);
    }
    if (JSON.parse(localStorage.getItem("cart")).length === 0) {
        $("#message").show();
        $("#totals").hide();
    }
}

function saveQty(id,qty){
    if("cart" in localStorage){
        let cart = JSON.parse(localStorage.getItem("cart"));
        var index = cart.findIndex(elem => elem.Id === parseInt(id));
        if(index !== -1){
            cart[index].Qty = qty; 
            localStorage.setItem("cart",JSON.stringify(cart));
        }
    }
}

function minusQty(id){
    var btnId = id.substr(8,id.length);
    var qty = $("#qty",`#row${btnId}`).html();
    if(qty > 1) $("#qty",`#row${btnId}`).html(--qty);
    saveQty(btnId,qty);
    var cart = JSON.parse(localStorage.getItem("cart"));
    $("#totals").html("");
    updateTotals(cart);
}

function addQty(id){
    var btnId = id.substr(6,id.length);
    var qty = $("#qty",`#row${btnId}`).html();
    $("#qty",`#row${btnId}`).html(++qty);
    saveQty(btnId,qty);
    var cart = JSON.parse(localStorage.getItem("cart"));
    $("#totals").html("");
    updateTotals(cart);
}
function updateTotals(cart){
    var subtotal = 0,discount = 0, total = 0;
    for(i=0;i<cart.length;i++){
        $("#totals").append(
            '<tr><td>'+cart[i].Title+' x'+cart[i].Qty+'</td>' + 
            '<td>$'+(cart[i].Price * cart[i].Qty)+'</td></tr>'
        );
        subtotal += parseInt((cart[i].Price) * (cart[i].Qty));
    }
   
    if(subtotal>=100)
        discount = 0.30;
    else if (subtotal>=70 && subtotal <=99)
        discount = 0.20;
    else if (subtotal>=30 && subtotal <=69)
        discount = 0.10;
    else
        discount = 0;
    
    $("#totals").append('<tr><td colspan="2"><hr></td></tr>'+'<tr><td>Subtotal:</td>'+'<td>$'+subtotal+'</td></tr>' );

    if(discount > 0){
        $("#totals").append(
            '<tr><td>Discount:</td>' +
            '<td>- '+discount*100+'%</td></tr>'
        );
    }
    total = subtotal-(subtotal * discount);
    hst = (total*0.13);
    total = total-hst;
    $("#totals").append(
        '<tr><td>HST 13%</td>'+
        '<td>- $'+hst.toFixed(2)+'</td></tr>'+
        '<tr><td>Total:</td>' +
        '<td>$'+total.toFixed(2)+'</td></tr>' 
    );
    
}
$(function(){
    if("cart" in localStorage){
        var cart = JSON.parse(localStorage.getItem("cart"));
        for(i=0;i<cart.length;i++){
            $("#item-container").append(
                '<table class="cart-item" id="row'+cart[i].Id+'">'+
                '   <tr>'+
                '       <td colspan="3"><h4 class="title">'+cart[i].Title+'</h4></td>' +
                '   </tr>'+
                '   <tr>'+
                '       <td><img class="tb-img" src="'+cart[i].Img+'"</img></td>'+
                '       <td><div class="qty-btns">' +
                '           <button id="minusQty'+cart[i].Id+'" onclick="minusQty(this.id)">-</button>'+
                '           <span id="qty">'+cart[i].Qty+'</span>' +
                '           <button id="addQty'+cart[i].Id+'" onclick="addQty(this.id)">+</button>' +
                '       </div></td>' +
                '       <td><h4 class="title price">$'+cart[i].Price+'</h4>'+'</td>' + 
                '   </tr>' + 
                '   <tr>'+
                '       <td><button class="delete" onclick="removeFromCart('+cart[i].Id+')">'+
                '           <i class="fa fa-trash-o"></i>'+
                '       </button></td>'+
                '   </tr>'+
                ' </table>'
            );
        }
        updateTotals(cart);
    }
    if (JSON.parse(localStorage.getItem("cart")).length === 0) {
        $("#message").show();
        $("#totals").hide();
    }else{
        $("#message").hide();
        $("#totals").show();
    }
});