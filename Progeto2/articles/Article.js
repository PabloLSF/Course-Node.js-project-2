const Sequelize = require("sequelize");
const connection = require("../database/database");
const Category = require("../categories/Category");

const Article= connection.define('articles',{
  title:{
    type: Sequelize.STRING,
    allowNull: false
  },slug:{
    type: Sequelize.STRING,
    allowNull: false
  },
  body:{
    type:Sequelize.TEXT,
    allowNull: false
  }
})
Category.hasMany(Article);// tem muitos
Article.belongsTo(Category);//um artigo pertence a uma CATEGORIA

//Article.sync({force: true}); forçar sincronização depois de fazer as relações
module.exports= Article;
