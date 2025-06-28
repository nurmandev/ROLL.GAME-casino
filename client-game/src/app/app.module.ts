import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { JwtModule } from "@auth0/angular-jwt";
import { BackendUrl } from '../backendurl';
import { FormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { HighchartsChartModule } from 'highcharts-angular';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgxWheelModule } from 'ngx-wheel';
import { ModalModule } from 'ngx-bootstrap/modal';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { GameinnerComponent } from './gameinner/gameinner.component';
import { InnerheaderComponent } from './innerheader/innerheader.component';

import { ActivesessionComponent } from './activesession/activesession.component';
import { BonusComponent } from './bonus/bonus.component';
import { BustabitComponent } from './bustabit/bustabit.component';
import { GlobalsettingsComponent } from './globalsettings/globalsettings.component';
import { MyprivacyComponent } from './myprivacy/myprivacy.component';
import { SecurityComponent } from './security/security.component';
import { HomeComponent } from './home/home.component';
import { VerificationComponent } from './verification/verification.component';
import { VerifyComponent } from './verify/verify.component';
import { DiceComponent } from './dice/dice.component';
import { CoinflipComponent } from './coinflip/coinflip.component';
import { KenoComponent } from './keno/keno.component';
import { MinesComponent } from './mines/mines.component';
import { WheelComponent } from './wheel/wheel.component';
import { RingoffortuneComponent } from './ringoffortune/ringoffortune.component';
import { RouletteComponent } from './roulette/roulette.component';
import { SwordComponent } from './sword/sword.component';
import { CaveofplunderComponent } from './caveofplunder/caveofplunder.component';
import { UserFavComponent } from './user-fav/user-fav.component';
import { CasinoComponent } from './casino/casino.component';
import { TfaloginComponent } from './tfalogin/tfalogin.component';
import { AffiliateComponent } from './affiliate/affiliate.component';
import { PromotionComponent } from './promotion/promotion.component';
import { SportsComponent } from './sports/sports.component';
import { NewspinComponent } from './newspin/newspin.component';
import { BustabittestComponent } from './bustabittest/bustabittest.component';
import { SupportComponent } from './support/support.component';
import { UndermaintainComponent } from './undermaintain/undermaintain.component';
import { ProvablyFairComponent } from './provably-fair/provably-fair.component';
import { ChartModule } from 'angular-highcharts';
import { PlinkoComponent } from './plinko/plinko.component';
import { WithdrawHistoryComponent } from './withdraw-history/withdraw-history.component';
import { DepositHistoryComponent } from './deposit-history/deposit-history.component';
import { PromotionInfoComponent } from './promotion-info/promotion-info.component';
import { WalletComponent } from './wallet/wallet.component';

const Socketconfig: SocketIoConfig = { url: BackendUrl, options: { transports: ['websocket','polling'] } };

export function tokenGetter() {
  return localStorage.getItem("gAmE-t0KEN");
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    GameinnerComponent,
    InnerheaderComponent,
    ActivesessionComponent,
    BonusComponent,
    BustabitComponent,
    GlobalsettingsComponent,
    MyprivacyComponent,
    SecurityComponent,
    HomeComponent,
    VerificationComponent,
    VerifyComponent,
    DiceComponent,
    CoinflipComponent,
    KenoComponent,
    MinesComponent,
    WheelComponent,
    RingoffortuneComponent,
    RouletteComponent,
    SwordComponent,
    CaveofplunderComponent,
    UserFavComponent,
    CasinoComponent,
    TfaloginComponent,
    AffiliateComponent,
    PromotionComponent,
    SportsComponent,
    NewspinComponent,
    BustabittestComponent,
    SupportComponent,
    UndermaintainComponent,
    ProvablyFairComponent,
    PlinkoComponent,
    WithdrawHistoryComponent,
    DepositHistoryComponent,
    PromotionInfoComponent,
    WalletComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NgxSliderModule,
    HttpClientModule,
    FormsModule,
    CarouselModule,
    HighchartsChartModule,
    NgxWheelModule,
    BsDatepickerModule.forRoot(),
    ToastrModule.forRoot({
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      timeOut: 4000
    }),
    ChartModule,
    SocketIoModule.forRoot(Socketconfig),
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        //whitelistedDomains: [],
        //blacklistedRoutes: []
      }
    }),
    ModalModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
