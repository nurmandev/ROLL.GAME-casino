import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ActivityComponent } from './activity/activity.component';
import { SitesettingsComponent } from './sitesettings/sitesettings.component';
import { CmsComponent } from './cms/cms.component';
import { CmsViewComponent } from './cms-view/cms-view.component';
import { UsersComponent } from './users/users.component';
import { UserInfoComponent } from './user-info/user-info.component';
import { DepositComponent } from './deposit/deposit.component';
import { WithdrawComponent } from './withdraw/withdraw.component';
import { DepositInfoComponent } from './deposit-info/deposit-info.component';
import { WithdrawInfoComponent } from './withdraw-info/withdraw-info.component';
import { CurrencyComponent } from './currency/currency.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { Error404Component } from './error-pages/error404/error404.component';
import { SupportComponent } from './support/support.component';
import { SupportInfoComponent } from './support-info/support-info.component';
import { AddCurrenciesComponent } from './add-currencies/add-currencies.component';
import { CurrencyInfoComponent } from './currency-info/currency-info.component';
import { HistoriesComponent } from './histories/histories.component';
import { LimboHistoryComponent } from './limbo-history/limbo-history.component';
import { DiceHistoryComponent } from './dice-history/dice-history.component';
import { CoinflipHistoryComponent } from './coinflip-history/coinflip-history.component';
import { WheelHistoryComponent } from './wheel-history/wheel-history.component';
import { FortuneHistoryComponent } from './fortune-history/fortune-history.component';
import { CaveHistoryComponent } from './cave-history/cave-history.component';
import { RouletteHistoryComponent } from './roulette-history/roulette-history.component';
import { KenoHistoryComponent } from './keno-history/keno-history.component';
import { MinesHistoryComponent } from './mines-history/mines-history.component';
import { GameListComponent } from './game-list/game-list.component';
import { GameHistoryComponent } from './game-history/game-history.component';
import { SwordHistoryComponent } from './sword-history/sword-history.component';
import { UserGameinfoComponent } from './user-gameinfo/user-gameinfo.component';
import { ProfitComponent } from './profit/profit.component';
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

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'activity', component: ActivityComponent },
  { path: 'sitesettings', component: SitesettingsComponent },
  { path: 'cms', component: CmsComponent },
  { path: 'cms/:id', component: CmsViewComponent },
  { path: 'users', component: UsersComponent },
  { path: 'usersInfo/:id', component: UserInfoComponent },
  { path: 'deposit', component: DepositComponent },
  { path: 'withdraw', component: WithdrawComponent },
  { path: 'deposit/:id', component: DepositInfoComponent },
  { path: 'withdraw/:id', component: WithdrawInfoComponent },
  { path: 'currency', component: CurrencyComponent },
  { path: 'changePassword', component: ChangePasswordComponent },
  { path: 'support', component: SupportComponent },
  { path: 'support/:id', component: SupportInfoComponent },
  { path: 'addCurrency', component: AddCurrenciesComponent },
  { path: 'currencyInfo/:id', component: CurrencyInfoComponent },
  { path: 'limbo', component: HistoriesComponent },
  { path: 'gamehistory/limbo/:id', component: LimboHistoryComponent },
  { path: 'game_history', component: GameHistoryComponent },
  { path: 'gameList', component: GameListComponent },
  { path: 'kyc/user', component: UsersComponent },
  { path: 'profit', component: ProfitComponent },
  { path: 'gameList/:id', component: GameListInfoComponent },
  { path: 'viplist', component: VipComponent },
  { path: 'notify', component: NotifyComponent },
  { path: 'blog', component: BlogComponent },

  { path: 'viplist/:id', component: VipInfoComponent },
  { path: 'notify/:id', component: NotifyInfoComponent },
  { path: 'blog/:id', component: BlogInfoComponent },
  { path: 'addNotify', component: AddNotifyComponent },
  { path: 'addBlog', component: AddBlogComponent },
  { path: 'gamehistory/dice/:id', component: DiceHistoryComponent },

  { path: 'coinflip', component: HistoriesComponent },
  { path: 'gamehistory/coinflip/:id', component: CoinflipHistoryComponent },

  { path: 'wheel', component: HistoriesComponent },
  { path: 'gamehistory/wheel/:id', component: WheelHistoryComponent },

  { path: 'fortune', component: HistoriesComponent },
  { path: 'gamehistory/fortune/:id', component: FortuneHistoryComponent },

  { path: 'caveofplunder', component: HistoriesComponent },
  { path: 'gamehistory/caveofplunder/:id', component: CaveHistoryComponent },

  { path: 'keno', component: HistoriesComponent },
  { path: 'gamehistory/keno/:id', component: KenoHistoryComponent },

  { path: 'roulette', component: HistoriesComponent },
  { path: 'gamehistory/roulette/:id', component: RouletteHistoryComponent },

  { path: 'mines', component: HistoriesComponent },
  { path: 'gamehistory/mines/:id', component: MinesHistoryComponent },

  { path: 'sword', component: HistoriesComponent },
  { path: 'gamehistory/sword/:id', component: SwordHistoryComponent },

  { path: 'crash', component: HistoriesComponent },
  { path: 'gamehistory/crash/:id', component: CrashHistoryComponent },

  { path: 'plinko', component: HistoriesComponent },
  { path: 'gamehistory/plinko/:id', component: PlinkoHistoryComponent },

  { path: 'usersInfo/:id/:gameName', component: UserGameinfoComponent },

  { path: 'pattern', component: PatternComponent },

  { path: 'caveofplunder', component: CaveHistoryComponent },
  { path: 'error-pages', loadChildren: () => import('./error-pages/error-pages.module').then(m => m.ErrorPagesModule) },
  { path: '**', component: Error404Component },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

export const AppRoutingComponents = [LoginComponent, LogoutComponent, DashboardComponent, ActivityComponent, SitesettingsComponent, CmsComponent, CmsViewComponent, UsersComponent, UserInfoComponent]
