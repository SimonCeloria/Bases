Para copiar un archivo en mi dockeriño y eso:

docker cp "$HOME\Downloads\mflix.tar.gz" mongo-labs:/tmp/mflix.tar

Paso 2. Entrar al contenedor
docker exec -it mongo-labs bash


Ahora deberías ver un prompt similar a:
root@26c20aadcb76:/#

Paso 4. Inspeccionar el .tar.gz
Antes de extraerlo, mirá qué contiene:
tar -tzf /tmp/mflix.tar.gz | head -30


En nuestro caso apareció algo así:
mflix/
mflix/users.metadata.json.gz
mflix/theaters.bson.gz
mflix/movies.bson.gz
mflix/comments.bson.gz


Esto nos indica que el TAR contiene archivos BSON comprimidos individualmente.
Importante: no todos los .tar.gz tienen la misma estructura. Este paso te permite identificarla.
Paso 5. Extraer el archivo
Creamos una carpeta temporal:
mkdir -p /tmp/restore


Extraemos el TAR:
tar -xzf /tmp/mflix.tar.gz -C /tmp/restore


Ahora los archivos deberían estar en:
/tmp/restore/mflix/


Podés comprobarlo con:
ls -lh /tmp/restore/mflix


Paso 6. Restaurar la base de datos
Como los archivos .bson.gz están comprimidos, usamos --gzip.
mongorestore --gzip --db=mflix /tmp/restore/mflix


Esto restaura las colecciones en la base mflix.
Si el nombre de la base debe ser otro, reemplazá mflix por el nombre que indique el parcial.
La opción --db puede mostrar una advertencia de que está obsoleta para ciertos usos, pero no necesariamente es un error. En versiones recientes también se puede usar --nsInclude.
Paso 7. Verificar la importación
Entrá en la shell de MongoDB si todavía no estás:
mongosh


Después ejecutá:
show dbs
