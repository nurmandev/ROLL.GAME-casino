import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { JwtModule } from "@auth0/angular-jwt";
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NotifierModule } from 'angular-notifier';
import { CookieService } from 'ngx-cookie-service';
import { ChartsModule, ThemeService } from 'ng2-charts';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular'; 

import { ToastrModule } from 'ngx-toastr';
import { AngularEditorModule } from '@kolkov/angular-editor';
import {NgxPaginationModule} from 'ngx-pagination';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { NavbarComponent } from './shared/navbar/navbar.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SpinnerComponent } from './shared/spinner/spinner.component';
import { ContentAnimateDirective } from './shared/directives/content-animate.directive';
import { LogoutComponent } from './logout/logout.component';
import { ActivityComponent } from './activity/activity.component';
import { SitesettingsComponent } from './sitesettings/sitesettings.component';
import { CmsComponent } from './cms/cms.component';
import { CmsViewComponent } from './cms-view/cms-view.component';
import { UsersComponent } from './users/users.component';
import { UserInfoComponent } from './user-info/user-info.component';
import { WithdrawComponent } from './withdraw/withdraw.component';
import { DepositComponent } from './deposit/deposit.component';
import { DepositInfoComponent } from './deposit-info/deposit-info.component';
import { WithdrawInfoComponent } from './withdraw-info/withdraw-info.component';
import { CurrencyComponent } from './currency/currency.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { SupportComponent } from './support/support.component';
import { SupportInfoComponent } from './support-info/support-info.component';
import { AddCurrenciesComponent } from './add-currencies/add-currencies.component';
import { CurrencyInfoComponent } from './currency-info/currency-info.component';
import { HistoriesComponent } from './histories/histories.component';
import { CaveHistoryComponent } from './cave-history/cave-history.component';
import { DiceHistoryComponent } from './dice-history/dice-history.component';
import { FortuneHistoryComponent } from './fortune-history/fortune-history.component';
import { KenoHistoryComponent } from './keno-history/keno-history.component';
import { LimboHistoryComponent } from './limbo-history/limbo-history.component';
import { MinesHistoryComponent } from './mines-history/mines-history.component';
import { RouletteHistoryComponent } from './roulette-history/roulette-history.component';
import { WheelHistoryComponent } from './wheel-history/wheel-history.component';
import { CoinflipHistoryComponent } from './coinflip-history/coinflip-history.component';
import { GameListComponent } from './game-list/game-list.component';
import { GameHistoryComponent } from './game-history/game-history.component';
import { UserGameinfoComponent } from './user-gameinfo/user-gameinfo.component';
import { ProfitComponent } from './profit/profit.component';
import { SwordHistoryComponent } from './sword-history/sword-history.component';
import { PatternComponent } from './pattern/pattern.component';
import { PlinkoHistoryComponent } from './plinko-history/plinko-history.component';
import { CrashHistoryComponent } from './crash-history/crash-history.component';
import { GameListInfoComponent } from './game-list-info/game-list-info.component';
import { VipComponent } from './vip/vip.component';
import { VipInfoComponent } from './vip-info/vip-info.component';
import { NotifyComponent } from './notify/notify.component';
import { NotifyInfoComponent } from './notify-info/notify-info.component';
import { AddNotifyComponent } from './add-notify/add-notify.component';
import { BlogComponent } from './blog/blog.component';
import { BlogInfoComponent } from './blog-info/blog-info.component';
import { AddBlogComponent } from './add-blog/add-blog.component';

export function tokenGetter() {
  return localStorage.getItem('Key');
}

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SidebarComponent,
    FooterComponent,
    DashboardComponent,
    SpinnerComponent,
    ContentAnimateDirective,
    LoginComponent,
    LogoutComponent,
    ActivityComponent,
    SitesettingsComponent,
    CmsComponent,
    CmsViewComponent,
    UsersComponent,
    UserInfoComponent,
    WithdrawComponent,
    DepositComponent,
    DepositInfoComponent,
    WithdrawInfoComponent,
    CurrencyComponent,
    ChangePasswordComponent,
    SupportComponent,
    SupportInfoComponent,
    AddCurrenciesComponent,
    CurrencyInfoComponent,
    HistoriesComponent,
    CaveHistoryComponent,
    DiceHistoryComponent,
    FortuneHistoryComponent,
    KenoHistoryComponent,
    LimboHistoryComponent,
    MinesHistoryComponent,
    RouletteHistoryComponent,
    WheelHistoryComponent,
    CoinflipHistoryComponent,
    GameListComponent,
    GameHistoryComponent,
    UserGameinfoComponent,
    ProfitComponent,
    SwordHistoryComponent,
    PatternComponent,
    PlinkoHistoryComponent,
    CrashHistoryComponent,
    GameListInfoComponent,
    VipComponent,
    VipInfoComponent,
    NotifyComponent,
    NotifyInfoComponent,
    AddNotifyComponent,
    BlogComponent,
    BlogInfoComponent,
    AddBlogComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    ChartsModule,
    HttpClientModule,
    CKEditorModule,
    NgxPaginationModule,
    AngularEditorModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      timeOut: 4000
    }),
    NotifierModule.withConfig({
      position: {
        horizontal: { position: 'right', distance: 12 },
        vertical: { position: 'top', distance: 12, gap: 10 }
      },
    }),
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: [],
        blacklistedRoutes: []
      }
    })
  ],
  providers: [ThemeService, DatePipe, CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
