const axios = require('axios');
const weight_max = 30;
const parcel_max = 15;
var num = 1;
var nbParcel = 0;
var nbPalette = 1;
var palette = [];

module.exports = {
    parcelTreatment: (treat) => {
        palette = [];
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
    let newItems = [{}];
    let url = "https://helloacm.com/api/random/?n=15";
    order.forEach(function (element) {
        let nbArticle = element.length;
        /* Si un seul article dans la commande, on fait directement le colis */
        /* TODO */
        /*FINISH HIM!*/
        if (nbArticle === 1) {
            console.log('un seul article dans la commande');
            let packed = getTrackId(url, element);
            if (packed) {
                console.log(packed);
                console.log('colis packed');
            }
        }
        /* Si plusieurs Articles dans la commandes, on additionne pour remplir le maximum du poids autorisé (30 Kilos)*/
        /* TODO */
        if (nbArticle > 1) {
            console.log(nbArticle + ' articles sont dans la commande');
            element.forEach(function (value, key) {
                console.log(key + value);

            });
            let parcelToPack = new Object({
                order_id: null,
                newItems,
                weight: null,
                tracking_id: null,
                palette_number: nbPalette,
            });
        }
    });
    return palette;
};

/* TODO */
/*FINISH HIM!*/
MakeParcel = (order, track_id) => {
    let weight = order[0][0].weight;
    if(nbParcel === parcel_max){
        nbPalette++;
        nbParcel = 0;
        //console.log("nombre de colis = " + nbParcel + ', la nouvelle pallette est la numéro ' + nbPalette);
    }
    if (weight <= 30) {
        let parcel = new Object({
            order_id: order[0][0].order_id,
            items: [{
                item_id: order[0][0].item_id,
                quantity: order[0][0].quantity,
            }],
            weight: order[0][0].weight,
            tracking_id: track_id,
            palette_number: nbPalette,
        });
        nbParcel++;
        palette.push(parcel);
        Remuneration(parcel.weight);
        console.log(palette);
        console.log(parcel);
        console.log('**********');
        return parcel;
    } else {
        throw new Error("Pikachu is not dead yet");
    }
};

/* TODO */
/*FINISH HIM!*/
Remuneration = (poids) => {
    console.log(poids);
};
