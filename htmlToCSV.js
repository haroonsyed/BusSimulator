//Exports Html Data as .csv
//Pass the id of the table as is, not as a string.
function dataToCSV(id){
  document.getElementById("tableToCSV").style.backgroundColor = "rgb(216, 216, 216)";
  //Make csv data. Each array index is a comma separated line.
  let csvData = [];

  for(i=0; i<id.rows.length; i++){
    let rowData = "";
    for(j=0; j<id.rows.item(i).cells.length; j++){
      rowData += id.rows.item(i).cells.item(j).innerHTML + ",";
    }
    //Removes final comma
    rowData = rowData.slice(0,-1);
    csvData.push(rowData);
  }

  //Comma deliniates csvData into a file
  let csvFile = new Blob([csvData.join("\n")], {type:"text/csv"});

  //Make and click download link
  let downloadLink = document.createElement("a");
  downloadLink.download = "BusSystemData.csv";
  downloadLink.href = window.URL.createObjectURL(csvFile);
  downloadLink.click();

}

//Test function. Possible uses.
function printTable(data){
for(i=0; i<data.rows.length; i++){
  let rowData = "";
  for(j=0; j<data.rows.item(i).cells.length; j++){
    rowData += data.rows.item(i).cells.item(j).innerHTML + " ";
  }
  rowData = rowData.slice(0,-1);
  console.log(rowData);
}
}

//Insert all elements in final row. Expects array for data.
function appendTableData(id, data){

let newRow = id.insertRow();
//Check column doesn't contain the data
for(let i=0; i<id.rows.item(0).cells.length; i++){
  let cell = newRow.insertCell();
  if(i < data.length){
    cell.innerHTML = data[i];
  }
}

}

//Adds column header as well. Header is string.
function addCol(id, header){

//Add new cell to every row, with 0 having a header name
for(let i=0; i<id.rows.length; i++){
  let cell = id.rows.item(i).insertCell();
  if(i==0){
    cell.innerHTML = header;
  }
}

}

function editCell(id, row, col, data){

id.rows.item(row).cells.item(col).innerHTML = data;

}

window.onload = function(){

//Wait until page loads to do anything with this code. Table may not have been initialized yet.

}
