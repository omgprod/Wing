const axios = require('axios');
const weight_max = 30;
const parcel_max = 15;
var num = 1;

module.exports = {
    parcelTreatment: (treat) => {
        let itemsList = treat.items;
        let ordersToCalcul = [];
        let orderToPack = [];
        if (treat && typeof treat !== 'undefined') {
            treat.orders.forEach(function (order) {
                let calculedWeight = treatment(order, itemsList);
                ordersToCalcul.push(calculedWeight);
                num++;
            });
            //console.log(ordersToCalcul);
            StackAndPack(ordersToCalcul);
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

    for (let i = 0; i < items.length; i++) {
        if (items[i] && typeof items[i].quantity !== 'undefined') {
            items.map(function (key) {
                //console.log('key: ' + JSON.stringify(key) + ' ' + JSON.stringify(val));
                let orderToParcel = DivideWeight(key, itemsList, id, order);
                arr.push(orderToParcel);
            });
            return arr;
        } else {
            throw new Error("Error: La quantités d'une commande n'est peut être pas définie. En savoir plus: " + items[i]);
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
                return parcel;
            }
        }
    } else {
        throw new Error('Error: Problèmes rencontrés avec un item. En savoir plus: ' + itemOrder);
    }
};


StackAndPack = (order) => {
    let lenght = order.length;
    let parcelNumber = 1;
    let paletteNumber = 1;
    let newItems = [{}];

    /* Premier Array = Commande, Second Array = Articles (divisé ou non)*/
    //console.log(JSON.stringify(order));
    //console.log(JSON.stringify(order[0][0][0]));
    //console.log(JSON.stringify(order[0][1][0]));
    //console.log(JSON.stringify(order[0][2][0]));
    //throw new Error("Calcul");


    console.log('Nombres de commandes: ' + lenght);
    for (let i = 0; i < lenght; i++) {
        let articleLenght = order[i].length;
        console.log("------------------------------------");
        console.log("Nombres d'articles: " + articleLenght);
        console.log("Commande numéro: " + JSON.stringify(order[i][0][0].order_num));
        for (let j = 0; j < articleLenght + 1; j++) {
            if (articleLenght > 1) {
                console.log("Commande : " + JSON.stringify(order[i][j][0]));
                /* Commande avec plus d'un article, additionner pour maximiser le poids (30) (faire un sort ? )*/
                let orderWeight = order[i][j][0].weight;
                let next = j + 1;
                let tryToAdd = order[i][next][0].weight;
                let memArticle = 0;
                if(j === 0 ){
                    console.log('first');
                }
                while (orderWeight < 30) {
                    if(j === articleLenght){ break; }
                    console.log(i, j);
                    //console.log(order[i][j][0]);
                    console.log(orderWeight);
                    let addWeight = orderWeight + tryToAdd;
                    console.log(next, addWeight, memArticle);
                    next += 1;
                    if (addWeight >= 30 || typeof tryToAdd === 'undefined') {
                        next -= 1;
                        let removeWeight = orderWeight - tryToAdd;
                        let parcelToPack = new Object({
                            order_id: order[i][j][0].order_id,
                            newItems,
                            weight: Number(removeWeight).toFixed(1),
                            tracking_id: null,
                            palette_number: paletteNumber,
                        });
                        parcelNumber++;
                        console.log(parcelToPack);
                        break
                    }else {
                        orderWeight = addWeight;
                        console.log("next" + order[i][next][0]);
                        if(typeof order[i][next][0] === 'undefined'){
                            break;
                        }else{
                            tryToAdd = order[i][next][0].weight;
                        }
                        console.log('poids qui vas être ajouté: ' + order[i][next][0].weight + ', le poids sera de = ' + orderWeight);
                    }
                }
            } else {
                console.log('un seul article dans la commande');
                console.log(order[i][j][0]);
                if (parcelNumber === 15) {
                    paletteNumber++;
                }
                axios.get('https://helloacm.com/api/random/?n=15')
                    .then(function (response) {
                        // handle success
                        console.log('response ' + response);
                        let parcelToPack = new Object({
                            order_id: order[i][j][0].order_id,
                            items: [{
                                item_id: order[i][j][0].item_id,
                                quantity: order[i][j][0].quantity,
                            }],
                            weight: order[i][j][0].weight,
                            tracking_id: null,
                            palette_number: paletteNumber,
                        });
                        parcelNumber++;
                        return parcelToPack;
                    })
                    .catch(function (error) {
                        // handle error
                        console.log(error);
                    })
                    .finally(function () {
                        // always executed
                    });
            }
        }
    }
};
