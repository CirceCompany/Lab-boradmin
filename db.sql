CREATE TABLE `facturas`(
  `id` int(15)PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `fecha` date NOT NULL,
  `total` float(10) NOT NULL,
  `id_usuario` int(12) NOT NULL,
  `usuario`varchar(12) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

CREATE TABLE `factura_detalles`(
    `id` int(15)PRIMARY KEY NOT NULL AUTO_INCREMENT,
    `id_factura` varchar(15) NOT NULL,
    `id_test` varchar(15) NOT NULL,
    `cantidad` int(5) NOT NULL
);

CREATE TABLE `pacientes`(
    `id` varchar(15)PRIMARY KEY NOT NULL,
    `nombres` varchar(20) NOT NULL,
    `direccion` varchar(70) NOT NULL,
    `telefono` varchar(15) NOT NULL
);

CREATE TABLE `productos`(
    `id` varchar(15)PRIMARY KEY NOT NULL,
    `nombre` varchar(20) NOT NULL,
    `descripcion` varchar(70) NOT NULL,
    `precio` float(15) NOT NULL,
    `detalles` longtext NOT NULL
);

CREATE TABLE `inventario`(
    `id_producto` varchar(15)PRIMARY KEY NOT NULL,
    `cantidad` int(10) NOT NULL,
    `detalles` longtext NOT NULL
    
);

CREATE TABLE `empleados`(
    `id` varchar(15)PRIMARY KEY NOT NULL,
    `nombres` varchar(20) NOT NULL,
    `cedula` int(12) NOT NULL,
    `direccion` varchar(70) NOT NULL,
    `telefono` varchar(20) NOT NULL,
    `fecha_nac` date NOT NULL,
    `fecha_inicio` date NOT NULL,
    `fecha_egreso` date,
    `departamento` varchar(20) NOT NULL,
    `salario` float(20) NOT NULL

);

CREATE TABLE `gastos`(
    `id` int(15)PRIMARY KEY NOT NULL AUTO_INCREMENT,
    `presupuesto_id` varchar(15) NOT NULL,
    `monto` float(12) NOT NULL,
    `fecha` date NOT NULL,
    `usuario` varchar(20) NOT NULL,
    `detalles` longtext
    
);

CREATE TABLE `presupuestos`(
    `id` int(15)PRIMARY KEY NOT NULL AUTO_INCREMENT,
    `nombre` varchar(20) NOT NULL,
    `monto_total` float(15) NOT NULL,
    `monto_actual` float(15) NOT NULL,
    `detalles` longtext
    
);

CREATE TABLE `caja`(
    `id` int(15)PRIMARY KEY NOT NULL AUTO_INCREMENT,
    `fecha` date NOT NULL,
    `monto` float(20) NOT NULL,
   `usuario` varchar(20) NOT NULL
);


CREATE TABLE `clientes`(
    `id` int(15) PRIMARY KEY AUTO_INCREMENT,
    `nombres` varchar(20) NOT NULL,
    `cedula` int(12) NOT NULL,
    `telefono` varchar(20) NOT NULL,
    `direccion` varchar(70) NOT NULL,
    `edad` int(3) NOT NULL
);

CREATE TABLE `tests`(
    `id` int(15) PRIMARY KEY AUTO_INCREMENT,
    `nombres` varchar(20) NOT NULL,
    `precio` float(12) NOT NULL,
    `descripcion` varchar(20) NOT NULL,
    `detalles` longtext
);

CREATE TABLE `users` ( 
  `id` int(11) NOT NULL,
  `username` varchar(16) NOT NULL,
  `password` varchar(60) NOT NULL,
  `fullname` varchar(100) NOT NULL,
  `useradmin` varchar(20) NOT NULL,
  `passwordadmin` varchar(20) NOT NULL
);

ALTER TABLE users
    ADD PRIMARY KEY (id);
ALTER TABLE users
    MODIFY id int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT =2;

CREATE TABLE links(
    `id` int(11) NOT NULL,
    `title` varchar(150) NOT NULL,
    `url` varchar(255) NOT NULL,
    description text.
    `user_id` int(11),
    `created_at` timestamp NOT NULL DEFAULT current_timestamp
    CONSTRAINT fk_user FOREIGN KEY (`user_id`) REFERENCES users(id)
);

ALTER TABLE links
    ADD PRIMARY Key (id)

ALTER TABLE links
    MODIFY id int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT =2;
