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




















