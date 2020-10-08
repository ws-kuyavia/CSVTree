var fs = require('fs');
var csvData;

setData = (arr) => {
    csvData = arr;
}

//sbsti
findNestingDepth = (row) => {
    return row.findIndex(element => element !== '');

}
stripEmptyElementsFromRow = (row) => {
    return row.filter(element => element !== '');
}

findParent = (layer, id, arr) => {
    let parent = 0;
    let idx = 0;
    let searchArr = arr.slice();

    if (layer > 0) {
        searchArr.sort((a, b) => b.id - a.id);
        idx = searchArr.findIndex(element => element.layer === layer - 1);
        parent = searchArr[idx] ? searchArr[idx].id : id - 1;
    }
    return parent;
}

parseCSVBlackBox = (data) => {

    let dataArray = data.toString().split(/\r?\n/);
    const labels = dataArray[0].split(';');
    const columnCount = labels.length;
    dataArray.shift();

    let id = 1;
    let arr = [];

    while (dataArray.length > 0) {
        let row = dataArray[0].split(';');
        let nesting = findNestingDepth(row);
        let parent = 0;
        row = stripEmptyElementsFromRow(row);

        for (let i = 0; i < row.length; i++) {
            parent = nesting > 0 ? findParent((i + nesting), id, arr) : id - 1;
            parent = i + nesting === 0 ? 0 : parent;
            arr.push({id: id, parent: parent, value: row[i], layer: i + nesting, children: []});
            id++;
        }

        dataArray.shift();
    }

    for (let i = arr.length - 1; i > 0; i--) {
        if (arr[i].parent > 0) {
            arr[arr[i].parent - 1].children.unshift(arr[i]);
            arr.splice(i, 1);
        }
    }

    return arr;
}


module.exports = {
    csvData: {},
    getData: (file = null) => {

        let data = fs.readFileSync(file);
        return parseCSVBlackBox(data);
    },
    getDataAsync: (file = null, nf) => {
        let nodes;
        cb = (err, data) => {
            if (err) throw err;
            nodes = parseCSVBlackBox(data);
            nf(nodes);
        }
        fs.readFile(file, cb);

    }
}
