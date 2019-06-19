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

const weight_max = 30;
const parcel_max = 15;
var parcel_weight = 0;
var parcel_number = 1;
var parcel = [];
var num = 1;
var orderToPack = [];

treatment = (order, itemsList) => {
    let id = order.id;
    let items = order.items;

    for (let i = 0; i < items.length; i++) {
        if (items[i] && typeof items[i].quantity !== 'undefined') {
            var orderParcel = findWeigth(items[i], itemsList, id);
        } else {
            throw new Error("Error: La quantités d'une commande n'est peut être pas définie. En savoir plus: " + items[i]);
        }
    }
    return orderParcel;

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

/*
* Fonction qui récupère le poids de l'objet unitaire, le poid total, divise
* la quantités d'objet si le poid excède 30kg
 */
findWeigth = (itemOrder, itemsList, id) => {
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
                if (total > 30) {
                    if (quantity === 2) {
                        let divideBy = total - itemWeight;
                        let newWeight = Number(divideBy.toFixed(1));
                        quantity = 1;
                        divide = 2;
                    } else {
                        let actualQuantity = quantity;
                        let mem = 0;
                        for (let i = 0; i < 100; i++) {
                            let divideBy = total - itemWeight * i;
                            let newWeight = Number(divideBy.toFixed(1));
                            quantity--;
                            if (divideBy < 30) {
                                divide = i;
                                if(quantity === 0 && actualQuantity > 1){
                                    quantity = 1;
                                }
                                break;
                            }
                        }
                        //console.log('total: ' + total);
                        //console.log('itemWeight: ' + itemWeight);
                        //console.log('mem: ' + mem);
                        //console.log('quantity: ' + quantity);
                        //console.log('divide: ' + divide);
                    }
                }
                /* Divise le stack si il doit être diviser */
                /* Retourn un nouvelle objet avec l'id item et son poid + plus poids total selon quantités */
                if (divide != null) {
                    let divideItem = total - itemWeight * divide;
                    let itemDivided = Number(divideItem.toFixed(1));
                    console.log(divide, itemDivided, Number(itemWeight));
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
                            weight: Number(itemDivided),
                        });
                        parcel.push(parcelToStack);
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
                console.log(parcel);
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
    let num = 0;
    let remember = "";
    console.log(lenght);

    for (let i = 0; i < lenght; i++) {
        order[i].map(function (key, value) {

            //console.log(key, value);
        });
        if (order[i] === order[2]) {
            throw new Error("Calcul");
        }
    }
};

AddParcelToPalette = (parcel) => {

};
