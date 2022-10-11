import { AppSettings } from './src/AppSettings';
import { AppModule } from './src/AppModule';
import { DataSource } from 'typeorm';

let config = AppModule.getOrmConfig(new AppSettings())[0];
export default new DataSource(config as any);




