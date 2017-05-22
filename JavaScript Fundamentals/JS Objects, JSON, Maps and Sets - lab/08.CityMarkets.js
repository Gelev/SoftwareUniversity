function sales(input){
    let townsWithProducts = new Map();
    for (let i of input){
        let [town, product, data] = i.split(/\s*->\s*/);
        let [amount, singlePrice] = data.split(/\s*:\s*/);   
        
        //console.log(town);console.log(product);console.log(amount);console.log(singlePrice);

        if(!townsWithProducts.has(town)){
            townsWithProducts.set(town, new Map());
        }
            let income = amount * singlePrice;
            let oldIcome = townsWithProducts.get(town).get(product);
            if (oldIcome) {
                townsWithProducts.get(town).set(product, oldIcome += income);
            } else {
                townsWithProducts.get(town).set(product, income);
            }
        }
    for (let t of townsWithProducts.keys()){
        console.log('Town - '+t);
        for (let p of (townsWithProducts.get(t)).keys()){
            console.log("$$$"+ p + " : " + townsWithProducts.get(t).get(p));
        }
    }
}

sales(['Sofia -> Laptops HP -> 200 : 2000', 'Sofia -> Raspberry -> 10 : 1500', 'Montana -> Oranges -> 200000 : 1']);