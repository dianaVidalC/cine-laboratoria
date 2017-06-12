/**
 * Created by LABORATORIA 0017le on 12/06/2017.
 */
const express    =require('express');
const bodyParser =require('body-parser');
const levelup    =require('levelup');

const app =express();
const db  =levelup('./data',{valueEncoding:'json'});


app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

const router =express.Router();

router.get('/',(req,res)=> {
    //res.send('Hello World!!!');
    res.json({message: "Hola soy el API de cine Laboratoria"});
})

router.post('/movies',(req,res)=>{
    //console.log(req.body);
    const id = req.body.nombre.toLowerCase().split(" ").join("-");//la-momia
    db.put(id,req.body,(err)=>{
        if (err) res.json({message:"Hubo un error al guardar los datos"});
    })
    res.json({message:"La película se grabó con éxito"});
})

router.get('/movies',(req,res)=>{
    let movies =[];
    db.createValueStream().on('data',(data)=>{
        movies.push(data);
    }).on('end',_=>{
        res.json(movies);
    })
})

router.get('/movies/:id',(req,res)=>{
    if(req.params.id){
        db.get(req.params.id,(err,movie)=>{
            if(err) return res.json({message:"Hubo un error al obtener"});
            res.json(movie);
        })
    }

})
app.use('/api',router);

const port = process.env.PORT || 3000;

app.listen(3000,()=>{
    console.log('El server esta corriendo en el 3000!');
})