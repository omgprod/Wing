module.exports = {
    parcelTreatment: (treat) => {
        let itemsList = treat.items;
        if (treat && typeof treat !== 'undefined') {
            treat.orders.forEach(function (order) {
                treatment(order, itemsList);
            });
        }
    }
};

/* Création du colis */
treatment = (order, itemsList) => {
    let id = order.id;
    let date = order.date;
    let items = order.items;
    let weigthParcel = [];
    const parcel = [];

    for (let i = 0; i < items.length; i++) {
        if (items[i] && typeof items[i].quantity !== 'undefined') {
            var orderParcel = findWeigth(items[i], itemsList);
            if(orderParcel.divideTo != null){
                console.log(orderParcel.totalWeight, orderParcel.unitWeight);
                let divideParcel = orderParcel.totalWeight - orderParcel.weight * orderParcel.divideTo;
                console.log(divideParcel);
                for(let i = 0;i < orderParcel.divideTo; i++){
                    weigthParcel.push(divideParcel);
                    let parcelToPack = new Object({
                        "parcel": {
                            order_id: id,
                            items: [{
                                item_id: orderParcel.id,
                                quantity: orderParcel.quantity,
                            }],
                            unitWeight: orderParcel.weight,
                            weight: divideParcel,
                            tracking_id: null,
                            palette_number: null,
                        }
                    });
                    parcel.push(parcelToPack);
                }
            } else {
                let parcelToPack = new Object({
                    "parcel": {
                        order_id: id,
                        items: [{
                            item_id: orderParcel.id,
                            quantity: orderParcel.quantity,
                        }],
                        unitWeight: orderParcel.weight,
                        weight: orderParcel.totalWeight,
                        tracking_id: null,
                        palette_number: null,
                    }
                });
                parcel.push(parcelToPack);
            }
        }
    }
    var parcelStack = stackParcel(parcel);

};

/* Trouve le poids et indique la division a suivre return un Object */
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
                    totalWeight: total,
                    divideTo: divide,
                });
                return calcul;
            }
        }
    }
};

/* Function: get parcel object and concat to each other */
/* try to reech the good weight (30) */
stackParcel = (parcel) => {
    function logArrayElements(element, index) {
        //console.log(parcel.items[0]);
        console.log("[" + index + "] = poids: " + element.parcel.weight + ", quantity: " + element.parcel.items[0].quantity + ", UnitWeight: " + element.parcel.unitWeight);
    }
    parcel.forEach(logArrayElements);

    throw new Error("my error message");
};
