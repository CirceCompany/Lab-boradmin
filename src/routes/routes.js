const express =  require('express');
const pool = require('../database');
const router = express.Router();

router.get('/', (req, res) =>{
    res.render('portals/1Index');
})

/*facturas*/
router.get('/nuevaVenta', (req, res) =>{
    res.render('portals/2nuevaFactura');
})

router.get('/Factura', async(req, res) =>{
    let facturas = await pool.query('SELECT * FROM FACTURAS')
    res.render('portals/3Facturas', {facturas});
})

router.post('/factura', async(req,res)=>{
    let newFacturaDetalle = {
        id_factura: req.body.id_factura,
        id_test: req.body.id_test,
        cantidad : req.body.cantidad
    }

    newFacturaDetalle.cantidad = parseInt(newFacturaDetalle.cantidad)
    try{
        await pool.query('INSERT INTO factura_detalles SET = ?', newFacturaDetalle)
    } catch(error){
        console.log(error)
    }
})

router.post('/nuevaFactura', async(req,res)=>{
    let newFactura = {
        fecha: req.body.fecha,
        total: req.body.total,
        id_usuario: req.body.cedula,
        usuario: req.body.usuario
    }
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
        await pool.query('INSERT INTO facturas SET = ?', newFactura)
    } catch(error){
        console.log(error)
    }

    
    try{
        await pool.query('INSERT INTO clientes SET = ?', newCliente)
    } catch(error){
        console.log(error)
    }
})



router.get('/Caja', (req, res) =>{
    res.render('portals/4Caja');
})

router.get('/Compras', (req, res) =>{
    res.render('portals/5Compras');
})



router.get('/Gastos', (req, res) =>{
    res.render('portals/7Gastos');
})

router.get('/Inventario', (req, res) =>{
    res.render('portals/8Inventario');
})

router.get('/Nomina', (req, res) =>{
    res.render('portals/9Nomina');
})

/*presupuestos*/
router.get('/Presupuestos', async(req, res) =>{
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
router.post('/addPresupuesto', async(req, res)=>{
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
router.post('/addGasto/:id', async(req, res)=>{
    let {id} =req.params
    let newGasto = {
        id: req.body.id,
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


    res.redirect('/Presupuestos')
})
router.get('/expenses/:id', async(req, res) =>{
    let {id} = req.params
    let gastos = await pool.query('SELECT * FROM gastos WHERE presupuesto_id = ?', id)
    res.send(gastos)
})



router.get('/AddTests', (req, res) =>{
    res.render('portals/12AddTest');
})



/*pacientes*/
router.get('/Pacientes', (req, res) =>{
    res.render('portals/13Pacientes');
})

router.get('/Expedientes', (req, res) =>{
    res.render('portals/14Expedientes');
})

router.get('/NuevoPaciente', (req, res) =>{
    res.render('portals/NuevoPaciente');
})


/* gastos */
router.get('/addGastos', (req, res) =>{
    res.render('portals/17AddGastos');
})



/*Productos*/
router.get('/addProductos', (req, res) =>{
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
router.get('/Productos', async (req, res) =>{
    let productos = await pool.query(`SELECT * FROM productos`);
    res.render('portals/18Productos', {productos});
})
router.get('/editarProducto/:id',async(req, res) =>{
    let {id} = req.params; 
    let producto = await pool.query(`SELECT * FROM productos WHERE id = ?`, id);
    res.render('portals/editar/editarProductos', {producto});
})
router.post('/editarProducto/:id', async(req, res) =>{
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
 router.get('/delProducto/:id',async(req, res) =>{
    let {id} = req.params; 
    let producto = await pool.query(`DELETE FROM productos WHERE id = ?`, id);
    res.redirect('/Productos')
})


/*empleados*/
router.get('/Empleados', async (req, res) =>{
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
router.post('/addEmpleado', async(req, res) =>{
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
router.get('/addEmpleado', (req, res) =>{
     res.render('portals/16AddEmpleado');
 })
router.get('/editarEmpleado/:id',async(req, res) =>{
     let {id} = req.params; 
     let empleado = await pool.query(`SELECT * FROM empleados WHERE id = ?`, id);
     res.render('portals/editar/editarEmpleado', {empleado});
 })
router.post('/editarEmpleado/:id', async(req, res) =>{
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
router.get('/delEmpleado/:id',async(req, res) =>{
     let {id} = req.params; 
     let producto = await pool.query(`DELETE FROM empleados WHERE id = ?`, id);
     res.redirect('/Empleados')
 })




// /***Pacientes */
// router.get('/Pacientes', (req, res) =>{
//     res.render('portals/Pacientes');
// })

// router.get('/NuevoPaciente', (req, res) =>{
//     res.render('portals/NuevoPaciente');
// })

// router.get('/agregarExamen/:id', async (req, res) =>{
//     let {id} = req.params; 
//     try{
//        paciente =  await pool.query(`SELECT * FROM paciente WHERE Id = ?`, id);
//     } catch (error){
//         console.log('factura no creada')
//     }
//     let test;
//     try{
//         test = await pool.query('SELECT * FROM muestras')
//     } catch(error){
//         console.log('nope');
//     }
    
//     res.render('portals/AgregarExamen', {test, paciente})
// })

// router.get('/BuscarPaciente', async (req, res) =>{
//     const paciente = await pool.query('SELECT id, Nombre, Apellido , Cedula, Telefono, Direccion, Edad, Sangre, Fecha, Sexo, Patologia, Nacion, Municipio, Estado, Hijos, Civil, Ocupacion, Grado FROM paciente')
//     res.render('portals/BuscarPaciente', {paciente});
// })

// router.post('/PacientAdded', async(req, res) =>{
//     const newPacient = {
//         Nombre : req.body.Nombre,
//         Apellido : req.body.Apellido,
//         Cedula : req.body.Cedula,
//         Edad : req.body.Edad,
//         Fecha: req.body.Fecha,
//         Sexo : req.body.Sexo,
//         Sangre : req.body.Sangre,
//         Patologia : req.body.Patologia,
//         Estado: req.body.Estado,
//         Municipio: req.body.Municipio,
//         Hijos : req.body.Hijos,
//         Grado : req.body.Grado,
//         Nacion : req.body.Nacion,
//         Ocupacion : req.body.Ocupacion,
//         Civil : req.body.Civil,
//         Telefono : req.body.Telefono,
//         Direccion : req.body.Direccion
//     }
//     await pool.query('INSERT INTO paciente SET ? ', newPacient)
//     res.render('portals/PacientAdded');
// })

// router.post('/factura/:id', async(req, res) =>{
   
//         let id = req.body.id
//         let cost = req.body.cost        

//         console.log(id)
//         console.log(cost)
//     await pool.query(`INSERT INTO facturas(Cost, id) VALUES('${id}', '${cost}')`)
//     res.render('portals/Factura')
// })

// router.get('/Paciente/:id', async (req, res) =>{
//     let {id} = req.params;
//     console.log(id)
//     paciente =  await pool.query(`SELECT * FROM paciente WHERE Id = ?`, id);
//     res.render('portals/Paciente', {paciente});
// })
 
// router.get('/agregarExamen', (req, res) =>{
//     res.render('portals/AgregarExamen');
// })

// router.get('/Expedientes', async(req, res) =>{
//     const pacientes = await pool.query('SELECT * FROM paciente')
//     res.render('portals/Expedientes', {pacientes});
// })


// /*** Reportes ***/

// router.get('/ControlResultados', (req, res) => {
//     res.render('portals/ControlResultados');
// })

// router.get('/Interfaces', (req, res) =>{
//     res.render('portals/Interfaces');
// })

// router.get('/GeneralFacturas', (req, res) =>{
//     res.render('portals/GeneralFacturas');
// })

// router.get('/FacturasReciente', async(req, res) =>{
//     const factura = await pool.query('SELECT * FROM facturas INNER JOIN paciente ON facturas.id = paciente.id')
//     res.render('portals/FacturasReciente', {factura});
// })

// router.get('/Configuraciones', (req, res) =>{
//     res.render('portals/Configuraciones');
// })

// /** Usuario Doctores */

// router.get('/Usuario', (req, res) =>{
//     res.render('portals/Usuario');
// })

// router.get('/AddTest', (req, res) =>{
//     res.render('portals/AddTest');
// })

// router.post('/AddTest', async(req, res) =>{
//     const newTest = {
//         testName : req.body.testName,
//         cost : req.body.cost
//     }
//     await pool.query('INSERT INTO muestras SET ?', newTest)
//     res.redirect('/Index');
// })

// /** Administrador */

// router.get('/Indexadmin', (req, res) =>{
//     res.render('admin/Index');
// })

// router.get('/Configuracionesadmin', (req, res) =>{
//     res.render('admin/Configuraciones');
// })

// router.get('/Permisosadmin', (req, res) =>{
//     res.render('admin/Permisos');
// })

// router.get('/Interfacessadmin', (req, res) =>{
//     res.render('admin/Interfaces');
// })

// router.get('/Usuarios', (req, res) =>{
//     res.render('admin/Usuarios');
// })

// router.get('/Logusuario', (req, res) =>{
//     res.render('admin/Logusuario');
// })

// router.get('/Pagosadmin', (req, res) =>{
//     res.render('admin/Pagosadmin');
// })

// router.get('/Adminuser', (req, res) =>{
//     res.render('admin/Adminuser');
// })

// router.get('/Inventario', (req, res) =>{
//     res.render('admin/Inventario');
// })

// router.get('/Empleados', (req, res) =>{
//     res.render('admin/Empleados');
// })


module.exports = router;