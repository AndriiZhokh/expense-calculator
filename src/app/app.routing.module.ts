import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { YearComponent } from './components/year/year.component';

const routes: Routes = [ 
  { path: 'year', component: YearComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ],
})
export class AppRoutingModule {}