let inputs = [document.querySelector('#codigo'), document.querySelector('#cantidad')]
let nombre = document.querySelector('#nombre')
let buttons = [document.querySelector('.add'), document.querySelector('.send')], tbody = document.querySelector('#tbody')
let productos = [], textarea=  document.querySelector('#details')



inputs[0].addEventListener('blur', ()=>{
    let id = inputs[0].value
    let data = start(id)
    

})
buttons[0].addEventListener('click', ()=>{
    let tr = document.createElement('tr')
    tr.innerHTML = `
        <td>${inputs[0].value}</td>
        <td>${nombre.innerText}</td>
        <td>${inputs[1].value}</td>
        <td><button class="btn btn-danger del">Eliminar</button></td>
    `
    let producto = [inputs[0].value, nombre.innerText, inputs[1].value]
    productos.push(producto)
    console.log(productos)
    tbody.appendChild(tr)
    delProductoFromUI()
})
buttons[1].addEventListener('click',()=>{
    textarea.value = JSON.stringify(productos)
    document.querySelector('#form').submit()
})
function autoComplete(data){
    console.log(data[0])
    nombre.innerText = `${data[0].nombre}`
}
async function start(id){
    let dataa
    const response = await fetch(`/producto/${id}`)
    const data = await response.json();
    console.log(data)
    autoComplete(data)
    return data
}
function delProductoFromUI(){
    let delElement = document.querySelectorAll(".del")

    delElement.forEach(ele =>{
    
    ele.addEventListener('click', (e)=>{
        console.log(productos)
        let id = e.target.parentElement.parentElement.firstElementChild.innerText
        for(let x = 0; x< productos.length; x++){
            console.log(productos[x][0])
            if(productos[x][0] == id){
              
              console.log(x)
              productos.splice(x, 1)
              console.log(productos)
            }else{
              console.log('no')
            }
          }
        e.target.parentElement.parentElement.remove()
    })
  })
}