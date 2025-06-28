import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { GameinnerComponent } from './gameinner/gameinner.component';
import { HomeComponent } from './home/home.component';
import { BustabitComponent } from './bustabit/bustabit.component';
import { GlobalsettingsComponent } from './globalsettings/globalsettings.component';
import { MyprivacyComponent } from './myprivacy/myprivacy.component';
import { VerificationComponent } from './verification/verification.component';
import { SecurityComponent } from './security/security.component';
import { ActivesessionComponent } from './activesession/activesession.component';
import { VerifyComponent } from './verify/verify.component';
import { BonusComponent } from './bonus/bonus.component';
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
import { AffiliateComponent } from './affiliate/affiliate.component';
import { PromotionComponent } from './promotion/promotion.component';
import { SportsComponent } from './sports/sports.component';
import { NewspinComponent } from './newspin/newspin.component';
import { BustabittestComponent } from './bustabittest/bustabittest.component';
import { SupportComponent } from './support/support.component';
import { UndermaintainComponent } from './undermaintain/undermaintain.component';
import { ProvablyFairComponent } from './provably-fair/provably-fair.component';
import { PlinkoComponent } from './plinko/plinko.component';
import { WithdrawHistoryComponent } from './withdraw-history/withdraw-history.component';
import { DepositHistoryComponent } from './deposit-history/deposit-history.component';
import { PromotionInfoComponent } from './promotion-info/promotion-info.component';
import { WalletComponent } from './wallet/wallet.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'activate_withdraw', component: HomeComponent },
  { path: 'activate_account', component: HomeComponent },
  { path: 'reset_password', component: HomeComponent },
  { path: 'referrals', component: HomeComponent },
  { path: 'limbo', component: GameinnerComponent },
  { path: 'dice', component:DiceComponent},
  { path: 'coinflip', component:CoinflipComponent},
  { path: 'bustabit', component: BustabitComponent},
  { path: 'general', component:GlobalsettingsComponent},
  { path: 'myprivacy', component:MyprivacyComponent},
  { path: 'verification', component:VerificationComponent},
  { path: 'security', component:SecurityComponent},
  { path: 'activesession', component:ActivesessionComponent},
  { path: 'verify', component:VerifyComponent},
  { path: 'bonus', component:BonusComponent},
  { path: 'keno', component:KenoComponent},
  { path: 'mines', component:MinesComponent},
  { path: 'wheel', component:WheelComponent},
  { path: 'ringoffortune', component:RingoffortuneComponent},
  { path: 'roulette', component:RouletteComponent},
  { path: 'spinwheel', component:SwordComponent},
  { path: 'caveofplunder', component:CaveofplunderComponent},
  { path: 'favourite', component:UserFavComponent},
  { path: 'casino', component:CasinoComponent},
  { path: 'affiliate', component:AffiliateComponent},
  { path: 'promotion', component:PromotionComponent},
  { path: 'sports', component:SportsComponent},
  { path: 'sword', component:NewspinComponent},
  { path: 'test', component:BustabittestComponent},
  { path: 'support', component:SupportComponent},
  { path: 'maintanence', component:UndermaintainComponent},
  { path: 'provably-fair', component:ProvablyFairComponent},
  { path: 'plinko', component:PlinkoComponent},
  { path: 'deposit/history', component:DepositHistoryComponent},
  { path: 'withdraw/history', component:WithdrawHistoryComponent},
  { path: 'promotion/:id', component:PromotionInfoComponent},
  { path: 'wallet', component:WalletComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }