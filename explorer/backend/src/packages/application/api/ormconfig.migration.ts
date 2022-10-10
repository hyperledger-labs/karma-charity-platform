import { AppSettings } from './src/AppSettings';
import { AppModule } from './src/AppModule';
import { DataSource } from 'typeorm';

export default new DataSource(AppModule.getOrmConfig(new AppSettings())[0] as any);

