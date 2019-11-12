import { NgModule } from '@angular/core';
import {
  MatInputModule,
  MatCardModule,
  MatButtonModule,
  MatToolbarModule,
  MatExpansionModule,
  MatProgressSpinnerModule,
  MatPaginatorModule,
  MatDialogModule,
  MatSidenavModule,
  MatIconModule,
  MatListModule
} from '@angular/material';
import { LayoutModule } from '@angular/cdk/layout';

@NgModule({
 exports: [
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatDialogModule,
    LayoutModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule
  ]
})
export class AngularMaterialModule {}
