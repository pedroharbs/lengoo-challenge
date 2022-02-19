import bodyParser from 'body-parser';
import cors from 'cors';
import express, { Application } from 'express';
import kue from 'kue';
import kueUi from 'kue-ui';
import cronJob from 'node-cron';

import createConnection from './database';
import Handler from './errors/handler.error';
import IConfig from './interfaces/configs';
import routes from './routes/index';
import { autoloadConfig, getBaseDir } from './utils/helper';

class App {
    public server: Application;
    public configObject: IConfig;

    constructor() {
        this.loadConfigurations();
        this.server = express();
        this.queues();
        this.middlewares();
        this.routes();
        this.crons();
        this.mongoDatabase();
        this.errorHandling();
    }

    private loadConfigurations() {
        this.configObject = autoloadConfig(getBaseDir());
    }

    private middlewares() {
        this.server.use(cors());
        this.server.use(bodyParser.json());
        this.server.use('/queues', kueUi.app);
        this.server.use('/queues/api', kue.app);
        this.server.use(
            bodyParser.urlencoded({
                extended: true,
            })
        );
    }

    private routes() {
        this.server.use('/api', routes);
    }

    public queues() {
        kue.createQueue({
            redis: {
                host: this.configObject.app.redis.host,
                port: this.configObject.app.redis.port,
                auth: this.configObject.app.redis.pass,
            },
        });
        kueUi.setup({
            apiURL: '/queues/api',
            baseURL: '/queues',
        });
    }

    private crons() {
        // cronJob.schedule('* * * * *', () => {});
    }

    private mongoDatabase() {
        createConnection(this.configObject.app.database);
    }

    private errorHandling() {
        this.server.use((error, req, res, next) => {
            if (error instanceof Handler) {
                return res.status(error.getStatusCode()).json({
                    msg: error.getMessage(),
                });
            }

            return res.status(500).json({
                msg: error.message,
            });
        });
    }
}

export default new App();