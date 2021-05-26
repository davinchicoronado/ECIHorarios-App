# ***Atributos No Funcionales*** 

## Rendimiento 
### Escenario 1 
* **Fuente del estímulo** : El usuario final. 
* **Estimulo**: Consultar curriculum 
* **Ambiente**: En operaciones normales. 
* **Artefacto**: ECIHorariosAPI.
* **Respuesta**: Consulta satisfactoriamente.
* **Medida de Respuesta** : Tiempo que le tomó realizar las peticiones.  

### Escenario 2
* **Fuente del estímulo** : El usuario final. 
* **Estimulo**: Consultar curriculum 
* **Ambiente**: En operaciones con cache. 
* **Artefacto**: ECIHorariosAPI.
* **Respuesta**: Consulta satisfactoriamente.
* **Medida de Respuesta** : Tiempo que le tomó realizar las peticiones.

### Descripción 
Una de las funcionalidades más importantes es la de consultar asignaturas disponibles la cual para poder realizar esto se debe consultar el plan de estudios de la carrera del estudiante, las asignaturas aprobadas del mismo,  y la información de las asignaturas. Gracias a las bases de datos Mongo el plan de estudios es fácil de representar, teniendo así la forma de un grafo.  

``` 
    b.Curriculum.insert(
	{ "_id" : "Ingenieria de Sistemas" ,
	  "list": [ {"code":"OGR1" , 
			"prerequisites": ["SIML"]
			},
			{"code":"OGR2" ,
				"prerequisites": ["SIML"]	
			}, 
			{"code":"ETO2"} ,
			{"code":"ETO3"} ,
			{"code":"SIML"} ,
			{"code":"IETI",
				"prerequisites": ["ARSW","AUPN"]
			}, 
			{"code":"ETO1"}, 
			{"code":"AREP" ,
				"prerequisites": ["CVDS","AUPN","RECO"]
			}, 
			{"code":"FDGP",
				"prerequisites": ["FCFI"]
			}
      ...
      ...
```

