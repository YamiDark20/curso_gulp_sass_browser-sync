const gulp = require('gulp');
const browserSync = require('browser-sync');
const sass = require('gulp-sass');


/*Tareas son las acciones que puede realizar gulp, es
decir convertir los codigos de sass, unificar los
css, transformar los javascript, crear un servidor,
etc*/

// .task es para crear una tarea de gulp, el primer
// parametro va el nombre de la tarea, el segundo
// parametro una funcion, esta funcion se encargara
// de retornar lo que tomemos de gulp, pero especificamente
// su metodo src
gulp.task('sass', gulp.series( () => {
	// El metodo src lo que toma es un arreglo y a este
	// arreglo tenemos que darle que archivo vamos a
	// tomar como origen o que archivo hay que procesar
	// en esa tarea, en esa tarea lo que vamos a procesar
	// es lo archivos de sass que estan dentro de la
	// carpeta 'node_modules' buscamos dentro de esta
	// la carpeta 'bootstrap/scss' que dentro de esta ultima
	// carpeta buscamos sus archivos bootstrap.scss, de esta
	// manera se va a poder tomar otro archivo que queremos
	// transformar o convertir, luego vamos a tener que
	// compartir nuestro propio archivo de sass que
	// hallamos creado nosotros mismo para eso vamos
	// a 'src/scss/main.scss'

	// Con el '*.scss' decimos que tome todos los
	// archivos scss que esten dentro de 'src/scss',
	// de esta manera cuando se cree mas archivo 
	// tambien lo va a transformar, para que lo 
	// transforme hay que decirle a traves de un metodo
	// 'pipe' que ejecute la tarea llamada 'sass', esta 
	// tarea es una funcion asi que se tiene que ejecutar
	// cuando la ejecuto le podemos dar opciones de que
	// es lo que quiero que haga, ejm una opcion que
	// comprima todo el codigo para que todo este minimizado
	// para que el codigo css pese poco cuando se suba al
	// servidor, esto lo hacemos colocandole al outputStyle
	// 'compressed'

	// Una vez hecho lo anterior le podemos decir en donde
	// va a colocar los archivos convertidos, lo hacemos
	// con gulp.dest para decirle donde va a hacer el
	// destino

	// Luego vamos a utilizarlo para desarrollar con
	// el modulo browser-sync
	return gulp.src([
		'node_modules/bootstrap/scss/bootstrap.scss',
		'src/scss/*.scss']
	).pipe(sass({outputStyle: 'compressed'})
	).pipe(gulp.dest('src/css')
	).pipe(browserSync.stream());
}));

// Que pasa si queremos empezar a copiar todo 
// el codigo de los javascript dentro de nuestra
// carpeta 'src', vamos a copiar los archivos
// javascript de bootstrap, jquery y popper
// ya que con esto funciona eficientemente
// bootstrap. La tarea la vamos a nombrar 'js'
// uno puede nombrarla como uno quiera
gulp.task('js', gulp.series( () => {
	// Se retorna gulp y este tiene que decirle
	// que archivos va a copiar. Los javascript
	// de bootstrap ayudan a tener animaciones,
	// plugin, etc; para esto usa algunos modulos
	// de jquery y estos 2 usan una biblioteca
	// llamada popper que ayudan con los modales. 
	// Pero se tiene que decir luego adonde lo
	// vamos a copiar esto se hace con 'pipe' y 
	// 'gulp.dest', y en caso de que este escribiendo
	// el codigo refresque el navegador que se hace
	// igualmente con 'pipe' y con browserSync.stream
	return gulp.src([
		'node_modules/bootstrap/dist/js/bootstrap.min.js',
		'node_modules/jquery/dist/jquery.min.js',
		'node_modules/popper.js/dist/umd/popper.min.js'
    ]).pipe(gulp.dest('src/js'))
	.pipe(browserSync.stream());
}));

// Manera de tener un servidor de desarrollo, la
// tarea la llamamos serve pero es muy comun que
// la llamen server. En esta tarea decimos que 
// cuando ejecutamos el comando serve vas a ejecutar
// otra tarea que sera la tarea de 'sass' y luego
// se empieza a configurar
gulp.task('serve', gulp.series( ['sass'], () => {
	// El metodo '.init' para inicializar este modulo
	// pero hay que darle una configuracion, ejm se le
	// puede decir el servidor vas a mostrar todos
	// los archivos que esten dentro de la carpeta 'src'

	//'./' es una manera de decir que la carpeta 'src'
	// esta al lado de gulpfile
    browserSync.init({
    	server: {                              
            baseDir: './src'   
        }
    });  
}));

// Luego de esto podemos preparar a nuestro servidor
// que se quede escuchando por cambios, cuando
// nosotros cambiamos un codigo de nuestros sass
// o html que se reinicie el navegador por si solo
// o que se refresque

// Con el metodo '.watch' le voy a decir vas a tomar
// unos cuantos archivos y todos esos archivos que
// vas a tomar si yo hago un cambio en los archivos
// vas a tener que reiniciar el navegador, el 
// parametro que tiene es un arreglo que dentro hay
// que decirles esos archivos, luego hay que decirles
// que tarea se encarga de convertilos 'sass'
gulp.watch(['node_modules/bootstrap/scss/bootstrap.scss',
'src/scss/*.scss'], gulp.parallel( ['sass'] ));

// Ahora para que se quede escuchando los cambios
// en archivos html, como es un solo archivo entonces
// se manda un string como primer parametro, pero
// tambien se puede decir que cualquier archivo
// que termine en html

// Para que escuche los cambios usamos el metodo
// 'on' pasandole como primer parametro 'change'
// para que escuche los cambios y como segundo
// 'browserSync.reload' para que reinicie el codigo
gulp.watch('src/*.html').on('change', browserSync.reload);

// La funcion se va a encargar de que copie mi
// archivo de font-awesome.css dentro de la carpeta
// 'src' para poder utilizarlo
gulp.task('font-awesome', gulp.series( () => {
    return gulp.src(
    	'node_modules/font-awesome/css/font-awesome.min.css'
    ).pipe(gulp.dest('src/css'));
}));

// font-awesome tambien depende de unas fuentes
// por esto se realiza la siguiente tarea
gulp.task('fonts', gulp.series( () => {
	// '*' para que tome todos los archivos que
	// encuentre
	return gulp.src('node_modules/font-awesome/fonts/*'
	).pipe(gulp.dest('src/fonts'));
}));


// La siguiente tarea es para ejecutar el
// servidor, lo que se va a hacer es ejecutar
// por defecto las tareas 'js', 'serve',
// 'font-awesome' y 'fonts'
gulp.task('default', gulp.series(['js', 'serve',
	'font-awesome', 'fonts']));