function populationInTowns(input){
    let output = new Map();

    for(let data of input){
        let [town, population] = data.split(/\s*<->\s*/);
        population = Number(population);

        if(output.has(town)){
            output.set(town, output.get(town) + population);
        } else {
            output.set(town, population);
        }
    }
    for(key of output.keys()){
        console.log(key + " : " + output.get(key));
    }
}

populationInTowns(['B<->20', 'A<->30', 'B<->5']);