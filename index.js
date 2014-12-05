// Import
var express = require('express');
var app = express();
var expressHbs = require('express-handlebars');
var storage = require('node-persist');
var bodyParser = require('body-parser')

// Configuration
app.engine('html', expressHbs({extname:'html', defaultLayout:'main.html'}));
app.set('view engine', 'html');
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

// Initialisation et Synchronisation
storage.initSync();

// Outils
function addToUserList(title) { // on déclare la fonction addToUserList qui à en argument title et qui fait :
    var liste = storage.getItem('users_list') || []; // On dis que liste c'est : "prends et sors la pierre de la boite storage -> users_list"
    liste.push(title); // Ensuite, on viens sur cette pierre et on la grave avec un nom title
    storage.setItem('users_list', liste); // On remet la pierre dans la boite users_list
}

// url
app.get('/', function (req, res) {
    res.render('index', { users_list: storage.getItem('users_list') }); // La pierre gravée est renvoyée au client ss le nom users_list, permettant 
});

app.get('/users/new', function (req, res) { // Si requête GET url /x alors :
    res.render('formulaire'); // On répond à la requete par : ('y')
});
app.post('/users/new', function (req, res) { // Si requête POST url /x alors (à savoir <form méthode="post"></form>) :
    var title = req.body.firstname.trim(); // On défini que title sera firstane trimé (--> corrige les espaces autour en moins)
    req.body.firstname = req.body.firstname.trim(); // mon firstname = mon firsname trimé
    req.body.lastname = req.body.lastname.trim(); // mon lastname = firsname trimé
    req.body.city = req.body.city.trim(); // mon city = mon city trimé
    storage.setItem(title, req.body); // On va stoquer dans storage (avec pour clef: la var title qui est le firstname trimé) l'ensemble des infos du form
    addToUserList(title); // on déclanche la fonction ligne 21 avec la pierre pour graver ses infos et remettre la pierre au bon endroit
    res.render('users', storage.getItem(title)); // On viens afficher en réponse au client users en lui retournant les informations correspondant à la clef  
});

app.get('/:name', function (req, res) { // si la requête get client est 'x' on déclanche :
    res.render('users', storage.getItem(req.params.name)); // une réponse qui sera la page html users avec les infos de name dans le storage
});

// Lancement de serveur
var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});
