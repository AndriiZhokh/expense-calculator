import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

const MODULES = [
  MatToolbarModule,
  MatListModule,
  MatExpansionModule,
  MatCardModule,
  MatButtonModule,
  MatInputModule,
];

@NgModule({
  imports: [ ...MODULES ],
  exports: [ ...MODULES ],
})
export class MaterialModule { }
