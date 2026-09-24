# SQL CHEATSHEET — MySQL

## USE
Selecciona la base de datos.

    USE world;


## SELECT
Consulta y muestra datos de una o más tablas.

    SELECT Name, Population
    FROM city;

    SELECT *
    FROM city;


## FROM
Indica la tabla de donde se obtienen los datos.

    FROM city;


## WHERE
Filtra las filas según una condición.

    WHERE Population > 1000000;


## AND
Exige que se cumplan todas las condiciones.

    WHERE CountryCode = 'ARG'
    AND District = 'Córdoba';


## OR
Permite que se cumpla cualquiera de las condiciones.

    WHERE Continent = 'Asia'
    OR Continent = 'Europe';


## IN
Comprueba si un valor pertenece a una lista de valores.

    WHERE Name IN ('Cairo', 'Mumbai', 'Sydney');


## BETWEEN
Busca valores dentro de un rango.

    WHERE Population BETWEEN 35000000 AND 45000000;


## LIKE
Busca texto utilizando patrones.

    WHERE Name LIKE '%York%';

    %York% → contiene York
    A%     → empieza con A
    %a     → termina con a


## IS NULL / IS NOT NULL
Comprueba si una columna tiene o no tiene valor.

    WHERE IndepYear IS NULL;

    WHERE IndepYear IS NOT NULL;


## JOIN
Combina filas de diferentes tablas relacionadas.

    SELECT country.Name, countrylanguage.Language
    FROM country
    JOIN countrylanguage
        ON country.Code = countrylanguage.CountryCode;


## ON
Define la condición que relaciona las tablas de un JOIN.

    ON country.Code = countrylanguage.CountryCode;


## ORDER BY
Ordena los resultados.

    ORDER BY Population ASC;

    ORDER BY Population DESC;

    ASC  → ascendente
    DESC → descendente


## LIMIT
Limita la cantidad de filas devueltas.

    LIMIT 10;


## AS
Crea un alias para cambiar el nombre mostrado de una columna o tabla.

    SELECT Name AS Pais
    FROM country;


## INSERT INTO
Agrega una nueva fila a una tabla.

    INSERT INTO city
        (Name, CountryCode, District, Population)
    VALUES
        ('Nueva Ciudad', 'ARG', 'Córdoba', 50000);


## UPDATE
Modifica datos existentes.

    UPDATE continent
    SET LargestCity = 2515
    WHERE Name = 'North America';


## SET
Indica qué valor se modifica mediante UPDATE.

    SET LargestCity = 2515;


## DELETE
Elimina filas de una tabla.

    DELETE FROM city
    WHERE CountryCode = 'ARG';


## CREATE TABLE
Crea una nueva tabla y define su estructura.

    CREATE TABLE ejemplo (
        ID INT PRIMARY KEY,
        Name VARCHAR(50),
        Population INT
    );


## ALTER TABLE
Modifica la estructura de una tabla existente.

    ALTER TABLE country
    ADD NuevaColumna INT;


## DROP TABLE
Elimina una tabla completa.

    DROP TABLE continent;


## TRUNCATE TABLE
Elimina todas las filas de una tabla manteniendo su estructura.

    TRUNCATE TABLE continent;


## PRIMARY KEY
Identifica de forma única cada fila de una tabla.

    PRIMARY KEY (Code);


## FOREIGN KEY
Establece una relación entre una columna y otra tabla.

    FOREIGN KEY (CountryCode)
    REFERENCES country(Code);


## REFERENCES
Indica la tabla y columna a la que apunta una FOREIGN KEY.

    REFERENCES country(Code);


## CONSTRAINT
Permite definir y nombrar restricciones de una tabla.

    CONSTRAINT fk_country
    FOREIGN KEY (CountryCode)
    REFERENCES country(Code);


## AUTO_INCREMENT
Genera automáticamente números consecutivos para una columna.

    ID INT AUTO_INCREMENT PRIMARY KEY;


## NOT NULL
Impide que una columna tenga valores NULL.

    Name VARCHAR(50) NOT NULL;


## UNIQUE
Impide que un valor se repita en una columna.

    LargestCity INT UNIQUE;


## DEFAULT
Establece un valor predeterminado.

    Percentage DECIMAL(4,1) DEFAULT 0.0;


## CHECK
Establece una condición que deben cumplir los valores.

    CHECK (Area > 0);


## SUBCONSULTA
Es un SELECT dentro de otra consulta y permite utilizar su resultado.

    SELECT ID
    FROM city
    WHERE Name = 'Ciudad de México'
    AND CountryCode = 'MEX';


## OPERADORES
    =       igual
    <>      distinto
    >       mayor
    <       menor
    >=      mayor o igual
    <=      menor o igual


## TIPOS DE DATOS
    INT             → números enteros
    DECIMAL(x,y)    → números decimales
    CHAR(n)         → texto de longitud fija
    VARCHAR(n)      → texto de longitud variable
    DATE            → fechas
    ENUM(...)       → valores de una lista definida


## ORDEN DE UNA CONSULTA
    SELECT → qué mostrar
    FROM → de dónde obtenerlo
    JOIN → qué tablas relacionar
    ON → cómo relacionarlas
    WHERE → qué filas seleccionar
    ORDER BY → cómo ordenar
    LIMIT → cuántas filas devolver


## WORLD DATABASE — RELACIONES

    country.Code
        ↑
        ├── city.CountryCode
        └── countrylanguage.CountryCode

    continent.Name
        ↑
        └── country.Continent

    city.ID
        ↑
        └── continent.LargestCity

# =========================
# DOCKER
# =========================

## docker --version
Muestra la versión instalada de Docker.

    docker --version


## docker ps
Muestra los contenedores que están ejecutándose.

    docker ps


## docker ps -a
Muestra todos los contenedores, incluidos los detenidos.

    docker ps -a


## docker images
Muestra las imágenes descargadas/locales.

    docker images


## docker pull
Descarga una imagen desde un registry.

    docker pull mysql


## docker run
Crea y ejecuta un contenedor a partir de una imagen.

    docker run mysql


## docker run -d
Ejecuta el contenedor en segundo plano.

    docker run -d mysql


## docker run --name
Asigna un nombre al contenedor.

    docker run --name mysql-db mysql


## docker run -p
Mapea un puerto del host al contenedor.

    docker run -p 3306:3306 mysql

    HOST:CONTAINER


## docker run -e
Define variables de entorno.

    docker run -e MYSQL_ROOT_PASSWORD=1234 mysql


## Ejemplo típico de MySQL

    docker run -d \
      --name mysql-db \
      -p 3306:3306 \
      -e MYSQL_ROOT_PASSWORD=1234 \
      mysql


## docker start
Inicia un contenedor detenido.

    docker start mysql-db


## docker stop
Detiene un contenedor.

    docker stop mysql-db


## docker restart
Reinicia un contenedor.

    docker restart mysql-db


## docker rm
Elimina un contenedor detenido.

    docker rm mysql-db


## docker rm -f
Fuerza la eliminación de un contenedor.

    docker rm -f mysql-db


## docker logs
Muestra los logs del contenedor.

    docker logs mysql-db


## docker logs -f
Muestra los logs en tiempo real.

    docker logs -f mysql-db


## docker exec
Ejecuta un comando dentro de un contenedor.

    docker exec -it mysql-db bash


## docker exec + MySQL
Entra directamente al cliente de MySQL.

    docker exec -it mysql-db mysql -u root -p


## docker inspect
Muestra información detallada del contenedor.

    docker inspect mysql-db


# =========================
# DOCKER COMPOSE
# =========================

## docker compose up
Crea e inicia los servicios definidos en docker-compose.yml.

    docker compose up


## docker compose up -d
Inicia los servicios en segundo plano.

    docker compose up -d


## docker compose down
Detiene y elimina los contenedores creados por Compose.

    docker compose down


## docker compose ps
Muestra los servicios/contenedores del proyecto.

    docker compose ps


## docker compose logs
Muestra los logs.

    docker compose logs


## docker compose logs -f
Muestra los logs en tiempo real.

    docker compose logs -f


## docker compose build
Construye las imágenes definidas en el Compose.

    docker compose build


## docker compose restart
Reinicia los servicios.

    docker compose restart


# =========================
# CONCEPTOS DOCKER
# =========================

## IMAGE
Plantilla utilizada para crear contenedores.

    IMAGE → crea → CONTAINER


## CONTAINER
Instancia ejecutándose de una imagen.

    Image: mysql
        ↓
    Container: mysql-db


## PORT MAPPING
Conecta un puerto de tu PC con un puerto del contenedor.

    -p 3306:3306

    PC:3306 → Docker:3306


## VOLUME
Permite guardar datos fuera del ciclo de vida del contenedor.

    -v mysql_data:/var/lib/mysql


## NETWORK
Permite que diferentes contenedores se comuniquen.

    docker network ls


## ENVIRONMENT VARIABLES
Configuraciones pasadas al contenedor.

    -e MYSQL_ROOT_PASSWORD=1234


# =========================
# COMANDOS PARA RECORDAR
# =========================

    docker ps              → contenedores activos
    docker ps -a           → todos los contenedores
    docker images          → imágenes
    docker pull            → descargar imagen
    docker run             → crear + ejecutar
    docker start           → iniciar
    docker stop            → detener
    docker restart         → reiniciar
    docker rm              → eliminar contenedor
    docker logs            → ver logs
    docker exec            → ejecutar comando dentro
    docker compose up      → levantar proyecto
    docker compose down    → bajar proyecto


# =========================
# IDEA GENERAL
# =========================

    IMAGE
      ↓
    CONTAINER
      ↓
    PROCESO / APLICACIÓN

    Docker permite ejecutar aplicaciones
    aisladas en contenedores.

    MySQL puede ejecutarse dentro de un
    contenedor Docker y podemos conectarnos
    a él mediante el puerto 3306.


# Practico 3

USE world;

  

--- Practico 3

  

--- ej 1 Lista el nombre de la ciudad, nombre del país, región y forma de gobierno de las 10 ciudades más pobladas del mundo.

  

SELECT

city.Name,

country.Name,

country.Region,

country.GovernmentForm

FROM city

JOIN country ON city.CountryCode = country.Code

ORDER BY city.Population DESC

LIMIT 10;

  

--- ej 2 Listar los 10 países con menor población del mundo, junto a sus ciudades capitales (Hint: puede que uno de estos países no tenga ciudad capital asignada, en este caso deberá mostrar "NULL").

  

SELECT

country.Name,

country.Population,

city.Name AS Capital

FROM country

LEFT JOIN city ON country.Capital = city.ID

ORDER BY country.Population ASC

LIMIT 10;

  

--- EJ 3 Listar el nombre, continente y todos los lenguajes oficiales de cada país. (Hint: habrá más de una fila por país si tiene varios idiomas oficiales).

  

SELECT

country.Name AS Country,

countrylanguage.Language,

country.Continent

FROM country

JOIN countrylanguage ON countrylanguage.CountryCode = country.Code

WHERE countrylanguage.IsOfficial = 'T'

  

--- EJ 4 Listar el nombre del país y nombre de capital, de los 20 países con mayor superficie del mundo.

  

SELECT

country.Name AS pais,

city.Name AS Capital

FROM country

JOIN city ON country.Capital = city.ID

ORDER BY country.SurfaceArea DESC

LIMIT 20;

  

  

--- Ej 5 Listar las ciudades junto a sus idiomas oficiales (ordenado por la población de la ciudad) y el porcentaje de hablantes del idioma.

  

SELECT

city.Name AS Ciudad,

countrylanguage.Percentage AS Porcentaje_de_hablantes,

countrylanguage.Language AS Idioma

FROM city

JOIN countrylanguage ON countrylanguage.CountryCode = city.CountryCode

WHERE countrylanguage.IsOfficial = 'T'

ORDER BY city.Population DESC

  

--- Ej 6 Listar los 10 países con mayor población y los 10 países con menor población (que tengan al menos 100 habitantes) en la misma consulta.

(

SELECT

country.Name AS Pais,

country.Population

FROM country

ORDER BY country.Population DESC

LIMIT 10

)

UNION

(

SELECT

country.Name AS Pais,

country.Population

FROM country

WHERE country.Population > 100

ORDER BY country.Population ASC

LIMIT 10

);

  

--- Ej 7 Listar aquellos países cuyos lenguajes oficiales son el Inglés y el Francés (hint: no debería haber filas duplicadas).

  

SELECT

Name AS Pais

FROM country

JOIN countrylanguage ON countrylanguage.CountryCode = country.Code

WHERE countrylanguage.Language IN ('French', 'English')

GROUP BY country.Code, country.Name

HAVING COUNT(DISTINCT countrylanguage.Language) = 2;

  

--- Ej 8 Listar aquellos países que tengan hablantes del Inglés pero no del Español en su población.

  

SELECT country.Name AS Pais

FROM country

JOIN countrylanguage

ON country.Code = countrylanguage.CountryCode

GROUP BY country.Code, country.Name

HAVING

SUM(countrylanguage.Language = 'English') > 0

AND

SUM(countrylanguage.Language = 'Spanish') = 0;

  

  

--- Part2 Ej 1 Tiran la misma salida? Porque?

  

SELECT city.Name, country.Name

FROM city

INNER JOIN country ON city.CountryCode = country.Code AND country.Name = 'Argentina';

  

SELECT city.Name, country.Name

FROM city

INNER JOIN country ON city.CountryCode = country.Code

WHERE country.Name = 'Argentina';

  

-- 1. Con INNER JOIN, ambas consultas devuelven los mismos valores.

-- La primera filtra por país directamente en el ON del JOIN,

-- mientras que la segunda hace el JOIN y luego filtra con WHERE.

-- Como INNER JOIN solo conserva las filas que tienen coincidencia,

-- el resultado final es el mismo.

  

-- Si en vez de INNER JOIN usamos LEFT JOIN, las consultas NO devuelven

-- los mismos valores.

-- En la primera, la condición country.Name = 'Argentina' está en el ON,

-- por lo que se conservan todas las ciudades de la tabla de la izquierda;

-- las que no pertenecen a Argentina quedan con NULL en los datos de country.

-- En la segunda, el WHERE country.Name = 'Argentina' elimina las filas

-- que no sean de Argentina, por lo que solo quedan las ciudades argentinas.

  

SELECT city.Name, country.Name

FROM city

LEFT JOIN country ON city.CountryCode = country.Code AND country.Name = 'Argentina';

  

SELECT city.Name, country.Name

FROM city

LEFT JOIN country ON city.CountryCode = country.Code

WHERE country.Name = 'Argentina';


### intersec

query1 INTERSECT [ALL | DISTINCT] query2;

### minus

SELECT select_list1 FROM table_name1 MINUS SELECT select_list2 FROM table_name2;


UNION
→ A + B
→ todo lo que está en cualquiera de las dos

INTERSECT
→ A ∩ B
→ lo que está en AMBAS

EXCEPT / MINUS
→ A − B
→ lo que está en A PERO NO en B

EXCEPT / MINUS:
- Devuelve las filas de la primera consulta que NO aparecen en la segunda.
- A − B = elementos de A que no están en B.
- Ambas consultas deben tener igual cantidad y orden de columnas,
  con tipos compatibles.
- EXCEPT elimina duplicados por defecto.
- En MySQL, EXCEPT está disponible desde 8.0.31.
- En versiones anteriores se puede simular con LEFT JOIN + IS NULL.

INTERSECT:
- Devuelve las filas que aparecen en ambas consultas.
- A ∩ B = elementos comunes a A y B.
- Ambas consultas deben tener igual cantidad y orden de columnas,
  con tipos compatibles.
- INTERSECT elimina duplicados por defecto.
- INTERSECT ALL conserva duplicados.
- Disponible en MySQL desde 8.0.31.

UNION:
- Combina los resultados de dos consultas.
- UNION elimina duplicados por defecto.
- UNION ALL conserva duplicados.

Para "países con English pero NO Spanish":
    países con English
    EXCEPT
    países con Spanish


## Practico 2 y 3

USE world;

  

--- Practico 3

  

--- ej 1 Lista el nombre de la ciudad, nombre del país, región y forma de gobierno de las 10 ciudades más pobladas del mundo.

  

SELECT

city.Name,

country.Name,

country.Region,

country.GovernmentForm

FROM city

JOIN country ON city.CountryCode = country.Code

ORDER BY city.Population DESC

LIMIT 10;

  

--- ej 2 Listar los 10 países con menor población del mundo, junto a sus ciudades capitales (Hint: puede que uno de estos países no tenga ciudad capital asignada, en este caso deberá mostrar "NULL").

  

SELECT

country.Name,

country.Population,

city.Name AS Capital

FROM country

LEFT JOIN city ON country.Capital = city.ID

ORDER BY country.Population ASC

LIMIT 10;

  

--- EJ 3 Listar el nombre, continente y todos los lenguajes oficiales de cada país. (Hint: habrá más de una fila por país si tiene varios idiomas oficiales).

  

SELECT

country.Name AS Country,

countrylanguage.Language,

country.Continent

FROM country

JOIN countrylanguage ON countrylanguage.CountryCode = country.Code

WHERE countrylanguage.IsOfficial = 'T'

  

--- EJ 4 Listar el nombre del país y nombre de capital, de los 20 países con mayor superficie del mundo.

  

SELECT

country.Name AS pais,

city.Name AS Capital

FROM country

JOIN city ON country.Capital = city.ID

ORDER BY country.SurfaceArea DESC

LIMIT 20;

  

  

--- Ej 5 Listar las ciudades junto a sus idiomas oficiales (ordenado por la población de la ciudad) y el porcentaje de hablantes del idioma.

  

SELECT

city.Name AS Ciudad,

countrylanguage.Percentage AS Porcentaje_de_hablantes,

countrylanguage.Language AS Idioma

FROM city

JOIN countrylanguage ON countrylanguage.CountryCode = city.CountryCode

WHERE countrylanguage.IsOfficial = 'T'

ORDER BY city.Population DESC

  

--- Ej 6 Listar los 10 países con mayor población y los 10 países con menor población (que tengan al menos 100 habitantes) en la misma consulta.

(

SELECT

country.Name AS Pais,

country.Population

FROM country

ORDER BY country.Population DESC

LIMIT 10

)

UNION

(

SELECT

country.Name AS Pais,

country.Population

FROM country

WHERE country.Population > 100

ORDER BY country.Population ASC

LIMIT 10

);

  

--- Ej 7 Listar aquellos países cuyos lenguajes oficiales son el Inglés y el Francés (hint: no debería haber filas duplicadas).

  

SELECT

Name AS Pais

FROM country

JOIN countrylanguage ON countrylanguage.CountryCode = country.Code

WHERE countrylanguage.Language IN ('French', 'English')

GROUP BY country.Code, country.Name

HAVING COUNT(DISTINCT countrylanguage.Language) = 2;

  

--- Ej 8 Listar aquellos países que tengan hablantes del Inglés pero no del Español en su población.

  

SELECT country.Name AS Pais

FROM country

JOIN countrylanguage

ON country.Code = countrylanguage.CountryCode

WHERE countrylanguage.Language = 'English'

  

EXCEPT

  

SELECT country.Name AS Pais

FROM country

JOIN countrylanguage

ON country.Code = countrylanguage.CountryCode

WHERE countrylanguage.Language = 'Spanish';

  

  

--- Part2 Ej 1 Tiran la misma salida? Porque?

  

SELECT city.Name, country.Name

FROM city

INNER JOIN country ON city.CountryCode = country.Code AND country.Name = 'Argentina';

  

SELECT city.Name, country.Name

FROM city

INNER JOIN country ON city.CountryCode = country.Code

WHERE country.Name = 'Argentina';

  

-- 1. Con INNER JOIN, ambas consultas devuelven los mismos valores.

-- La primera filtra por país directamente en el ON del JOIN,

-- mientras que la segunda hace el JOIN y luego filtra con WHERE.

-- Como INNER JOIN solo conserva las filas que tienen coincidencia,

-- el resultado final es el mismo.

  

-- Si en vez de INNER JOIN usamos LEFT JOIN, las consultas NO devuelven

-- los mismos valores.

-- En la primera, la condición country.Name = 'Argentina' está en el ON,

-- por lo que se conservan todas las ciudades de la tabla de la izquierda;

-- las que no pertenecen a Argentina quedan con NULL en los datos de country.

-- En la segunda, el WHERE country.Name = 'Argentina' elimina las filas

-- que no sean de Argentina, por lo que solo quedan las ciudades argentinas.

  

SELECT city.Name, country.Name

FROM city

LEFT JOIN country ON city.CountryCode = country.Code AND country.Name = 'Argentina';

  

SELECT city.Name, country.Name

FROM city

LEFT JOIN country ON city.CountryCode = country.Code

WHERE country.Name = 'Argentina';

  

  

--- Practico 4 ---

  

--- EJ 1 Listar el nombre de la ciudad y el nombre del país de todas las ciudades que pertenezcan a países con una población menor a 10000 habitantes. ---

  

SELECT c.Name AS city, country.Name AS country, Population AS deau

FROM city AS c, (

SELECT Code, Name

FROM country

WHERE Population < 10000

) AS country

WHERE c.CountryCode = country.Code

ORDER BY Population DESC

  

--- Alternativa con JOIN sin subqueries

  

select city.Name, country.Name

FROM city JOIN country

ON country.Population < 10000 AND city.CountryCode = country.Code;

  

--- Ej 2 Listar todas aquellas ciudades cuya población sea mayor que la población promedio entre todas las ciudades. ---

  

SELECT Name

FROM city

WHERE Population > (

SELECT AVG(Population)

FROM city

);

  

--- Opcion 2 ---

  

SELECT Name, Population

FROM city

WHERE Population > ALL (

SELECT AVG(Population)

FROM city

);

  

  

--- Ej 3 Listar todas aquellas ciudades no asiáticas cuya población sea igual o mayor a la población total de algún país de Asia.

  

SELECT city.Name AS city, country.Population

FROM country

JOIN city ON city.CountryCode = country.Code AND NOT (country.Continent = 'Asia')

WHERE city.Population >= (

SELECT Population

FROM country

WHERE Code = 'OMN'

)

ORDER BY country.Population DESC

  

SELECT Name, Population, Code

FROM country

WHERE country.Continent = 'Asia'

ORDER BY country.Population DESC;

  

SELECT city.Name, city.Population

FROM city

JOIN country ON country.Code = city.CountryCode

WHERE country.Code = 'ARG'

  

--- Ej 4 Listar aquellos países junto a sus idiomas no oficiales, que superen en porcentaje de hablantes a cada uno de los idiomas oficiales del país.

  

SELECT country.Name, countrylanguage.language

FROM country

JOIN countrylanguage ON countrylanguage.CountryCode = country.Code AND IsOfficial = 'F'

WHERE countrylanguage.Percentage > ALL (

SELECT sbq_lgn.Percentage

FROM countrylanguage AS sbq_lgn

WHERE sbq_lgn.CountryCode = countrylanguage.CountryCode AND isOfficial = 'T'

)

  

SELECT * FROM countrylanguage WHERE CountryCode = 'ATG'; --- Chequeo y da ATG Creole English F 95.7 ATG English T 0.0

  

SELECT Percentage FROM countrylanguage WHERE isOfficial = 'T';

  

--- Ej 5 Listar (sin duplicados) aquellas regiones que tengan países con una superficie menor a 1000 km2 y exista (en el país) al menos una ciudad con más de 100000 habitantes. (Hint: Esto puede resolverse con o sin una subquery, intenten encontrar ambas respuestas)

  

SELECT region

FROM country

JOIN city ON country.Code = city.CountryCode AND SurfaceArea < 1000 AND city.Population > 100000

GROUP BY region

  

--- alternativa con subqueries

  

SELECT DISTINCT region

FROM country

WHERE SurfaceArea < 1000

AND Code IN (

SELECT CountryCode

FROM city

WHERE Population > 100000

);

  

--- Ej 7 Listar aquellos países y sus lenguajes no oficiales cuyo porcentaje de hablantes sea mayor al promedio de hablantes de los lenguajes oficiales.

  

SELECT country.Name, countrylanguage.language

FROM country

JOIN countrylanguage ON countrylanguage.CountryCode = country.Code AND IsOfficial = 'F'

WHERE countrylanguage.Percentage > (

SELECT avg(sbq_lgn.Percentage) AS percentage_lang

FROM countrylanguage AS sbq_lgn

WHERE sbq_lgn.CountryCode = countrylanguage.CountryCode AND isOfficial = 'T'

)

  

  

--- Ej 6 Listar el nombre de cada país con la cantidad de habitantes de su ciudad más poblada. (Hint: Hay dos maneras de llegar al mismo resultado. Usando consultas escalares o usando agrupaciones, encontrar ambas).

  

SELECT ct.Name, c.Population AS top_city

FROM country AS ct

JOIN city AS c ON c.CountryCode = ct.Code

WHERE c.Population = (SELECT max(c_city.Population) FROM city AS c_city WHERE c_city.CountryCode = ct.Code); --- WHERE c_city.CountryCode = ct.Code es lo que hace que no busque en todas las ciudades del mundo sino solo en la que matchea con el codigo del pais que estoy viendo

  

--- Ej 8 Listar la cantidad de habitantes por continente ordenado en forma descendente.

  

SELECT country.Continent, sum(country.Population) AS sumi

FROM country

GROUP BY country.Continent

ORDER BY sumi DESC;

  

--- Ej 9 Listar el promedio de esperanza de vida (LifeExpectancy) por continente con una esperanza de vida entre 40 y 70 años.

  

SELECT country.Continent, avg(country.LifeExpectancy) AS laif

FROM country

GROUP BY country.Continent

HAVING laif > 40 AND laif < 70 -- Se usa having porque se tiene que elegir despues de agrupar, where es antes, por tanto con where solo elijo filas sin haber hecho el avg

  

--- Ej 10 Listar la cantidad máxima, mínima, promedio y suma de habitantes por continente.

  

SELECT country.Continent, sum(country.Population) AS total_habitantes, min(country.Population) AS minimo, max(country.Population) AS maximo, avg(country.Population) AS promedio

FROM country

GROUP BY country.Continent
