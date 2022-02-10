let cliente = [document.querySelector('#nombres'), document.querySelector('#cedula'), document.querySelector('#direccion'),document.querySelector('#tel')]
    let producto = [document.querySelector('#codigo'), document.querySelector('#nombre'),document.querySelector('#cantidad'), document.querySelector('#precio')]
    let buttons = [document.querySelector("#add"), document.querySelector("#procesar")]
    let tbody = document.querySelector("#factura"), nuevaFactura = document.querySelector(".nuevaFactura")
    let totalElement = document.querySelector("#total")
    let delElement = document.querySelectorAll("#del")
    let total = 0
    let id = 1
    let productos = []
    let date =new Date()
    let fecha = `${date.getFullYear()}-0${date.getMonth()+1}-0${date.getDate()}`
  /*UI*/
    buttons[0].addEventListener('click', ()=>{
      
      if(producto[0].value == '' || producto[2].value == ''){
        alert('codigo o cantidad vacio')
      }else{
        addProductoToUI(producto)
      } 

    }) 
    buttons[1].addEventListener('click', ()=>{
      generateForm()
      submit()
    })
    producto[0].addEventListener('blur', ()=>{
      let testid = producto[0].value
      start(testid)
    })


    function addProductoToUI(producto){
      
      let precioTotal = parseInt(producto[2].value) * parseFloat(producto[3].innerText) 
      
      let tr = document.createElement('tr')
      tr.innerHTML = `
        <td scope="row">${id}</td>
        <td scope="row">${producto[0].value}</td>
        <td>${producto[1].innerText}</td>
        <td>${producto[2].value}</td>
        <td>${producto[3].innerText}</td>
        <td>${precioTotal}</td>
        <td><button class="btn btn-sm btn-danger"id="del">X</button></td>
      `
      
      tbody.appendChild(tr)
      let productoAdd = [producto[0].value, producto[2].value, id ]
      productos.push(productoAdd)
      total = total + precioTotal;
      total = parseFloat(total)
      totalElement.innerText = total;
      id = id + 1
      delProductoFromUI()
    }
    function delProductoFromUI(){
      let delElement = document.querySelectorAll("#del")

      delElement.forEach(ele =>{
      
      ele.addEventListener('click', (e)=>{
        let precio = e.target.parentElement.previousElementSibling.innerText
        let id = e.target.parentElement.parentElement.firstElementChild.innerText
        console.log(id)
        
        for(let x = 0; x< productos.length; x++){
          console.log(productos[x][2])
          if(productos[x][2] == id){
            
            console.log(x)
            productos.splice(x, 1)
          }else{
            console.log('no')
          }
        }
        console.log(productos)
        precio = parseFloat(precio)
        total = total - precio
        total = parseFloat(total)
        totalElement.innerText = total;

        e.target.parentElement.parentElement.remove()
      })
    })
 }
 /*BACKEND*/   
function generateForm(){
      let div = document.createElement('div')
      div.innerHTML = `
        <input type="text" name="nombres" value="${cliente[0].value}">
        <input type="text" name="direccion" value="${cliente[2].value}">
        <input type="text" name="telefono" value="${cliente[3].value}">
        <input type="text" name="cedula" value="${cliente[1].value}">

        <input type="text" name="fecha" value="${fecha}">
        <input type="text" name="total" value="${total}">
        <input type="text" name="usuario" value="ADMIN">
      `
      nuevaFactura.appendChild(div)
    }
function submit(){
      productos.forEach(producto =>{
        post(producto)
      })

      nuevaFactura.submit()
    }
async function post(producto){
      fetch("/factura",
      {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          method: "POST",
          body: JSON.stringify({
            id_factura:'1',
            id_test : producto[0],
            cantidad: producto[1]
          })
      })
      .then(function(res){ console.log(res) })
      .catch(function(res){ console.log(res) })
    }

/*Validation*/

function autoComplete(data){
  if(data.length > 0){
    console.log(data[0])
    producto[1].innerText = `${data[0].nombres}`
    producto[3].innerText = `${data[0].precio}`
  }else{
    alert('no existe producto con ese id')
    producto[0].value = ``
  }
  
}
async function start(id){
  let dataa
  const response = await fetch(`/test/${id}`)
  const data = await response.json();
  console.log(data)
  autoComplete(data)
  return data
}

