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
  MatListModule,
  MatTreeModule,
  MatFormFieldModule,
  MatGridListModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatTabsModule,
  MatAutocompleteModule,
  MatSlideToggleModule,
  MatCheckboxModule
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
    MatListModule,
    MatTreeModule,
    MatFormFieldModule,
    MatGridListModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTabsModule,
    MatAutocompleteModule,
    MatSlideToggleModule,
    MatCheckboxModule
  ]
})
export class AngularMaterialModule {}
