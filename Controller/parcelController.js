module.exports = {
    parcelTreatment: (treat) => {
        let itemsList = treat.items;
        if (treat && typeof treat !== 'undefined') {
            treat.orders.forEach(function (order) {
                doParcel(order, itemsList);
            });
        }
    }
};

/* Création du colis */
doParcel = (order, itemsList) => {
    let id = order.id;
    let date = order.date;
    let items = order.items;

    for (let i = 0; i < items.length; i++) {
        if (items[i] && typeof items[i].quantity !== 'undefined') {
            let weight = findWeigth(items[i], itemsList);
            console.log(weight);
        }
    }

    let parcel = new Object({
        order_id: id,
        items: [{

        }],
    });
};

/* Trouve le poids et le calcule par la quantité voulu */
findWeigth = (itemOrder, itemsList) => {
    if(itemOrder && typeof itemOrder !== 'undefined' || itemOrder != null){
        for (let i = 0; i < itemsList.length; i++) {
            if(itemsList[i].id === itemOrder.item_id){
                let total = itemsList[i].weight * itemOrder.quantity;
                let calcul = new Object({
                    id: itemOrder.item_id,
                    quantity: itemOrder.quantity,
                    weight: itemsList[i].weight,
                    totalWeight: total
                });
                return calcul;
            }
        }
    }
};