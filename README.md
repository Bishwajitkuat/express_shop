# Express shop

A CRUD app where user can list their products and buy products from other users. It is a ongoing project authentication and loging features yet to implement.

## Technologies

- Nodejs
- Express
- Ejs
- Mariadb
- SQL
- Sequelize

## Setting Dev environment

```shell
# clone the repository
https://github.com/Bishwajitkuat/express_shop.git
# cd into the root directory of the project
# spin up the database with docker, express_shop_DB database will be imported during compose up from db_backup directory
docker compose up -d
npm install
npm start
# if docker containers up and running
# express app
http://localhost:3000/
# phpmyadmin to manage db
http://localhost:8080/
```

## Author

Bishwajit Das (Bisso)

## Screenshots

![projuct img](public/img/project_screenshot.png)
![project img](public/img/project_screenshot2.png)
