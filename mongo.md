# Restaurar una base de datos MongoDB desde un `.tar.gz` usando Docker

## Paso 1. Copiar el archivo al contenedor

Desde **PowerShell de Windows**, copiamos el archivo descargado al contenedor `mongo-labs`.

```powershell
docker cp "$HOME\Downloads\mflix.tar.gz" mongo-labs:/tmp/mflix.tar.gz
```

- `docker cp`: copia archivos entre Windows y Docker.
- `mongo-labs`: nombre del contenedor.
- `/tmp/mflix.tar.gz`: ruta de destino dentro del contenedor.

> **Importante:** verificá que el nombre y la ruta del archivo coincidan con los que te dieron en el parcial.

## Paso 2. Entrar al contenedor

```powershell
docker exec -it mongo-labs bash
```

Ahora deberías ver un prompt similar a:

```bash
root@26c20aadcb76:/#
```

A partir de acá, los siguientes comandos se ejecutan **dentro del contenedor**.

## Paso 3. Inspeccionar el archivo `.tar.gz`

Antes de extraer el archivo, revisamos su contenido:

```bash
tar -tzf /tmp/mflix.tar.gz | head -30
```

Por ejemplo, podría aparecer:

```text
mflix/
mflix/users.metadata.json.gz
mflix/theaters.bson.gz
mflix/movies.bson.gz
mflix/comments.bson.gz
```

Esto indica que el archivo contiene una carpeta `mflix/` con colecciones en formato BSON comprimidas individualmente.

> **Importante:** no todos los archivos `.tar.gz` tienen la misma estructura. Inspeccionarlos permite saber cómo restaurarlos.

## Paso 4. Extraer el archivo

Creamos una carpeta temporal para extraer el contenido:

```bash
mkdir -p /tmp/restore
```

Extraemos el archivo:

```bash
tar -xzf /tmp/mflix.tar.gz -C /tmp/restore
```

Comprobamos que los archivos se hayan extraído correctamente:

```bash
ls -lh /tmp/restore/mflix
```

Los archivos deberían quedar dentro de:

```text
/tmp/restore/mflix/
```

## Paso 5. Restaurar la base de datos
### 1 si es un bson
Ejecutamos `mongorestore` para importar las colecciones:

```bash
mongorestore --gzip --db=mflix /tmp/restore/mflix
```
### 2 si es un JSON que empieza con array

```bash
mongoimport --db=restaurant --collection=restaurants \
  --file=/tmp/restore/restaurantdb/restaurants.json \
  --jsonArray
```
### 3 si es un JSON que no empieza con array

```bash
mongoimport --db=restaurant --collection=restaurants \
  --file=/tmp/restore/restaurantdb/restaurants.json
```
**¿Qué significa cada opción?**

- `mongorestore`: restaura una base de datos desde archivos BSON.
- `--gzip`: indica que los archivos BSON están comprimidos con gzip.
- `--db=mflix`: establece el nombre de la base de datos de destino.
- `/tmp/restore/mflix`: indica dónde están los archivos que se van a importar.

Si el parcial indica otro nombre para la base de datos, reemplazá `mflix` por el nombre solicitado.

> **Nota:** en versiones recientes de MongoDB Database Tools, `--db` puede generar una advertencia de obsolescencia en determinados usos. Una advertencia no significa necesariamente que la restauración haya fallado.

## Paso 6. Verificar la importación

Entramos a la consola de MongoDB:

```bash
mongosh
```

Listamos las bases de datos:

```javascript
show dbs
```

Seleccionamos la base restaurada:

```javascript
use mflix
```

Listamos las colecciones:

```javascript
show collections
```

Finalmente, contamos los documentos de una colección para comprobar que se hayan importado:

```javascript
db.movies.countDocuments()
```

Si la restauración fue correcta, deberías obtener una cantidad de documentos mayor que cero.

## Resumen rápido para el parcial

| Objetivo | Comando |
|---|---|
| Copiar el archivo al contenedor | `docker cp` |
| Entrar al contenedor | `docker exec -it mongo-labs bash` |
| Inspeccionar el TAR | `tar -tzf /tmp/mflix.tar.gz` |
| Crear carpeta temporal | `mkdir -p /tmp/restore` |
| Extraer el TAR | `tar -xzf /tmp/mflix.tar.gz -C /tmp/restore` |
| Restaurar archivos BSON comprimidos | `mongorestore --gzip --db=mflix /tmp/restore/mflix` |
| Abrir la consola de MongoDB | `mongosh` |
| Listar bases de datos | `show dbs` |
| Seleccionar una base | `use mflix` |
| Listar colecciones | `show collections` |
| Contar documentos | `db.movies.countDocuments()` |

## Errores comunes

- **No encuentra el archivo:** verificá la ruta y el nombre usados en `docker cp`.
- **No existe la carpeta `/tmp/restore/mflix`:** revisá el contenido del TAR antes de asumir la estructura de carpetas.
- **Los archivos son `.bson.gz`:** utilizá `mongorestore --gzip`.
- **La base no aparece en `show dbs`:** verificá que la restauración haya terminado correctamente y que se hayan importado documentos.
- **La colección tiene otro nombre:** reemplazá `movies` en `db.movies.countDocuments()` por el nombre correcto.

**Regla clave:** primero inspeccionar, después extraer, luego restaurar y finalmente verificar.
