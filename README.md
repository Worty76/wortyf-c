# WortyF-C
A commerce website for everybody to buy, sell, and trade accounts.

## Run Locally

### 1. Clone repo

```
$ git clone git@github.com:Worty76/WortyF-C.git
$ cd WortyF-C-master
```

### 2. Install MongoDB

Download it from here: https://docs.mongodb.com/manual/administration/install-community/

### 3. Run Backend

- Go to .env (if there's no .env, create one) and change data by your mongoDB token.

```
$ npm install
$ npm start
```

### 4. Run Frontend

```
# open a new terminal
$ cd client
$ npm install
$ npm start
```

### 5. Login

- Run http://localhost:3000/signin (if you don't have any accounts, create one in http://localhost:3000/signup)
- Enter your email and password and click signin 

### 6. Create Posts

- Run http://localhost:3000/products
- Click Create Post and enter post info
