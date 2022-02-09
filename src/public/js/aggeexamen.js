const buttons = document.querySelectorAll(".btns")
const cuerpo = document.querySelector(".cuerpoFactura")
const priceTag = document.querySelector(".price")


const clienteId = document.querySelector(".cliente")
let num = 0
let priceTotal = 0


buttons.forEach(function(button){
    button.addEventListener('click', function(){

        const newRow=  document.createElement("tr")
        const price= button.getAttribute('data-price')
        const name = button.getAttribute('data-name')
        const newInput = document.createElement("div")

        if(button.classList.contains("active")){
            //removes from interface
            cuerpo.removeChild(document.querySelector(`.${button.id}ele`))
            button.classList.remove("active")

            //updates prices
            priceTotal -= parseFloat(price)
            priceTag.innerHTML = priceTotal

            // removes from invisble Form

           
        }else{
           
            
            //creates content
            newRow.innerHTML = `
            <td>${name}</td>
            <td> ${price} </td>`

            //add consten to interface
            newRow.classList.add(`${button.id}ele`)
            cuerpo.appendChild(newRow)
            button.classList.add("active")
             
            //updates price 
            priceTotal += parseFloat(price)
            priceTag.innerHTML = priceTotal


            //adds to invisible form
            document.querySelector('.name').value = `${clienteId.id}`
            document.querySelector('.cost').value =`${priceTotal}`
            
        }
        
       
        
    })
})