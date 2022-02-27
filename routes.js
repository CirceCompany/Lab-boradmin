const express =  require('express');
const pool = require('../database');
const router = express.Router();
const { isLoggedIn , isNotLoggedIn } = require('../lib/auth');


router.get('/', (req, res) =>{
    res.render('portals/1Index');
})

/*facturas*/
router.get('/nuevaVenta',isLoggedIn,  (req, res) =>{
    res.render('portals/2nuevaFactura');
})
router.get('/Factura',isLoggedIn,  async(req, res) =>{
    let facturas = await pool.query('SELECT * FROM FACTURAS')
    facturas.forEach(factura => {
        let fecha = new Date(factura.fecha)
        factura.fecha = `${fecha.getDate()}/${fecha.getMonth() + 1}/${fecha.getFullYear()}`

    });
    res.render('portals/3Facturas', {facturas});
})
router.post('/factura',isLoggedIn,  async(req,res)=>{
    let newFacturaDetalle = {
        id_factura: req.body.id_factura,
        id_test: req.body.id_test,
        cantidad : req.body.cantidad
    }

    newFacturaDetalle.cantidad = parseInt(newFacturaDetalle.cantidad)
    try{
        await pool.query('INSERT INTO factura_detalles SET  ?', newFacturaDetalle)
    } catch(error){
        console.log(error)
    }
})
router.post('/nuevaFactura',isLoggedIn,  async(req,res)=>{
    let newFactura = {
        fecha: req.body.fecha,
        total: req.body.total,
        id_usuario: req.body.cedula,
        usuario: req.body.usuario
    }
    let caja;

    newFactura.total = parseFloat(newFactura.total)
    newFactura.id_usuario = parseInt(newFactura.id_usuario)

    let newCliente ={
        nombres: req.body.nombres,
        cedula:req.body.cedula,
        direccion:req.body.direccion,
        telefono: req.body.telefono,
        edad: 0
    }
    newCliente.cedula = parseInt(newCliente.cedula)

    try{
        await pool.query('INSERT INTO facturas SET ?', newFactura)
    } catch(error){
        console.log(error)
    }
    try{
        await pool.query('INSERT INTO clientes SET  ?', newCliente)
    } catch(error){
        console.log(error)
    }
    try{
        caja = await pool.query('SELECT * FROM caja  ORDER BY id DESC LIMIT 1')
    } catch(error){
        console.log(error)
    }
    let id = caja[0].id
    let montoActual = caja[0].monto
    montoActual = parseFloat(montoActual)
    montoActual = montoActual + newFactura.total

    try{
        await pool.query(`UPDATE caja SET monto = ${montoActual} WHERE id = ${id}`)
    } catch(error){
        console.log(error)
    }

    res.redirect('/Factura')
})
router.get('/test/:code',isLoggedIn,  async(req,res)=>{
    let {code} = req.params
    let producto = await pool.query(`SELECT * FROM tests WHERE id LIKE ?`,code);
    res.send(producto)
})

/*Caja*/
router.get('/Caja', isLoggedIn, async(req, res) =>{
    let caja = await pool.query('SELECT monto FROM caja ORDER BY id DESC LIMIT 1')
    res.render('portals/4Caja', {caja});
})
router.post('/addCaja',isLoggedIn,  async(req,res)=>{
    let newFondo = {
        monto : req.body.monto
    }
    newFondo.monto = parseFloat(newFondo.monto)
    let date = new Date()
    newFondo.fecha = `${date.getFullYear()}-0${date.getMonth()+1}-${date.getDate()}`
    newFondo.usuario = 'ADMIN'

    try{
        await pool.query(`INSERT INTO caja SET ?`, newFondo)
    }catch(error){
        console.log(error)
    }
    res.redirect('/Caja')
})
router.get('/Compras',isLoggedIn,  (req, res) =>{
    res.render('portals/5Compras');
})
router.get('/Inventario',isLoggedIn,  (req, res) =>{
    res.render('portals/8Inventario');
})


/*presupuestos*/
router.get('/Presupuestos',isLoggedIn,  async(req, res) =>{
    let presupuestos = await pool.query(`SELECT * FROM presupuestos`);
    presupuestos.forEach(presupuesto => {
        let valActual = presupuesto.monto_actual
        let valTotal = presupuesto.monto_total

        if(valActual >= valTotal * 0.25 && valActual <= valTotal * 0.50){
            presupuesto.width = '25'
        } else if(valActual >= valTotal * 0.50 && valActual <= valTotal * 0.75){
            presupuesto.width >= '50'
        } else if(valActual >= valTotal * 0.75 && valActual <= valTotal){
            presupuesto.width = '75'
            presupuesto.status = 'warning'
        } else if(valActual >= valTotal ){
            presupuesto.width = '100'
            presupuesto.status = 'danger'
        }
       
    });
    
    res.render('portals/10Presupuestos', {presupuestos});
})
router.post('/addPresupuesto', isLoggedIn, async(req, res)=>{
    let newGasto = {
        id: req.body.id,
        nombre : req.body.nombre,
        monto_total: req.body.monto_total,
        monto_actual: 0,
        detalles: req.body.detalles
    }

    try{
        await pool.query('INSERT INTO presupuestos SET ? ', newGasto)
    }catch(error){
        console.log(error)
    }

    res.redirect('/Presupuestos')
})
router.post('/addGasto/:id',isLoggedIn,  async(req, res)=>{
    let {id} =req.params
    let newGasto = {
        presupuesto_id : id,
        monto: req.body.monto,
        fecha: new Date(),
        detalles: req.body.detalles
    }
    let monto
    newGasto.monto = parseFloat(newGasto.monto)
    try{
        await pool.query('INSERT INTO gastos SET ? ', newGasto)
    }catch(error){
        console.log(error)
    }
    try{
       monto = await pool.query('SELECT SUM(monto) AS monto FROM gastos WHERE presupuesto_id = ?', id)
    }catch(error){
        console.log(error)
    }
    
    console.log(monto)
    monto = monto[0].monto
    console.log(monto)

    try{
        await pool.query(`UPDATE presupuestos SET monto_actual = '${monto}' WHERE id = ${id}`, newGasto)
    }catch(error){
        console.log(error)
    }

    try{
        caja = await pool.query('SELECT * FROM caja  ORDER BY id DESC LIMIT 1')
    } catch(error){
        console.log(error)
    }
    let idP = caja[0].id
    let montoActual = caja[0].monto
    montoActual = parseFloat(montoActual)
    montoActual = montoActual - monto

    try{
        await pool.query(`UPDATE caja SET monto = ${montoActual} WHERE id = ${idP}`)
    } catch(error){
        console.log(error)
    }


    res.redirect('/Presupuestos')
})
router.get('/expenses/:id',isLoggedIn,  async(req, res) =>{
    let {id} = req.params
    let gastos = await pool.query('SELECT * FROM gastos WHERE presupuesto_id = ?', id)
    res.send(gastos)
})


/*Tests*/
router.get('/AddTests', isLoggedIn, async(req, res) =>{
    res.render('portals/12AddTest');
})
router.get('/producto/:code',isLoggedIn,  async(req,res)=>{
    let {code} = req.params
    let producto = await pool.query(`SELECT * FROM productos WHERE id LIKE ?`,code);
    res.send(producto)
})
router.post('/addTest', isLoggedIn, async(req,res)=>{
    let newTest = {
        nombres: req.body.nombre,
        descripcion: req.body.descripcion,
        precio: req.body.precio,
        detalles: req.body.detalles
    }

    try{
        await pool.query('INSERT INTO tests SET ?', newTest)
    } catch(error){
        console.log(error)
    }
    res.redirect('/')
})


/*pacientes*/
router.get('/Pacientes', isLoggedIn, async(req, res) =>{
    let clientes = await pool.query('SELECT * FROM clientes')
    res.render('portals/13Pacientes', {clientes});
})
router.get('/Expedientes',isLoggedIn,  (req, res) =>{
    res.render('portals/14Expedientes');
})
router.get('/NuevoPaciente',isLoggedIn,  (req, res) =>{
    res.render('portals/NuevoPaciente');
})


/* gastos */
router.get('/addGastos',isLoggedIn,  (req, res) =>{
    res.render('portals/17AddGastos');
})



/*Productos*/
router.get('/addProductos', isLoggedIn, (req, res) =>{
    res.render('portals/15AddProductos');
})
router.post('/addProducto', async(req, res) =>{
   let newProducto ={
       id: req.body.id,
       nombre: req.body.nombre,
       precio: req.body.precio,
       descripcion : req.body.descripcion,
       detalles :req.body.detalles
   }

 
    newProducto.detalles = 'NULL'
    newProducto.precio = parseFloat(newProducto.precio)
    try{
        await pool.query('INSERT INTO productos SET ? ', newProducto)
    }catch(error){
        console.log(error)
    }
    res.redirect('/Productos')
})
router.get('/Productos',isLoggedIn,  async (req, res) =>{
    let productos = await pool.query(`SELECT * FROM productos`);
    res.render('portals/18Productos', {productos});
})
router.get('/editarProducto/:id',isLoggedIn, async(req, res) =>{
    let {id} = req.params; 
    let producto = await pool.query(`SELECT * FROM productos WHERE id = ?`, id);
    res.render('portals/editar/editarProductos', {producto});
})
router.post('/editarProducto/:id',isLoggedIn,  async(req, res) =>{
    let newProducto ={
        id: req.body.id,
        nombre: req.body.nombre,
        precio: req.body.precio,
        descripcion : req.body.descripcion,
        detalles :req.body.detalles
    }
    
     newProducto.detalles = 'NULL'
     newProducto.precio = parseFloat(newProducto.precio)
     try{
         await pool.query(`UPDATE productos SET nombre = '${newProducto.nombre}', descripcion = '${newProducto.descripcion}', precio = '${newProducto.precio}' WHERE id = ${newProducto.id}` )
     }catch(error){
         console.log(error)
     }
     res.redirect('/Productos')
 })
 router.get('/delProducto/:id',isLoggedIn, async(req, res) =>{
    let {id} = req.params; 
    let producto = await pool.query(`DELETE FROM productos WHERE id = ?`, id);
    res.redirect('/Productos')
})


/*empleados*/
router.get('/Empleados', isLoggedIn, async (req, res) =>{
    let empleados = await pool.query(`SELECT * FROM empleados`);
    console.log(empleados[0].fecha_nac )
    empleados.forEach(empleado => {
        let birthdate = new Date(empleado.fecha_nac)
        empleado.fecha_nac = `${birthdate.getDate()}/${birthdate.getMonth() + 1}/${birthdate.getFullYear()}`

        let date = new Date(empleado.fecha_inicio)
        empleado.fecha_inicio = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
        
    });
    res.render('portals/6Empleados', {empleados});
})
router.post('/addEmpleado', isLoggedIn, async(req, res) =>{
    let newEmpleado={
        id: req.body.id,
        nombres: req.body.nombres,
        cedula: req.body.cedula,
        direccion : req.body.direccion,
        telefono :req.body.telefono,
        fecha_nac :req.body.fecha_nac,
        fecha_inicio:req.body.fecha_inicio,
        fecha_egreso: req.body.fecha_egreso,
        departamento : req.body.departamento,
        salario : req.body.salario
    }
 
  
     
     newEmpleado.salario = parseFloat(newEmpleado.salario)
     try{
         await pool.query('INSERT INTO empleados SET ? ', newEmpleado)
     }catch(error){
         console.log(error)
     }
     res.redirect('/Empleados')
 }) 
router.get('/addEmpleado',isLoggedIn,  (req, res) =>{
     res.render('portals/16AddEmpleado');
 })
router.get('/editarEmpleado/:id',isLoggedIn, async(req, res) =>{
     let {id} = req.params; 
     let empleado = await pool.query(`SELECT * FROM empleados WHERE id = ?`, id);
     res.render('portals/editar/editarEmpleado', {empleado});
 })
router.post('/editarEmpleado/:id', isLoggedIn, async(req, res) =>{
    let newEmpleado={
        id: req.body.id,
        nombres: req.body.nombres,
        cedula: req.body.cedula,
        direccion : req.body.direccion,
        telefono :req.body.telefono,
        fecha_nac :req.body.fecha_nac,
        fecha_inicio:req.body.fecha_inicio,
        fecha_egreso: req.body.fecha_egreso,
        departamento : req.body.departamento,
        salario : req.body.salario
    }
    newEmpleado.salario = parseFloat(newEmpleado.salario)

      try{
          await pool.query(`UPDATE empleados SET nombres = '${newEmpleado.nombres}', cedula = '${newEmpleado.cedula}', direccion = '${newEmpleado.direccion}', telefono = '${newEmpleado.telefono}', fecha_nac = '${newEmpleado.fecha_nac}', fecha_inicio = '${newEmpleado.fecha_inicio}', fecha_egreso = '${newEmpleado.fecha_egreso}', departamento = '${newEmpleado.departamento}', salario = '${newEmpleado.salario}' WHERE id = ${newEmpleado.id}` )
      }catch(error){
          console.log(error)
      }
      res.redirect('/Empleados')
  })
router.get('/delEmpleado/:id',isLoggedIn, async(req, res) =>{
     let {id} = req.params; 
     let producto = await pool.query(`DELETE FROM empleados WHERE id = ?`, id);
     res.redirect('/Empleados')
 })
router.get('/Nomina',isLoggedIn,  (req, res) =>{
    res.render('portals/9Nomina');
})

/*Imprimir Factura*/

router.get('/Facturacion',isLoggedIn,  (req, res) =>{
    res.render('portals/19Facturaprint');
})

/*Login mas Registro*/

router.get('/Login', (req,res) =>{
    res.render('authentication/login');
})

router.get('/Registro', (req,res) =>{
    res.render('authentication/registro');
})

/*Admin*/

router.get('/Admin', (req,res) =>{
    res.render('authentication/adminlogin');
})


module.exports = router;