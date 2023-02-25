const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const {fileURLToPath} = require('url');
const {register} = require('./controllers/auth');
const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const postRouter = require('./routes/post');
const { verifyToken } = require('./middleware/auth');
const {createPost} = require('./controllers/post');
/* Configuration */ 
dotenv.config();
mongoose.set('strictQuery', false);
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin"}));
app.use(morgan("common"));
app.use(bodyParser.json({limit: "30mb", extended: true}));
app.use(bodyParser.urlencoded({limit:"30mb", extended:true}));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname,'public/assets')));


//  File Storage
const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,"public/assets");
    },
    filename: function(req, file, cb){
        cb(null,file.originalname);
    }
});
const upload = multer({storage});


// Routes with files
app.post('/auth/register',upload.single('picture'),register);  // we didnt put in auth route because due to upload.single(), const upload = multer({storage}) this should be just one level up.
app.post('/post', verifyToken, upload.single('picture'), createPost);
// ROUTES
app.use('/auth',authRouter);
app.use('/users', userRouter);
app.use('/post', postRouter);


// Mongoose
const PORT = process.env.PORT || 6001;
mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(()=>{
    app.listen(PORT,()=>{ console.log(`Server is connected to ${PORT}...`); })
}).catch((error)=>{
    console.log(`Did not connect Error: ${error}`);
});
