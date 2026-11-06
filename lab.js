// Seleccionar la base de datos
use("mflix");

# PRACTICO 7

# ej  1 
Insertar 5 nuevos usuarios en la colección users. Para cada nuevo usuario creado, insertar al menos un comentario realizado por el usuario en la colección comments.

db.users.insertMany(
    [
        {
            "name": "Simon", "email" : "simon@gmail.com", "password" : "pepe1"
        },
        {
            "name" : "Fer", "email" : "Fer@gmail.com", "password" : "pepe2"
        },
        {
            "name" : "Lalo", "email" : "Lalo@gmail.com", "password" : "pepe3"
        },
        {
            "name" : "Kmi", "email" : "Kmi@gmail.com", "password" : "pepe4"
        },
        {
            "name" : "Anal", "email" : "Anal@gmail.com", "password" : "pepe5"
        }
    ]
)

> db.comments.findOne()

{
  _id: ObjectId('5a9427648b0beebeb69579cc'),
  name: 'Andrea Le',
  email: 'andrea_le@fakegmail.com',
  movie_id: ObjectId('573a1390f29313caabcd418c'),
  text: 'Rem officiis eaque repellendus amet eos doloribus. Porro dolor voluptatum voluptates neque culpa molestias. Voluptate unde
  date: ISODate('2012-03-26T23:20:16.000Z')
}

> db.comments.insertOne({name: "Simon", email: "celoriasimon@gmail.com", movie_id: ObjectId('573a1390f29313caabcd418c'), text: "olis",

    {
  acknowledged: true,
  insertedId: ObjectId('6ad56df6fc22b82dc5fb6564')
}

> db.comments.find().sort({_id: -1}).limit(1);

{
  _id: ObjectId('6ad56df6fc22b82dc5fb6564'),
  name: 'Simon',
  email: 'celoriasimon@gmail.com',
  movie_id: ObjectId('573a1390f29313caabcd418c'),
  text: 'olis',
  date: ISODate('2026-10-19T01:10:14.344Z')
}

# ej 2 Listar el título, año, actores (cast), directores y rating de las 10 películas con mayor rating (“imdb.rating”) de la década del 90. ¿Cuál es el valor del rating de la película que tiene mayor rating? (Hint: Chequear que el valor de “imdb.rating” sea de tipo “double”).

db.movies.find(
    {
        year: {
            $gte: 1990,
            $lte: 2000
        },
        "imdb.rating": {
            $type: "double"
        }    
    },
    {
        _id: 0,
        title: 1,
        year: 1,
        cast: 1,
        directors: 1,
        "imdb.rating": 1
    }
)
.sort({"imdb.rating": -1})
.limit(10);

# ej 3 Listar el nombre, email, texto y fecha de los comentarios que la película con id (movie_id) ObjectId("573a1399f29313caabcee886") recibió entre los años 2014 y 2016 inclusive. Listar ordenados por fecha. Escribir una nueva consulta (modificando la anterior) para responder ¿Cuántos comentarios recibió?

db.comments.find(
    {
        movie_id: ObjectId("573a1399f29313caabcee886"),
        date: {
            $gte: new Date("2014-01-01"),
            $lt: new Date("2017-01-01")
        }
    },
    {
        _id: 0,
        name: 1,
        email: 1,
        text: 1,
        date: 1
    }
).sort({ date: 1 });

db.comments.countDocuments(
    {
        movie_id: ObjectId("573a1399f29313caabcee886"),
        date: {
            $gte: new Date("2014-01-01"),
            $lt: new Date("2017-01-01")
        }
    }
).sort({ date: 1 });

# ej 4 Listar el nombre, id de la película, texto y fecha de los 3 comentarios más recientes realizados por el usuario con email patricia_good@fakegmail.com. 

db.comments.find(
    {
        email: "patricia_good@fakegmail.com",
    },
    {
        movie_id: 1,
        name: 1,
        email: 1,
        text: 1,
        date: 1
    }
).sort({ date: -1 }).limit(3);

# ej 5 Listar el título, idiomas (languages), géneros, fecha de lanzamiento (released) y número de votos (“imdb.votes”) de las películas de géneros Drama y Action (la película puede tener otros géneros adicionales), que solo están disponibles en un único idioma y por último tengan un rating (“imdb.rating”) mayor a 9 o bien tengan una duración (runtime) de al menos 180 minutos. Listar ordenados por fecha de lanzamiento y número de votos.

db.movies.find(
    {
        genres: {$all: ["Drama","Action"]},
        languages: {$size: 1},
        $or: [
            {"imdb.rating": {$gt:9}},
            {runtime: {$gte:180}}
        ]
    },
    {
        _id: 0,
        title: 1,
        genres: 1,
        released: 1,
        languages: 1,
        "imdb.votes": 1
    }
).sort({
  released: 1,
  "imdb.votes": 1
});


# ej 6  Listar el id del teatro (theaterId), estado (“location.address.state”), ciudad (“location.address.city”), y coordenadas (“location.geo.coordinates”) de los teatros que se encuentran en algunos de los estados "CA", "NY", "TX" y el nombre de la ciudades comienza con una ‘F’. Listar ordenados por estado y ciudad.

db.theaters.find(
    {
        "location.address.state": {$in: ["CA","NY","TX"]},
        "location.address.city": { $regex: /^F/ }
    },
    {
        theaterId: 1,
        "location.geo.coordinates": 1,
        "location.address.city": 1,
        "location.address.state": 1
    }
).sort({
  "location.address.state": 1,
  "location.address.city": 1
});

# ej 7 Actualizar los valores de los campos texto (text) y fecha (date) del comentario cuyo id es ObjectId("5b72236520a3277c015b3b73") a "mi mejor comentario" y fecha actual respectivamente.

db.comments.updateOne(
    {
        _id: ObjectId("5b72236520a3277c015b3b73"),
    },
    { 
        $set: { "name": "este mejor comentario" },
        $currentDate: { date: true }
    }
)

# ej 8 Actualizar el valor de la contraseña del usuario cuyo email es joel.macdonel@fakegmail.com a "some password". La misma consulta debe poder insertar un nuevo usuario en caso que el usuario no exista. Ejecute la consulta dos veces. ¿Qué operación se realiza en cada caso?  (Hint: usar upserts). 

db.users.updateOne(
    {
        email: "joel.macdonel@fakegmail.com"
    },
    {
        $set: {
            password: "some password"
        }
    },
    {
        upsert: true
    }
);

# ej 9 Remover todos los comentarios realizados por el usuario cuyo email es victor_patel@fakegmail.com durante el año 1980.

db.comments.deleteMany({
    email: "victor_patel@fakegmail.com",
    date: {
        $gte: ISODate("1980-01-01T00:00:00.000Z"),
        $lt: ISODate("1981-01-01T00:00:00.000Z")
    }
});


# ej 10 Listar el id del restaurante (restaurant_id) y las calificaciones de los restaurantes donde al menos una de sus calificaciones haya sido realizada entre 2014 y 2015 inclusive, y que tenga una puntuación (score) mayor a 70 y menor o igual a 90.

db.restaurants.find(
    {
        grades: {
            $elemMatch: {
                date: {
                    $gte: ISODate("2014-01-01T00:00:00Z"),
                    $lt: ISODate("2016-01-01T00:00:00Z")
                },
                score: {
                    $gt: 70,
                    $lte: 90
                }
            }
        }
    },
    {
        _id: 0,
        restaurant_id: 1,
        grades: 1
    }
);

estructura:

_id: ObjectId('6ad812af678c355e6d417736')

address: Object (4)
borough: "Queens"
cuisine: "American"

grades: Array (4)

        0: Object (3)
                date: ISODate('2014-11-15T00:00:00.000+00:00')
                grade: "Z"
                score: 38

        1: Object (3)

        2: Object (3)

        3: Object (3)
name: "Brunos On The Boulevard"
restaurant_id: "40356151"

# ej 11 Agregar dos nuevas calificaciones al restaurante cuyo id es "50018608". A continuación se especifican las calificaciones a agregar en una sola consulta.  

{
	"date" : ISODate("2019-10-10T00:00:00Z"),
	"grade" : "A",
	"score" : 18
}

{
	"date" : ISODate("2020-02-25T00:00:00Z"),
	"grade" : "A",
	"score" : 21
}


db.restaurants.updateOne(
    {
        restaurant_id: "50018608"
    },
    {
        $push: {
            grades: {
                $each: [
                    {
                        date: ISODate("2019-10-10T00:00:00Z"),
                        grade: "A",
                        score: 18
                    },
                    {
                        date: ISODate("2020-02-25T00:00:00Z"),
                        grade: "A",
                        score: 21
                    }
                ]
            }
        }
    }
);

updateOne(): actualiza un solo restaurante.

restaurant_id: identifica al restaurante por su ID, que en tu colección es un string.

$push: agrega elementos al array grades.

$each: permite agregar varios elementos al array en una única operación.

# PRACTICO 8 

# ej1 Cantidad de cines (theaters) por estado.

db.theaters.aggregate([
    {
        $group: {
            _id: "$location.address.state",
            cantidad: { $sum: 1 }
        }
    },
    {
        $sort: { cantidad: -1 }
    },
    {
        $project: {
            _id: 0,
            estado: "$_id",
            cantidad: 1
        }
    }
])

# ej 2 Cantidad de estados con al menos dos cines (theaters) registrados.

db.theaters.aggregate([
    {
        $group: {
            _id: "$location.address.state",
            cantidad: { $sum: 1 }
        }
    },
    {
        $match: {
            cantidad: { $gte: 2 }
        }
    },
    {
        $count: "cantidadEstados"
    }
])

# ej 3 Cantidad de películas dirigidas por "Louis Lumière". Se puede responder sin pipeline de agregación, realizar ambas queries.


db.movies.aggregate([
    {
        $match: {
            directors: "Louis Lumière"
        }
    },
    {
        $count: "peliculasDirigidas"
    }
])

# ej 4 Cantidad de películas estrenadas en los años 50 (desde 1950 hasta 1959). Se puede responder sin pipeline de agregación, realizar ambas queries.

db.movies.aggregate([
    {
        $match: {
            year: { $gte: 1950, $lte: 1959 }
        }
    },
    {
        $group: {
            id_: null / _id: "$year", #aca si quiero el total de la decada uso null sino year para agrupar por año
            n_movies: { $sum: 1 }
        }
    },
    {
        $sort: { "_id": 1 }
    },
    {
        $project: {
            _id: 0,
            año: "$_id",
            n_movies: 1
        }
    }
])


# ej 5 Listar los 10 géneros con mayor cantidad de películas (tener en cuenta que las películas pueden tener más de un género). Devolver el género y la cantidad de películas. Hint: unwind puede ser de utilidad

db.movies.aggregate([
    { $unwind: "$genres" },
    {
        $group: {
            _id: "$genres",
            n_movies: { $sum: 1 }
        }
    },
    {
        $sort: {n_movies: -1}
    },
    {
        $limit: 10
    },
    {
        $project: {
            _id: 0,
            genero: "$_id",
            n_movies: 1
        }
    }
])

# ej 6 Top 10 de usuarios con mayor cantidad de comentarios, mostrando Nombre, Email y Cantidad de Comentarios.

db.comments.aggregate([
    {
        $group: {
            _id: "$name",
            n_comments: { $sum: 1 }
        }
    },
    {
        $sort: {n_comments: -1}
    },
    { $limit: 10},
    {
        $project: {
            _id: 0,
            name: "$_id",
            n_comments: 1,
            email: 1
        }
    }
])

# ej 7 Ratings de IMDB promedio, mínimo y máximo por año de las películas estrenadas en los años 80 (desde 1980 hasta 1989), ordenados de mayor a menor por promedio del año.

db.movies.aggregate([
    {
    $match: {
        year: { $gte: 1980, $lte: 1989 },
        "imdb.rating": { $type: "double" }
        }
    },
    {$group: {
        _id: "$year",
        max_imdb: { $max: "$imdb.rating" },
        min_imdb: { $min: "$imdb.rating" },
        avg_imdb: { $avg: "$imdb.rating" }
    }},
    {
        $sort: {_id: -1}
    },
    {
        $project: {
            _id: 0,
            year: "$_id",
            max_imdb: 1,
            min_imdb: 1,
            avg_imdb: 1
        }
    }
])

# ej 8 Título, año y cantidad de comentarios de las 10 películas con más comentarios.

db.movies.aggregate([
    {
        $lookup: {
            from: "comments",
            localField: "_id",
            foreignField: "movie_id",
            as: "comment"
        }
    },
    {
        $unwind: "$comment"
    },
    {$group: {
        _id: "$_id",
        title: { $first: "$title" },
        comments_sum: { $sum: 1 }
    }},
    {
        $sort: {comments_sum: -1}
    },
    { $limit: 10 },
    {
        $project: {
            _id: 0,
            title: 1,
            year: 1,
            comentarios: "$comments_sum",
        }
    }
])

# ej 9 Crear una vista con los 5 géneros con mayor cantidad de comentarios, junto con la cantidad de comentarios.

# consulta

db.movies.aggregate([
    {
        $lookup: {
            from: "comments",
            localField: "_id",
            foreignField: "movie_id",
            as: "comment"
        }
    },
    {$unwind:"$genres"},{$unwind:"$comment"},
    {$group: {
        _id: "$genres",
        genre: { $first: "$genres" },
        comments_sum: { $sum: 1 }
    }},
    {
        $sort: {comments_sum: -1}
    },
    { $limit: 10 },
    {
        $project: {
            _id: 0,
            genre: 1,
            comentarios: "$comments_sum",
        }
    }
])

# vista

db.createView(
    "top_generos_comentarios",
    "movies",
    [
        {
            $lookup: {
                from: "comments",
                localField: "_id",
                foreignField: "movie_id",
                as: "comment"
            }
        },
        { $unwind: "$genres" },
        { $unwind: "$comment" },
        {
            $group: {
                _id: "$genres",
                genre: { $first: "$genres" },
                comments_sum: { $sum: 1 }
            }
        },
        { $sort: { comments_sum: -1 } },
        { $limit: 10 },
        {
            $project: {
                _id: 0,
                genre: 1,
                comentarios: "$comments_sum"
            }
        }
    ]
)

# ej 10 Listar los actores (cast) que trabajaron en 2 o más películas dirigidas por "Jules Bass". Devolver el nombre de estos actores junto con la lista de películas (solo título y año) dirigidas por “Jules Bass” en las que trabajaron. 
Hint1: addToSet
Hint2: {'name.2': {$exists: true}} permite filtrar arrays con al menos 2 elementos, entender por qué.
Hint3: Puede que tu solución no use Hint1 ni Hint2 e igualmente sea correcta

db.movies.aggregate([
    {
        $match: {directors: "Jules Bass"}
    },
    {
        $unwind: "$cast"
    },
    {
        $group: {
            _id: "$cast",
            cast: { $first: "$cast" },
            title: { $first: "$title" },
            year: { $first: "$year" },
            sumita: {$sum: 1}
        }
    },
    {
        $match: {sumita: {$gte:2}}
    },
    {
        $project: {
            _id: "$cast",
            title: 1,
            cast: 1,
            sumita: 1
        }
    }
])

# variante con addToSet

db.movies.aggregate([
    {
        $match: {
            directors: "Jules Bass"
        }
    },
    {
        $unwind: "$cast"
    },
    {
        $group: {
            _id: "$cast",
            peliculas: {
                $addToSet: {
                    title: "$title",
                    year: "$year"
                }
            }
        }
    },
    {
        $match: {
            "peliculas.1": { $exists: true }
        }
    },
    {
        $project: {
            _id: 0,
            actor: "$_id",
            peliculas: 1
        }
    }
])

# ej 11 Listar los usuarios que realizaron comentarios durante el mismo mes de lanzamiento de la película comentada, mostrando Nombre, Email, fecha del comentario, título de la película, fecha de lanzamiento. HINT: usar $lookup con multiple condiciones 

# milanesa

db.users.aggregate([
    {
        $lookup: {
            from: "comments",
            localField: "email",
            foreignField: "email",
            as: "comment"
        }
    },
    {
        $unwind: "$comment"
    },
    {
        $lookup: {
            from: "movies",
            let: {
                movieId: "$comment.movie_id",
                commentDate: "$comment.date"
            },
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $and: [
                                {
                                    $eq: ["$_id", "$$movieId"]
                                },
                                {
                                    $eq: [
                                        { $month: "$released" },
                                        { $month: "$$commentDate" }
                                    ]
                                }
                            ]
                        }
                    }
                }
            ],
            as: "comment_movie"
        }
    },
    {
        $unwind: "$comment_movie"
    },
    {
        $project: {
            _id: 0,
            name: 1,
            email: 1,
            comment_date: "$comment.date",
            movie_title: "$comment_movie.title",
            release_date: "$comment_movie.released"
        }
    }
])

# ej 12 Listar el id y nombre de los restaurantes junto con su puntuación máxima, mínima y la suma total. Se puede asumir que el restaurant_id es único.
Resolver con $group y accumulators.
Resolver con expresiones sobre arreglos (por ejemplo, $sum) pero sin $group.
Resolver como en el punto b) pero usar $reduce para calcular la puntuación total.
Resolver con find.

db.restaurants.aggregate([
    {
        $set: {
            scores: {
                $map: {
                    input: "$grades",
                    as: "g",
                    in: "$$g.score"
                }
            }
        }
    },
    {
        $set: {
            sum: {
                $reduce: {
                    input: "$scores",
                    initialValue: 0,
                    in: {
                        $add: ["$$value", "$$this"]
                    }
                }
            }
        }
    },
    {
        
        $project: {
            _id: 0,
            restaurant_id: "$_id",
            name: 1,
            max_score: { $max: "$scores" },
            min_score: { $min: "$scores" },
            sum_score: "$sum"
        }
    }
])

#resuelto con find

db.restaurants.find(
    {},
    {
        _id: 0,
        restaurant_id: 1,
        name: 1,
        max_score: {
            $max: {
                $map: {
                    input: "$grades",
                    as: "g",
                    in: "$$g.score"
                }
            }
        },
        min_score: {
            $min: {
                $map: {
                    input: "$grades",
                    as: "g",
                    in: "$$g.score"
                }
            }
        },
        sum_score: {
            $sum: {
                $map: {
                    input: "$grades",
                    as: "g",
                    in: "$$g.score"
                }
            }
        }
    }
)

# ej 13 

db.restaurants.updateMany(
    {},
    [   
        {
            $set: {
                avg_score: {
                    $avg: {
                        $map: {
                            input: "$grades",
                            as: "g",
                            in: "$$g.score"
                        }
                    }
                }
            }
        },
        {
            $set: {
                grade: {
                    $switch: {
                        branches: [
                            { case: {$and:[{$gte:["$avg_score",0]},{$lte:["$avg_score",13]}]}, then: "A" },
                            { case: {$and:[{$gt:["$avg_score",13]},{$lt:["$avg_score",28]}]}, then: "B" },
                            { case: {$gte:["$avg_score",28]}, then: "C" }
                        ],
                        default: "C"
                    }
                }
            }  
        } 
    ]
)

## Practico 9

ejemplo

# ej 1 Especificar en la colección users las siguientes reglas de validación: El campo name (requerido) debe ser un string con un máximo de 30 caracteres, email (requerido) debe ser un string que matchee con la expresión regular: "^(.*)@(.*)\\.(.{2,4})$" , password (requerido) debe ser un string con al menos 50 caracteres.

db.runCommand({
   collMod: "users",
   validator: {
      $jsonSchema: {
         bsonType: "object",
         required: ["name", "email", "password"],
         properties: {
            name: {
               bsonType: "string",
               maxLength: 30,
               description: "El nombre debe ser un texto de maximo 30 chars y es obligatorio."
            },
            email: {
               bsonType: "string",
               pattern: "^(.*)@(.*)\\.(.{2,4})$", // Valida formato básico de email
               description: "Debe ser un email válido."
            },
            password: {
               bsonType: "string",
               minLength: 50,
               description: "Debe ser un entero mayor o igual a 50."
            }
         }
      }
   }
})

testeo para 5 validos:

db.users.insertMany([
  {
    name: "Ana Gomez",
    email: "ana.gomez@example.com",
    password: "estaesuncontrasenarelargayseguraconmasdecinuentacaracteres123456789"
  },
  {
    name: "Carlos",
    email: "carlos_123@correo.net",
    password: "otracontrasenamuylargaparaqueeltestpasexd1234567890abcdefghijklmnopqrstuvwxyz"
  },
  {
    name: "Maria Del Carmen",
    email: "maria@domain.org",
    password: "passwordsuperseguroquecumpleconlatallaminimarequeridapormongodbvalidador"
  },
  {
    name: "Juan Perez",
    email: "jperez@test.co",
    password: "longpasswordwithmorethanfiftycharactersjustto be safe and valid 987654321"
  },
  {
    name: "Lucia",
    email: "lucia.dev@code.io",
    password: "claveultrasecretaparaprobarrelasdevalidacionschemaenmongodb2026"
  }
])

# ej 2 Obtener metadata de la colección users que garantice que las reglas de validación fueron correctamente aplicadas.

db.getCollectionInfos({ name: "users" })

# ej 3 Especificar en la colección theaters las siguientes reglas de validación: El campo theaterId (requerido) debe ser un int y location (requerido) debe ser un object con:
un campo address (requerido) que sea un object con campos street1, city, state y zipcode todos de tipo string y requeridos
un campo geo (no requerido) que sea un object con un campo type, con valores posibles “Point” o null y coordinates que debe ser una lista de 2 doubles
Por último, estas reglas de validación no deben prohibir la inserción o actualización de documentos que no las cumplan sino que solamente deben advertir.

db.runCommand({
   collMod: "theaters",
   validator: {
      $jsonSchema: {
         bsonType: "object",
         required: ["theaterId", "location"],
         properties: {
            theaterId: {
               bsonType: "int",
               description: "El id debe ser un int"
            },
            location: {
               bsonType: "object",
               required: ["address"],
               properties: {
                  address: {
                     bsonType: "object",
                     required: ["street1", "city", "state", "zipcode"],
                     properties: {
                        street1: { bsonType: "string" },
                        city: { bsonType: "string" },
                        state: { bsonType: "string" },
                        zipcode: { bsonType: "string" }
                     }
                  },
                  geo: {
                     bsonType: "object",
                     properties: {
                        type: {
                           enum: ["Point", null],
                           description: "El tipo debe ser 'Point' o null"
                        },
                        coordinates: {
                           bsonType: "array",
                           minItems: 2,
                           maxItems: 2,
                           items: {
                              bsonType: "double"
                           },
                           description: "Las coordenadas deben ser una lista de 2 doubles"
                        }
                     }
                  }
               }
            }
         }
      }
   },
   validationAction: "warn"
})

# test 
2 bien

db.theaters.insertMany([
  {
    theaterId: 1001,
    location: {
      address: {
        street1: "Av. Corrientes 1234",
        city: "Buenos Aires",
        state: "BA",
        zipcode: "C1043"
      },
      geo: {
        type: "Point",
        coordinates: [-58.3816, -34.6037] // Exactamente 2 doubles
      }
    }
  },
  {
    theaterId: 1002,
    location: {
      address: {
        street1: "San Martin 500",
        city: "Cordoba",
        state: "CBA",
        zipcode: "X5000"
      }
      // geo no viene, como es opcional pasa OK
    }
  }
])

2 mal 

# ej  4 Especificar en la colección movies las siguientes reglas de validación: El campo title (requerido) es de tipo string, year (requerido) int con mínimo en 1900 y máximo en 3000, y que tanto cast, directors, countries, como genres sean arrays de strings sin duplicados.
Hint: Usar el constructor NumberInt() para especificar valores enteros a la hora de insertar documentos. Recordar que mongo shell es un intérprete javascript y en javascript los literales numéricos son de tipo Number (double).

db.runCommand({
   collMod: "movies",
   validator: {
      $jsonSchema: {
         bsonType: "object",
         required: ["title", "year"],
         properties: {
            title: {
               bsonType: "string",
            },
            year: {
               bsonType: "int",
               minimum: 1900,
               maximum: 3000
            },
            cast: {
                bsonType: "array",
                uniqueItems: true,
                items: { bsonType: "string" }
            },
            directors: {
                bsonType: "array",
                uniqueItems: true,
                items: { bsonType: "string" }
            },
            countries: {
                bsonType: "array",
                uniqueItems: true,
                items: { bsonType: "string" }
            },
            genres: {
                bsonType: "array",
                uniqueItems: true,
                items: { bsonType: "string" }
            }
         }
      }
   }
})


# ej 5 Crear una colección userProfiles con las siguientes reglas de validación: Tenga un campo user_id (requerido) de tipo “objectId”, un campo language (requerido) con alguno de los siguientes valores [ “English”, “Spanish”, “Portuguese” ] y un campo favorite_genres (no requerido) que sea un array de strings sin duplicados.


db.createCollection("userProfiles", {
   validator: {
      $jsonSchema: {
         bsonType: "object",
         required: ["user_id", "language"], // Solo estos dos son obligatorios
         properties: {
            user_id: {
               bsonType: "objectId",
               description: "Debe ser un ObjectId válido y es requerido."
            },
            language: {
               bsonType: "string",
               enum: ["English", "Spanish", "Portuguese"],
               description: "Debe ser uno de los idiomas permitidos."
            },
            favorite_genres: {
               bsonType: "array",
               uniqueItems: true, // Sin duplicados, igual que en movies
               items: {
                  bsonType: "string"
               },
               description: "Array opcional de géneros únicos."
            }
         }
      }
   },
   validationAction: "error"
})

# ej 7 

db.createCollection("books", {
   validator: {
      $jsonSchema: {
         bsonType: "object",
         required: ["book_id","title","author","price","category_id"], 
         properties: {
            book_id: {
               bsonType: "objectId",
               description: "Debe ser un ObjectId válido y es requerido."
            },
            title: {
               bsonType: "string"
            },
            author: {
               bsonType: "string"
            },
            price: {
               bsonType: "int",
               minimum: 0
            },
            category_id: {
                bsonType: "array",
                items: {
                    bsonType: "string" 
                }
            }
         }
      }
   },
})

db.createCollection("order", {
   validator: {
      $jsonSchema: {
         bsonType: "object",
         properties: {
            order_id: {
               bsonType: "objectId"
            },
            delivery_name: {
               bsonType: "string"
            },
            delivery_address: {
               bsonType: "string"
            },
            cc_name: {
               bsonType: "string"
            },
            cc_number: {
               bsonType: "string"
            },
            cc_expiry: {
               bsonType: "string"
            },
            orderDetails: {
                bsonType: "array",
                items: { 
                    bsonType: "object",
                    properties: { 
                        id: { bsonType: "objectId" },
                        book_id: { bsonType: "objectId" }
                    }
                }
            }
         }
      }
   },
})


# ej 8

// 1. Colección USERS
db.createCollection("users", {
   validator: {
      $jsonSchema: {
         bsonType: "object",
         required: ["name", "email"],
         properties: {
            name: { bsonType: "string" },
            email: { bsonType: "string" }
         }
      }
   },
   validationAction: "error"
});

db.users.insertMany([
   { _id: ObjectId("64a5f2e8bcf86cd799439001"), name: "Ana Pérez", email: "ana@email.com" },
   { _id: ObjectId("64a5f2e8bcf86cd799439002"), name: "Carlos Gómez", email: "carlos@email.com" }
]);


// 2. Colección ARTICLES (Con categorías y tags anidados para resolver rápido la Query 1)
db.createCollection("articles", {
   validator: {
      $jsonSchema: {
         bsonType: "object",
         required: ["user_id", "title", "url", "date"],
         properties: {
            user_id: { bsonType: "objectId" },
            title: { bsonType: "string" },
            url: { bsonType: "string" },
            date: { bsonType: "date" },
            categories: {
               bsonType: "array",
               items: { bsonType: "string" }
            },
            tags: {
               bsonType: "array",
               items: { bsonType: "string" }
            }
         }
      }
   },
   validationAction: "error"
});

db.articles.insertMany([
   {
      _id: ObjectId("64a5f2e8bcf86cd799439111"),
      user_id: ObjectId("64a5f2e8bcf86cd799439001"),
      title: "Introducción a MongoDB",
      url: "https://blog.com/intro-mongodb",
      date: ISODate("2026-05-10T10:00:00Z"),
      text: "Contenido del artículo...",
      categories: ["Bases de Datos", "NoSQL"],
      tags: ["mongodb", "tutorial"]
   }
]);


// 3. Colección COMMENTS (Referencia a article_id y user_id, con fecha para la Query 2)
db.createCollection("comments", {
   validator: {
      $jsonSchema: {
         bsonType: "object",
         required: ["article_id", "user_id", "date", "text"],
         properties: {
            article_id: { bsonType: "objectId" },
            user_id: { bsonType: "objectId" },
            date: { bsonType: "date" },
            text: { bsonType: "string" }
         }
      }
   },
   validationAction: "error"
});

db.comments.insertMany([
   {
      _id: ObjectId("64a5f2e8bcf86cd799439222"),
      article_id: ObjectId("64a5f2e8bcf86cd799439111"),
      user_id: ObjectId("64a5f2e8bcf86cd799439002"),
      date: ISODate("2026-05-12T15:30:00Z"),
      text: "¡Excelente artículo, muy útil!"
   }

Ejercicios milanesa extra

  // PARCIAL 2 LAB BDD 2024, Tomás Achával - NOTA: 9

use("university")


// Ejercicio 1
db.grades.find(
    {
        scores: {
            $not: {
                $elemMatch: {
                    type: 'homework',
                    score: { $lt: 60 }
                }
            },
            $elemMatch: {
                $or: [
                    { type: 'exam', score: { $gte: 80 } },
                    { type: 'quiz', score: { $gte: 90 } }
                ]
            }
        }
    },
    {
        _id: 0
    }
) // CORRECCIÓN: me faltó el sort


// Ejercicio 2
db.grades.aggregate([
    {
        $match: {
            class_id: { $in: [20, 220, 420] }
        }
    },
    {
        $project: {
            _id: 0,
            student_id: 1,
            class_id: 1,
            min_score: { $min: "$scores.score" },
            max_score: { $max: "$scores.score" },
            avg_score: { $avg: "$scores.score" },
        }
    },
    { $sort: { student: 1, class: 1 } } // CORRECCIÓN: acá era student_id y class_id
])


// Ejercicio 3
db.grades.aggregate([
    {
        $project: {
            class_id: 1,
            exam_scores: {
                $filter: {
                    input: "$scores",
                    as: "score",
                    cond: { $eq: ["$$score.type", "exam"] }
                }
            }
            ,
            quiz_scores: {
                $filter: {
                    input: "$scores",
                    as: "score",
                    cond: { $eq: ["$$score.type", "quiz"] }
                }
            }
        }
    },
    { $unwind: "$exam_scores" },
    { $unwind: "$quiz_scores" },
    {
        $group: {
            _id: "$class_id",
            max_exam_score: {
                $max: "$exam_scores.score"
            },
            max_quiz_score: {
                $max: "$quiz_scores.score"
            }
        }
    },
    { $sort: { _id: 1 } }
])


// Ejercicio 4
// Promedio de promedios por clase
db.createView(
    "top10students",
    "grades",
    [
        {
            $group: {
                _id: "$student_id",
                avg_score_per_class: {
                    $addToSet: {
                        class: "$class_id",
                        avg_score: { $avg: "$scores.score" }
                    }
                }
            }
        },
        {
            $project: {
                _id: 0,
                student: "$_id",
                avg_score: {
                    $avg: "$avg_score_per_class.avg_score"
                }
            }
        },
        { $sort: { avg_score: -1 } },
        { $limit: 10 },
    ]
)


// Ejercicio 5
db.grades.updateMany(
    { class_id: 339 },
    [
        {
            $set: {
                score_avg: { $avg: "$scores.score" },
                letter: {
                    $switch: {
                        branches: [
                            {
                                case: { $lt: ["$score_avg", 60] },
                                then: "NA"
                            },
                            {
                                case: {
                                    $and: [{ $gte: ["$score_avg", 60] }, { $lt: ["$score_avg", 80] }]
                                },
                                then: "A"
                            },
                            {
                                case: { $gte: ["$score_avg", 80] },
                                then: "P"
                            }
                        ],
                        default: "",
                    }
                }
            }
        }
    ]
)


// Ejercicio 6a
/* 
    Un documento de la colección grades deberá tener los campos student_id, scores y class_id.
        student_id y class_id deben ser valores enteros.
        scores debe ser un arreglo compuesto de objetos con campos type y score.
        scores.type debe ser "exam", "quiz" o "homework".
        scores.score debe ser un double en [0, 100].
*/
db.runCommand({
    collMod: "grades",
    validator: {
        $jsonSchema: {
            required: ["student_id", "scores", "class_id"],
            properties: {
                student_id: { bsonType: "int" },
                scores: {
                    bsonType: "array",
                    items: {
                        bsonType: "object",
                        required: ["type", "score"],
                        properties: {
                            type: { enum: ["exam", "quiz", "homework"] },
                            score: {
                                bsonType: "double",
                                minimum: Double(0),
                                maximum: Double(100)
                            }
                        }
                    }
                },
                class_id: { bsonType: "int" }
            }
        },
    }
})

// Ejercicio 6b dos fallas y un éxito

// Primer falla -> campo 'score' del primer subdocumento en la lista 'scores' es string en lugar de double
db.grades.insertOne({
    student_id: 100,
    class_id: 120,
    scores: [
        { type: "exam", score: "P" },
        { type: "quiz", score: 99.1 }
    ]
})

// Segunda falla -> campo 'student_id' string en lugar de int
db.grades.insertOne({
    student_id: '100',
    class_id: 120,
    scores: [
        { type: "exam", score: 10.3 },
        { type: "quiz", score: 99.1 }
    ]
})

/* 
Otros casos de falla posibles: 
    - score no está entre 0 y 100
    - class_id no es int
    - scores.type no está en ["exam", "quiz", "homework"]
    - ...
*/

// Éxito
db.grades.insertOne({
    student_id: 100,
    class_id: 120,
    scores: [
        { type: "exam", score: 10.3 },
        { type: "quiz", score: 99.1 }
    ]
})
]);
