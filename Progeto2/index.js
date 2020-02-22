const express = require("express");
const session=require("express-session");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");
const categoriesController= require("./categories/CategoriesController");
const articlesController= require("./articles/ArticlesController");
const userController = require("./user/userController");
const Category = require("./categories/Category");
const Article = require("./articles/Article");
const User = require("./user/User");
//set view engine
app.set('view engine','ejs');


//ativar session
app.use(session({
  secret:"qualquercoisa", cookie:{maxAge: 300000000000000}
}))
//static
app.use(express.static('public'));

//config body parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//database
connection
.authenticate()
.then(()=>{
  console.log("Conexão feita com sucesso!");
}).catch((error)=>{
  console.log(error);
});
//rotas
app.use("/",categoriesController);
app.use("/",articlesController);
app.use("/",userController);


app.get("/",(req, res)=>{
  Article.findAll({
    orde:[
      ['id','DESC']
    ],
    limit: 4
  }).then(articles=>{
    Category.findAll().then(categories=>{
      res.render("index",{articles:articles, categories:categories});
    })

  })

});
app.get("/:slug",(req, res)=>{
  var slug = req.params.slug;
  Article.findOne({
    where: {
      slug: slug
    }
  }).then(articles => {
    if(articles != undefined){
      Category.findAll().then(categories=>{
        res.render("article",{articles:articles, categories:categories});
      })
    }else{
      res.render("/");
    }
  }).catch(error =>{
    res.render("/");
  })
});
app.get("/category/:slug",(req,res)=>{
  var slug = req.params.slug
  Category.findOne({
    where:{
      slug:slug
    },
    include: [{model: Article}]
  }).then(category=>{
    if(category != undefined){
      Category.findAll().then(categories => {
        res.render("index",{articles: category.articles, categories:categories})
      })
    }else{
      res.render("/");
    }
  }).catch(error =>{
    res.render("/");
  })
});
//servidor ouvindo
app.listen(8080,()=>{
  console.log("O servidor está rodando!");
});
