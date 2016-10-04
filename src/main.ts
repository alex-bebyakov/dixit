// The browser platform with a compiler
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

// The app module
import { AppModule } from './app';

// Compile and launch the module
platformBrowserDynamic().bootstrapModule(AppModule);
