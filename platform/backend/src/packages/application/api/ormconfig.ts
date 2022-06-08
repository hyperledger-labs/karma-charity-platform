import { AppSettings } from './src/AppSettings';
import { AppModule } from './src/AppModule';

const settings = new AppSettings();
const config = AppModule.getOrmConfig(settings);
export = config;

