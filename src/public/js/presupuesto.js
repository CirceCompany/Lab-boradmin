

let seeExpense = document.querySelectorAll("tbody")
let showExpenses = document.querySelectorAll(".showExpenses")
let dataset, body

showExpenses.forEach(expenses => {
    id = expenses.id
    console.log(id)
    seeExpense.forEach(see =>{
        if(see.id == `table-${id}`){
            console.log(see, see.id)
            body = see
        }
    })
    console.log(body)
    show(id, body)
});

async function show(id, see){
    dataset = await start(id)
    dataset.forEach(data =>{
        let tr = document.createElement('tr')
        tr.innerHTML = `
            <td> ${data.id}</td>
            <td> ${data.monto}</td>
            <td> ${data.fecha }</td>
            <td> ${data.usuario}</td>
        `
        see.appendChild(tr)
    })
}
async function start(id){
    let dataa
    let expenses = await fetch(`/expenses/${id}`)
        .then((response) =>{
            return response.json();
        })
        .then((data)=>{
            dataa = data;
        })
        .catch(function(error) {
            console.log(error);
          });
        console.log(dataa)
    return dataa
}