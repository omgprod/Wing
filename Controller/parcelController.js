var num = 1;
var orderToPack = [];
const weight_max = 30;
//const parcel_max = 15;
//var parcel_weight = 0;
//var parcel_number = 1;
//var parcel = [];

module.exports = {
    parcelTreatment: (treat) => {
        let itemsList = treat.items;
        let ordersToCalcul = [];
        if (treat && typeof treat !== 'undefined') {
            treat.orders.forEach(function (order) {
                let orderToPack = treatment(order, itemsList);
                ordersToCalcul.push(orderToPack);
                num++;
            });
            AddStack(ordersToCalcul);
            return orderToPack
        } else {
            //throw new Error("Pikachu is not dead yet");
            throw new Error('Error: Pas de commandes a traiter. En savoir plus: ' + treat);
        }
    }
};

treatment = (order, itemsList) => {
    let id = order.id;
    let items = order.items;
    let arr = [];
    console.log(items);

    for (let i = 0; i < items.length; i++) {
        if (items[i] && typeof items[i].quantity !== 'undefined') {
            items.map(function (key, val) {
                console.log('key: ' + JSON.stringify(key) + ' ' + JSON.stringify(val));
                let orderParcel = findWeigth(key, itemsList, id);
                arr.push(orderParcel);
            });
            return arr;
           //throw new Error("");
        } else {
            throw new Error("Error: La quantités d'une commande n'est peut être pas définie. En savoir plus: " + items[i]);
        }
    }
};

/*
* Fonction qui récupère le poids de l'objet unitaire, le poid total, divise
* la quantités d'objet si le poid excède 30kg
 */
findWeigth = (itemOrder, itemsList, id) => {
    console.log(itemOrder);
    let parcel = [];
    if (itemOrder && typeof itemOrder !== 'undefined' || itemOrder != null) {
        for (let i = 0; i < itemsList.length; i++) {
            if (itemsList[i].id === itemOrder.item_id) {

                /* Initialisation des vars */
                let itemId = itemOrder.item_id;
                let itemWeight = itemsList[i].weight;
                let quantity = itemOrder.quantity;
                let calcul = itemWeight * quantity;
                let total = Number(calcul.toFixed(1));
                let divide = null;

                /* Indique la division les stacks trop lourds */
                /* Divise le stack si il doit être diviser */
                /* Retourn un nouvelle objet avec l'id item et son poid + plus poids total selon quantités */

                if (total > weight_max) {
                    if (quantity === 2) {
                        let divideBy = total - itemWeight;
                        let newWeight = Number(divideBy.toFixed(1));
                        quantity = 1;
                        divide = 2;
                        for (let i = 0; i < divide; i++) {
                            let parcelToStack = new Object({
                                order_num: num,
                                order_id: id,
                                item_id: itemId,
                                items: [{
                                    item_id: itemId,
                                    quantity: quantity,
                                }],
                                quantity: Number(quantity),
                                unitWeight: Number(itemWeight),
                                weight: Number(newWeight),
                            });
                            parcel.push(parcelToStack);
                        }
                    } else {
                        let actualQuantity = quantity;
                        for (let i = 0; i < 100; i++) {
                            let divideBy = total - itemWeight * i;
                            var newWeight = Number(divideBy.toFixed(1));
                            quantity--;
                            if (divideBy < weight_max) {
                                divide = i;
                                if (quantity === 0 && actualQuantity > 1) {
                                    quantity = 1;
                                }
                                break;
                            }
                        }
                        for (let i = 0; i < divide + 1; i++) {
                            let parcelToStack = new Object({
                                order_num: num,
                                order_id: id,
                                item_id: itemId,
                                items: [{
                                    item_id: itemId,
                                    quantity: quantity,
                                }],
                                quantity: Number(quantity),
                                unitWeight: Number(itemWeight),
                                weight: Number(newWeight),
                            });
                            parcel.push(parcelToStack);
                        }
                    }
                } else {
                    let weight = Number(itemWeight) * quantity;
                    let rounded = weight.toFixed(1);
                    let parcelToStack = new Object({
                        order_num: num,
                        order_id: id,
                        item_id: itemId,
                        items: [{
                            item_id: itemId,
                            quantity: quantity,
                        }],
                        quantity: Number(quantity),
                        unitWeight: Number(itemWeight),
                        weight: Number(rounded),
                    });
                    parcel.push(parcelToStack);
                }
                //console.log(parcel);
                //console.log('total: ' + total);
                //console.log('itemWeight: ' + itemWeight);
                //console.log('quantity: ' + quantity);
                //console.log('divide: ' + divide);
                return parcel;
            }
        }
    } else {
        throw new Error('Error: Problèmes rencontrés avec un item. En savoir plus: ' + itemOrder);
    }
};


AddStack = (order) => {
    let max = 30;
    let lenght = order.length;
    //console.log(lenght);
    //console.log(JSON.stringify(order));
    //throw new Error("Calcul");

    for (let i = 0; i < lenght; i++) {
        //console.log(order[1]);
        order[i].map(function (value, key) {
            //console.log('key: ' + JSON.stringify(key) + ' ' + JSON.stringify(value[0].weight) + JSON.stringify(value));
            console.log(JSON.stringify('val: '+ value));
            value.forEach(function (element, key) {
                console.log(key, element);
            });
            if (order[i] === order[1]) {
                throw new Error("Calcul");
            }
        });
    }

    let parcelToPack = new Object({
        order_id: null,
        items: [{
            item_id: null,
            quantity: null,
        }],
        unitWeight: null,
        weight: null,
        tracking_id: null,
        palette_number: null,
    });
};
