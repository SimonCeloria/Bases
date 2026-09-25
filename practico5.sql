USE sakila;

-- Ej 1 Cree una tabla de `directors` con las columnas: Nombre, Apellido, Número de Películas.

CREATE TABLE IF NOT EXISTS directors (
  director_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(45) NOT NULL,
  last_name VARCHAR(45) NOT NULL,
  n_films INTEGER DEFAULT 0
);

-- Ej 2 El top 5 de actrices y actores de la tabla `actors` que tienen la mayor experiencia
-- (i.e. el mayor número de películas filmadas) son también directores de las películas en las que participaron. 
-- Basados en esta información, inserten, utilizando una subquery los valores correspondientes en la tabla `directors`.
INSERT INTO directors (name, last_name, n_films)
SELECT a.first_name AS name, a.last_name, COUNT(film_actor.film_id) AS films_cant
FROM actor a
JOIN film_actor ON a.actor_id = film_actor.actor_id
GROUP BY a.actor_id, a.first_name, a.last_name
ORDER BY films_cant DESC
LIMIT 5;

SELECT * FROM directors;

-- Ej 3 Agregue una columna `premium_customer` que tendrá un valor 'T' o 'F' de acuerdo a si el cliente 
-- es "premium" o no. Por defecto ningún cliente será premium.

ALTER TABLE customer
ADD premium_customer VARCHAR(1) DEFAULT 'F';

-- Ej 4 Modifique la tabla customer. Marque con 'T' en la columna `premium_customer` 
-- de los 10 clientes con mayor dinero gastado en la plataforma.

SELECT c.first_name AS nombre, c.last_name AS apellido, sum(p.amount) AS total
FROM payment p
JOIN customer AS c ON p.customer_id = c.customer_id
GROUP BY c.customer_id
ORDER BY total DESC
LIMIT 10;

UPDATE customer
SET premium_customer = 'T'
WHERE customer_id IN (
    SELECT t.customer_id FROM (
        SELECT customer_id
        FROM payment
        GROUP BY customer_id
        ORDER BY SUM(amount) DESC
        LIMIT 10
    ) AS t
);
        
-- Ej 6 ¿Cuáles fueron la primera y última fecha donde hubo pagos?

SELECT 
    MIN(payment_date) AS fist_payment_date, 
    MAX(payment_date) AS last_payment_date 
FROM payment;

-- Ej 5Listar, ordenados por cantidad de películas (de mayor a menor), los distintos ratings de 
-- las películas existentes (Hint: rating se refiere en este caso a la clasificación según edad: G, PG, R, etc).

SELECT rating, count(film_id) as film_amount
FROM film GROUP BY rating
ORDER BY -film_amount;

-- Ej 7 Calcule, por cada mes, el promedio de pagos (Hint: vea la manera de extraer el nombre del mes de una fecha).

SELECT
	MONTH(p.payment_date) AS month_date,
	AVG(p.amount) AS average
FROM payment AS p
GROUP BY month_date
ORDER BY average DESC

SELECT payment_date
FROM payment

-- Ej 8 Listar los 10 distritos que tuvieron mayor cantidad de alquileres (con la cantidad total de alquileres).

SELECT address.district, count(*) as rentals
FROM address LEFT JOIN (
		SELECT customer.customer_id, customer.address_id 
		from rental INNER JOIN customer
        ON rental.customer_id = customer.customer_id
    ) as customer_rentals
ON (customer_rentals.address_id = address.address_id)
GROUP BY address.district
ORDER BY rentals DESC
LIMIT 10;

SELECT 
	a.district,
	COUNT(r.rental_id) AS total_rentals
FROM rental r
JOIN customer c ON r.customer_id = c.customer_id
JOIN address a ON c.address_id = a.address_id
GROUP BY a.district
ORDER BY total_rentals DESC
LIMIT 10;

SELECT 
    ci.city, 
    COUNT(r.rental_id) AS total_alquileres
FROM rental r
JOIN customer c ON r.customer_id = c.customer_id  -- Puente 1
JOIN address a  ON c.address_id = a.address_id    -- Puente 2
JOIN city ci    ON a.city_id = ci.city_id         -- Puente 3
GROUP BY ci.city
ORDER BY total_alquileres DESC
LIMIT 10;

-- Ej 9 Modifique la table `inventory_id` agregando una columna `stock` que sea un número entero y representa la cantidad de 
-- copias de una misma película que tiene determinada tienda. El número por defecto debería ser 5 copias.

ALTER TABLE inventory
ADD stock INT DEFAULT 5;

SELECT * FROM inventory

-- Ej 10 Cree un trigger `update_stock` que, cada vez que se agregue un nuevo registro a la tabla rental, haga un update en 
-- la tabla `inventory` restando una copia al stock de la película rentada (Hint: revisar que el rental 
-- no tiene información directa sobre la tienda, sino sobre el cliente, que está asociado a una tienda en particular).
DROP TRIGGER IF EXISTS update_stock;

DELIMITER //

CREATE TRIGGER update_stock
AFTER INSERT 
ON rental
FOR EACH ROW
BEGIN
	UPDATE inventory
	SET stock = stock -1
		WHERE film_id = (
			SELECT film_id
			FROM inventory
			WHERE inventory_id = NEW.inventory_id
		)
		AND store_id = (
			SELECT store_id
			FROM customer
			WHERE customer_id = NEW.customer_id
		)
		AND inventory.stock > 0;

END //

DELIMITER ;


-- Ej 11 Cree una tabla `fines` que tenga dos campos: `rental_id` y `amount`. 
-- El primero es una clave foránea a la tabla rental y el segundo es un valor numérico con dos decimales.

CREATE TABLE IF NOT EXISTS fines (
  rental_id INT NOT NULL,
  amount DECIMAL(20,2),
  CONSTRAINT `fk_rental_id` FOREIGN KEY (rental_id) REFERENCES rental (rental_id) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE actor (
  actor_id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(45) NOT NULL,
  last_name VARCHAR(45) NOT NULL,
  last_update TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY  (actor_id),
  KEY idx_actor_last_name (last_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE city (
  city_id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
  city VARCHAR(50) NOT NULL,
  country_id SMALLINT UNSIGNED NOT NULL,
  last_update TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY  (city_id),
  KEY idx_fk_country_id (country_id),
  CONSTRAINT `fk_city_country` FOREIGN KEY (country_id) REFERENCES country (country_id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Ej 12 Cree un procedimiento `check_date_and_fine` que revise la tabla `rental` y 
-- cree un registro en la tabla `fines` por cada `rental` cuya devolución (return_date) haya 
-- tardado más de 3 días (comparación con rental_date). El valor de la multa será el número de 
-- días de retraso multiplicado por 1.5.

drop procedure if exists check_date_and_fine;

DELIMITER //

CREATE PROCEDURE check_date_and_fine()
BEGIN
    INSERT INTO fines (rental_id, amount) 
    SELECT 
        r.rental_id,
        (DATEDIFF(r.return_date, r.rental_date) - 3) * 1.5 AS amount
    FROM rental AS r
    WHERE r.return_date IS NOT NULL 
      AND DATEDIFF(r.return_date, r.rental_date) > 3;
END //

DELIMITER ;

CALL check_date_and_fine();

SELECT DATEDIFF(r.return_date , r.rental_date) AS diferencia_dias
FROM rental AS r
HAVING diferencia_dias > 3;

SELECT COUNT(*)
FROM rental AS r
WHERE DATEDIFF(r.return_date, r.rental_date) > 3;

SELECT COUNT(*)
FROM fines

-- Ej 13 Crear un rol `employee` que tenga acceso de inserción, eliminación y actualización a la tabla `rental`

CREATE ROLE employee;
GRANT DELETE,INSERT,UPDATE ON sakila.rental TO employee;


-- Ej 14 Revocar el acceso de eliminación a `employee` y crear un rol `administrator` 
-- que tenga todos los privilegios sobre la BD `sakila`.

REVOKE DELETE ON sakila.rental FROM 'employee';
CREATE ROLE administrator;
GRANT ALL PRIVILEGES ON sakila.* TO administrator;
FLUSH PRIVILEGES;

# 15 Crear dos roles de empleado. A uno asignarle los permisos de `employee` y al otro de `administrator`.

create role empleado1, empleado2;
grant administrator to empleado1;
grant employee to empleado2;




--- Ejercicios extra

# ej 1 Listar los 10 productos mas vendidos (por cantidad total)

SELECT pr.ProductName AS producto, sum(od.Quantity) AS cantidad
FROM `Order Details` AS od
JOIN Products AS pr ON od.ProductID = pr.ProductID
GROUP BY pr.ProductID, pr.ProductName
ORDER BY cantidad DESC 
LIMIT 10;
 

# ej 2 Listar los empleados junto a la cantidad total de ordenes que gestionaron (ordenado)

SELECT CONCAT(e.FirstName, ' ', e.LastName) AS empleado, COUNT(o.OrderID) AS ordenes_gestionadas
FROM Employees AS e
JOIN Orders AS o ON o.EmployeeID = e.EmployeeID
GROUP BY e.EmployeeID, e.FirstName, e.LastName
ORDER BY ordenes_gestionadas DESC


# ej 3 Monto total facturado por cada cliente

SELECT c.ContactName AS comprador, ROUND(SUM(od.Quantity * od.UnitPrice * (1 - od.Discount)), 2) AS cantidad_gastado
FROM `Order Details` AS od
JOIN Orders AS o ON od.OrderID = o.OrderID
JOIN Customers AS c ON o.CustomerID = c.CustomerID
GROUP BY c.ContactName, c.CustomerID
ORDER BY cantidad_gastado DESC

# ej 4 Crear un trigger que registre automáticamente el país en Orders (ShipCountry) según el cliente,
# en otras palabras, cuando se crea una orden, copiar el país del cliente antes de de insertar la orden.

DROP TRIGGER IF EXISTS copy_country

DELIMITER //

CREATE TRIGGER copy_country
BEFORE INSERT
ON Orders
FOR EACH ROW
BEGIN
		DECLARE client_country VARCHAR(15);

		SELECT Country INTO client_country
	    FROM Customers
	    WHERE CustomerID = NEW.CustomerID;
	    
	    SET NEW.ShipCountry = client_country;
END //

# Ej de tomas achaval de triggers

DELIMITER //
CREATE TRIGGER notify_host_after_booking
AFTER INSERT ON bookings
FOR EACH ROW
BEGIN
	INSERT INTO messages
         (sender_id, receiver_id, property_id, content, sent_at)
    SELECT NEW.user_id,
            p.owner_id,
            NEW.property_id,
            'Este usuario ha creado una reserva en tu propiedad!',
            NOW()
	FROM properties AS p
    WHERE p.id = NEW.property_id;
END //
DELIMITER ;

### DIF CLAVE: Trigger 1 (notify_host_after_booking)

Acción: Crea un nuevo registro en otra tabla (INSERT INTO messages).

Cuándo se usa: Cuando la acción genera un efecto secundario fuera de la tabla original (ej. enviar una notificación, guardar en un historial/auditoría).

Trigger 2 (copy_country)

Acción: Modifica un dato de la misma fila antes de guardarla (SET NEW.ShipCountry = ...).

Cuándo se usa: Cuando quieres autocompletar o transformar datos de la propia tupla que se está insertando (ej. llenar un campo que viene en NULL
usando información de otra tabla).
	
DELIMITER ;


# ej 1 Listar los 5 clientes con mas ingresos

WITH IngresosClientes AS (
	SELECT 
		o.CustomerID,
		SUM(od.Quantity * od.UnitPrice * (1 - od.Discount)) AS total_gastado
	FROM `Order Details` AS od
	JOIN Orders AS o ON od.OrderID = o.OrderID
	GROUP BY o.CustomerID
)
SELECT c.ContactName AS nombre, fc.total_gastado AS gastado
FROM IngresosClientes AS fc
JOIN Customers AS c ON c.CustomerID = fc.CustomerID 
GROUP BY c.ContactName, c.CustomerID
ORDER BY gastado DESC

# ej 2 Listar cada producto con sus ventas totales, agrupados por categoria

WITH ventas_totales AS (
	SELECT 
		p.ProductID,
        p.ProductName,
        p.CategoryID,
		ROUND(SUM(od.Quantity * od.UnitPrice * (1 - od.Discount)), 2) AS total_vendido
	FROM `Order Details` AS od
	JOIN Products AS p ON p.ProductID = od.ProductID
	GROUP BY p.CategoryID, p.ProductID, p.ProductName
)
SELECT 
	vt.ProductName AS producto, 
	c.CategoryName AS categoria, 
	vt.total_vendido AS ventas
FROM ventas_totales  AS vt
JOIN Categories AS c ON c.CategoryID = vt.CategoryID 
ORDER BY c.CategoryName, ventas

# ej 4 vista con empleados con mas ventas por año, mostrando empleado, año y total de ventas. Ordenar el resultdao asc
CREATE VIEW ventasTotalesView AS
WITH ventas_totales AS (
	SELECT 
		o.EmployeeID,
		YEAR(o.OrderDate) AS anio,
		ROUND(SUM(od.Quantity * od.UnitPrice * (1 - od.Discount)), 2) AS total_vendido
	FROM `Order Details` AS od
	JOIN Orders AS o ON o.OrderID = od.OrderID
	GROUP BY o.EmployeeID, YEAR(o.OrderDate)
)
SELECT 
	e.FirstName,
	e.LastName,
	vt.anio,
	vt.total_vendido
FROM ventas_totales AS vt 
JOIN Employees AS e ON e.EmployeeID = vt.EmployeeID 
ORDER BY anio, vt.total_vendido ASC


SELECT 
    v.FirstName,
    v.LastName,
    v.anio,
    v.total_vendido
FROM ventasTotalesView v
WHERE v.total_vendido = (
    SELECT MAX(v2.total_vendido)
    FROM ventasTotalesView v2
    WHERE v2.anio = v.anio
)
ORDER BY v.anio ASC;

# Solucion sin with

CREATE VIEW employeeOfTheYear AS 

WITH ventasOrdenadas AS (
    SELECT e.EmployeeID, YEAR(o.OrderDate) AS anio, 
        SUM(od.UnitPrice * od.Quantity * (1 - od.Discount)) AS total_de_ventas
    FROM employees AS e
    INNER JOIN orders AS o ON o.EmployeeID = e.EmployeeID
    INNER JOIN order_detail AS od ON od.OrderID = o.OrderID
    GROUP BY e.EmployeeID, anio
    ORDER BY anio, total_de_ventas ASC;
) 


SELECT Empleado, anio, total_de_ventas
FROM VentasOrdenadas v
WHERE total_de_ventas = (
    SELECT MAX(total_de_ventas)
    FROM VentasOrdenadas
    WHERE anio = v.anio
    )
ORDER BY anio;

# ej 5 Crear un trigger que se ejecute después de insertar un nuevo registro en la tabla Order Details.
# Este trigger debe actualizar la tabla Products para disminuir la cantidad en stock (UnitsInStock) del producto correspondiente,
# restando la cantidad (Quantity) que se acaba de insertar en el detalle del pedido.
# En este ej no puedo usar la subconsulta
# Regla de MySQL (Error 1093): No puedes usar un SELECT sobre la misma tabla que estás intentando modificar mediante un UPDATE o DELETE
# en la misma instrucción. Si la tabla que lees y la que modificas son distintas, funciona sin problemas.
# DROP TRIGGER IF EXISTS update_stock;

DELIMITER //

CREATE TRIGGER update_stock
AFTER INSERT ON `Order Details`
FOR EACH ROW
BEGIN 
    UPDATE Products
    SET UnitsInStock = UnitsInStock - NEW.Quantity
    WHERE ProductID = NEW.ProductID;
END //

DELIMITER ;

SELECT ProductID, ProductName, UnitsInStock 
FROM Products 
WHERE ProductID = 1;

SELECT MAX(OrderID) FROM Orders;

INSERT INTO `Order Details` (OrderID, ProductID, UnitPrice, Quantity, Discount)
VALUES (10248, 1, 18.00, 5, 0);

DELETE FROM `Order Details` 
WHERE OrderID = 10248 AND ProductID = 1;

-- Devuelves las 5 unidades manualmente

UPDATE Products 
SET UnitsInStock = UnitsInStock + 5 
WHERE ProductID = 1;

# Ej triggers parcial recuperatorio 2024 notificar si se recibio una reseña negativa

DELIMITER //

CREATE TRIGGER notify_host_after_bad_review
AFTER INSERT ON reviews
FOR EACH ROW
BEGIN
    IF NEW.rating <= 2 THEN
        INSERT INTO messages
             (sender_id, receiver_id, property_id, content, sent_at)
        SELECT NEW.user_id,
               p.owner_id,
               NEW.property_id,
               'Has recibido una reseña negativa en tu propiedad.',
               NOW()
        FROM properties AS p
        WHERE p.id = NEW.property_id;
    END IF;
END //

DELIMITER ;
