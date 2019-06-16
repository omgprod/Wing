var num = 1;
var palett_num = 1;
var orderToPack = [];

module.exports = {
    parcelTreatment: (treat) => {
        let itemsList = treat.items;

        /*********** Sort Orders by Date *************
        treat.orders.sort(function(a,b) {
            return new Date(b.date) - new Date(a.date);
        });
        /*********************************************/

        if (treat && typeof treat !== 'undefined') {
            treat.orders.forEach(function (order) {
                var treatOrders = treatment(order, itemsList);
                //console.log("----- New Order " + num + " ----");
                num++;
            });
            return orderToPack
        } else {
            throw new Error('Error: No Treatment Orders find.');
        }
    }
};

treatment = (order, itemsList) => {
    let id = order.id;
    let items = order.items;
    const parcel = [];

    for (let i = 0; i < items.length; i++) {
        if (items[i] && typeof items[i].quantity !== 'undefined') {
            var orderParcel = findWeigth(items[i], itemsList);
            if(orderParcel.divideTo != null){
                let divideItem = orderParcel.totalWeight - orderParcel.weight * orderParcel.divideTo;
                let itemDivided =  divideItem.toFixed(1);
                let quantity = orderParcel.quantity;
                //console.log(orderParcel.totalWeight, Number(orderParcel.weight));
                //console.log( divideItem.toFixed(1));
                for(let i = 0;i < orderParcel.divideTo + 1; i++){
                    if(Number(orderParcel.weight) == itemDivided){
                        quantity = 1;
                    }
                    let parcelToStack = new Object({
                        "parcel": {
                            order_id: id,
                            items: [{
                                item_id: orderParcel.id,
                                quantity: quantity,
                            }],
                            unitWeight: orderParcel.weight,
                            weight: itemDivided,
                        }
                    });
                    parcel.push(parcelToStack);
                }
            } else {
                let parcelToStack = new Object({
                    "parcel": {
                        order_id: id,
                        items: [{
                            item_id: orderParcel.id,
                            quantity: orderParcel.quantity,
                        }],
                        unitWeight: orderParcel.weight,
                        weight: orderParcel.totalWeight,
                    }
                });
                parcel.push(parcelToStack);
            }

        }
    }
    var parcelStack = stackParcel(parcel);

};

stackParcel = (parcel) => {
    let detailledPackage = [];
    function logArrayElements(element, index) {
        //console.log("[" + index + "] = Weight: " + element.parcel.weight + ", Quantity: " + element.parcel.items[0].quantity + ", UnitWeight: " + element.parcel.unitWeight + ", itemId: " + element.parcel.items[0].item_id + ", orderId: " + element.parcel.order_id);
        detailledPackage = {
            index: index,
            orderNumber: num,
            orderId: element.parcel.order_id,
            weight: Number(element.parcel.weight),
            quantity: element.parcel.items[0].quantity,
            unitWeight: Number(element.parcel.unitWeight),
            itemId: element.parcel.items[0].item_id,
        };
        //console.log(detailledPackage);
        orderToPack.push(detailledPackage);
        //console.log(orderToPack);
    }
    parcel.forEach(logArrayElements);
    for(let i =  0; i < detailledPackage.length; i++){
        console.log(i);
    }


    return detailledPackage;

    let parcelToPack = new Object({
        "parcel": {
            order_id: null,
            items: [{
                item_id: null,
                quantity: null,
            }],
            unitWeight: null,
            weight: null,
            tracking_id: null,
            palette_number: null,
        }
    });
    //throw new Error("Pikachu is dead");
};

findWeigth = (itemOrder, itemsList) => {
    if(itemOrder && typeof itemOrder !== 'undefined' || itemOrder != null){
        for (let i = 0; i < itemsList.length; i++) {
            if(itemsList[i].id === itemOrder.item_id){
                let itemWeight = itemsList[i].weight;
                let quantity = itemOrder.quantity;
                let total = itemWeight * quantity;
                let divide = null;
                if(total > 30){
                    for(let i = 0; i < 100; i++){
                        var parcelToCreate = total - itemWeight * i;
                        if(parcelToCreate < 30){
                            divide = i;
                            break;
                        }
                    }
                }
                let calcul = new Object({
                    id: itemOrder.item_id,
                    quantity: itemOrder.quantity,
                    weight: itemsList[i].weight,
                    totalWeight: total.toFixed(1),
                    divideTo: divide,
                });
                return calcul;
            }
        }
    }
};
