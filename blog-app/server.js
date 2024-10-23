const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const loggerMiddleware = require('./middleware/loggerMiddleware');
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: false
}));

app.use(loggerMiddleware);

app.use('/',authRoutes);
app.use('/posts', postRoutes);

app.get('/',(req,res)=>{
  res.redirect('/posts');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('서버 내부 오류가 발생했습니다.');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>{
  console.log(`서버가 ${PORT}번 포트에서 실행 중입니다.`);
});

