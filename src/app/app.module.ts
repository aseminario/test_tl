import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ListComponent } from './list/list.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { AddressApiService } from './services/address-api.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ParseAddressService } from './services/parse-address.service';
import { SimpleDialogComponent } from './simple-dialog/simple-dialog.component';
import { MatDialogModule} from '@angular/material/dialog';
import { MatSlideToggleModule} from '@angular/material/slide-toggle';
import { AppSettingsService } from './services/app-settings.service';

@NgModule({
  declarations: [
    AppComponent,
    ListComponent,
    SimpleDialogComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSlideToggleModule
  ],
  providers: [AddressApiService, ParseAddressService, AppSettingsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
