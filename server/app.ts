import * as bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import * as express from 'express';
import * as morgan from 'morgan';
import * as mongoose from 'mongoose';
import * as path from 'path';
import * as http from 'http';
import * as fs from 'fs';
import * as rfs from 'rotating-file-stream';
import * as SegfaultHandler from 'segfault-handler';
import * as _cluster from 'cluster';
const cluster = _cluster as unknown as _cluster.Cluster; // typings fix
import * as os from 'os';
import setRoutes from './routes';

const numCPUs = os.cpus().length;

if (cluster.isMaster) {
  console.log('Master process is running');
  // Fork workers
  for (let i = 0; i < numCPUs / 2; i++) {
    cluster.fork();
  }
  // Listen for dying workers
  cluster.on('exit', function (worker) {
    // Replace the dead worker, we're not sentimental
    console.log('Worker %d died :(', worker.id);
    cluster.fork();
  });
} else {
  const app = express();
  SegfaultHandler.registerHandler('crash.log');
  // Logging middleware
  // You can set morgan to log differently depending on your environment
  if (app.get('env') === 'production') {
    const morganLogDirectory = path.join(__dirname, '../../logs');
    // ensure log directory exists
    if (!fs.existsSync(morganLogDirectory)) {
      fs.mkdirSync(morganLogDirectory);
    }
    // create a rotating write stream
    const morganLogStream = rfs.createStream('morgan.log', {
      interval: '1d', // rotate daily
      path: morganLogDirectory,
      size: '10M' // rotates the file when size exceeds 10 MegaBytes
    });
    // setup the logger
    app.use(morgan('combined', {stream: morganLogStream}));
  } else {
    // setup the logger
    app.use(morgan('dev'));
    // Load environment development variables
    dotenv.config();
  }

  // Use body parser so we can get info from POST and/or URL parameters
  app.use(bodyParser.json({limit: '50mb'}));
  app.use(bodyParser.urlencoded({extended: false}));

  // Run the app by serving the static files in the dist directory
  app.use(express.static(path.join(__dirname, '../public')));

  // Set our api routes
  setRoutes(app);

  // For all GET requests, send back index.html so that PathLocationStrategy can be used
  app.get('*', (req, res) => res.sendFile(path.join(__dirname, '../public/index.html')));

  // Get port from environment and store in Express.
  const port = Number(process.env.PORT || 3000);
  app.set('port', port);

  // Create HTTP server.
  const server = http.createServer(app);

  // Create a database variable outside of the database connection callback to reuse the connection pool in your app.
  let db;

  // Connect to the database before starting the application server.

  mongoose.set('strictQuery', true);
  mongoose.connect(process.env.MONGODB_URI).then(database => {

    // Save database object from the callback for reuse.
    db = database;
    console.log('Database connection ready');

    // Listen on provided port, on all network interfaces.
    try {
      server.listen(port, () => console.log(`API running on localhost:${port}`));
    } catch (err) {
      console.log('GRAVE: ', err);
    }

  }).catch(err => {
    console.error.bind(console, 'connection error:');
    process.exit(1);
  });

}

