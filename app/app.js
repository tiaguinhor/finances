import 'es6-shim';
import {App, Platform} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {HomePage} from './pages/home/home';
import {ContasPage} from './pages/contas/contas';

@App({
  templateUrl: 'build/pages/menu.html',
  config: {} // http://ionicframework.com/docs/v2/api/config/Config/
})

export class MyApp {
  static get parameters() {
    return [[Platform]];
  }

  constructor(platform) {
    this.home = HomePage;
    this.contas = ContasPage;
    this.rootPage = this.home;

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });
  }

  openPage(option){
    this.rootPage = option;
  }
}
