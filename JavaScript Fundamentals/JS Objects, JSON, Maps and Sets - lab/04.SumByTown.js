function sumByTown(data){
    let sums = {};
    for(let i = 0; i < data.length; i +=2){
        let town = data[i];
        let income = Number(data[i + 1]);

        if(!sums[town]){
            sums[town] = 0;
        }
        sums[town] += income;
    }
     return JSON.stringify(sums);
}