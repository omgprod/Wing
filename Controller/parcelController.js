const axios = require('axios');
const weight_max = 30;
const parcel_max = 15;
var num = 1;
var nbParcel = 0;
var nbPalette = 1;
var palette = [];

module.exports = {
    parcelTreatment: (treat) => {
        let itemsList = treat.items;
        let orders = treat.orders;
        let ordersToPack = [];
        if (treat && typeof treat !== 'undefined') {
            orders.forEach(function (order) {
                let calculedWeight = treatment(order, itemsList);
                ordersToPack.push(calculedWeight);
                num++;
            });
            let packed = StackAndPack(ordersToPack);
            console.log(packed);
            return packed;
        } else {
            throw new Error('Error: Pas de commandes a traiter. En savoir plus: ' + treat);
        }
    }
};

treatment = (order, itemsList) => {
    let id = order.id;
    let items = order.items;
    let arr = [];
    for (let i = 0; i < items.length; i++) {
        if (items[i] && typeof items[i].quantity !== 'undefined') {
            items.map(function (key) {
                let orderToParcel = DivideWeight(key, itemsList, id, order);
                arr.push(orderToParcel);
            });
            return arr;
        } else {
            throw new Error("Error: La quantité d'une commande n'est peut être pas définie. En savoir plus: " + items[i]);
        }
    }
};

/*
* Fonction qui récupère le poids de l'objet unitaire, le poid total, divise
* la quantités d'objet si le poid excède 30kg
*/
DivideWeight = (itemOrder, itemsList, id) => {
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

                /* Indique la division des stacks trop lourds */
                /* Divise le stack si il doit être divisé */
                /* Retourne un nouvelle objet avec la liason order_id, item_id, item_weight, item_quantity */

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
                return parcel;
            }
        }
    } else {
        throw new Error('Error: Problèmes rencontrés avec un item. En savoir plus: ' + itemOrder);
    }
};

/*   */
const getTrackId = async (url, order) => {
    try {
        const response = await axios.get(url);
        const data = response.data;
        if (data) {
            return MakeParcel(order, data);
        }
    } catch (error) {
        console.log(error);
    }
};

StackAndPack = (order) => {
    let url = "https://helloacm.com/api/random/?n=15";
    order.forEach(function (element, key) {
        let nbArticle = element.length;
        /* Si un seul article dans la commande, on fait directement le colis */
        /* TODO */
        /*FINISH HIM!*/
        if (nbArticle === 1) {
            //console.log('un seul article dans la commande');
            let packed = getTrackId(url, element);
            if (packed) {
                //console.log(packed);
            }
        }
        /* Si plusieurs Articles dans la commandes, on additionne pour remplir le maximum du poids autorisé (30 Kilos)*/
        /* TODO */
        if (nbArticle > 1) {
            //console.log(nbArticle + ' articles sont dans la commande');
            let articleWeight = [];
            element.forEach(function (value) {
                let weight = {
                    weight: JSON.stringify(value[0].weight),
                    item_id: JSON.stringify(value[0].item_id),
                    quantity: JSON.stringify(value[0].quantity),
                    order_id: JSON.stringify(value[0].order_id),
                };
                articleWeight.push(weight);
            });
            let sorted = articleWeight.sort((a, b) => a.weight - b.weight);
            sorted.reverse();
            //console.log(sorted);
            for (let i = 0; i < nbArticle; i++) {
                if (typeof sorted[i + 1] == 'undefined') {
                    break;
                }
                let addBigger = Number(sorted[i].weight) + Number(sorted[i + 1].weight);
                if (addBigger.toFixed(1) <= 30) {
                    sorted[i].weight = Number(addBigger.toFixed(1));
                    let item1 = sorted[i].item_id;
                    let item2 = sorted[i + 1].item_id;
                    sorted[i].item_id = {
                        item_id: {
                            item1,
                            item2
                        },
                    };
                    let quantity1 = sorted[i].quantity;
                    let quantity2 = sorted[i + 1].quantity;
                    sorted[i].quantity = {
                        quantity: {
                            quantity1,
                            quantity2
                        },
                    };
                    sorted.splice(i + 1, 1);
                } else {
                    if (typeof sorted[i + 2] == 'undefined') {
                        break;
                    }
                    let tryAddNext = Number(sorted[i].weight) + Number(sorted[i + 2].weight);
                    //console.log(tryAddNext.toFixed(1));
                    if (tryAddNext.toFixed(1) <= 30) {
                        sorted[i].weight = Number(tryAddNext.toFixed(1));
                        let item1 = sorted[i].item_id;
                        let item2 = sorted[i + 2].item_id;
                        sorted[i].item_id = {
                            item_id: {
                                item1,
                                item2
                            },
                        };
                        let quantity1 = sorted[i].quantity;
                        let quantity2 = sorted[i + 2].quantity;
                        sorted[i].quantity = {
                            quantity: {
                                quantity1,
                                quantity2
                            },
                        };
                        sorted.splice(i + 2, 1);
                    } else {

                    }
                }
            }
            console.log(sorted);
            sorted.forEach(function (value) {
                console.log(value);
                getTrackId(url, value);
            });
            //console.log(sorted);
            throw new Error("Pikachu is not dead yet");
        }
    });
    return palette;
};

/* TODO */
MakeParcel = (order, track_id) => {
    let weight = order[0][0].weight;
    if (nbParcel === parcel_max) {
        nbPalette++;
        nbParcel = 0;
        console.log("nombre de colis = " + nbParcel + ', la nouvelle pallette est la numéro ' + nbPalette);
    }
    if (weight <= 30) {
        let orderId = null;
        let items = [{
            item_id: null,
            quantity: null
        }];
        let weight = null;
        (typeof order[0][0].order_id == 'undefined') ? order.order_id = orderId : order[0][0].order_id = orderId;
        (typeof order[0][0].item_id == 'undefined') ? order.item_id.item_id = items['item_id'] : order[0][0].item_id = items['item_id'];
        (typeof order[0][0].quantity == 'undefined') ? order.quantity.quantity = items['quantity'] : order[0][0].quantity = items['quantity'];
        (typeof order[0][0].weight == 'undefined') ? order.weight = weight : order[0][0].weight = weight;

        let parcel = new Object({
            order_id: orderId,
            items,
            weight: weight,
            tracking_id: track_id,
            palette_number: nbPalette,
        });
        nbParcel++;
        Remuneration(parcel.weight);
        palette.push(parcel);
        console.log(palette);
        console.log(parcel);
        console.log('**********');
        return palette;
    } else {
        throw new Error("Pikachu is not dead yet");
    }
};

/* TODO */
Remuneration = (poids) => {
    //console.log(poids);
};
