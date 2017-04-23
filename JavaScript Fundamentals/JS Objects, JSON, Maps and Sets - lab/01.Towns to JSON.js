function townsToJSON(input) {
    let regEx = /\s*\|+\s*/g;
    let outputTitles = input.shift().split(regEx).filter(t => t != '');
    let towns = [];
    for (let townData of input) {
        townData = townData.split(regEx).filter(t => t != '');
        let town = {};
        town[outputTitles[0]] = townData[0];
        town[outputTitles[1]] = Number(townData[1]);
        town[outputTitles[2]] = Number(townData[2]);
        towns.push(town);
    }
    return JSON.stringify(towns);
}