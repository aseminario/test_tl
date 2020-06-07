import { Component, OnInit, ChangeDetectionStrategy, ViewChild, AfterViewInit, TrackByFunction, AfterViewChecked } from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { AddressApiService } from '../services/address-api.service';
import { Address } from '../models/address';
import { SelectionModel } from '@angular/cdk/collections';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SimpleDialogComponent, DialogData } from '../simple-dialog/simple-dialog.component';
import { Observable } from 'rxjs';
import { AppSettingsService } from '../services/app-settings.service';
import { MatSlideToggle, MatSlideToggleChange } from '@angular/material/slide-toggle';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListComponent implements OnInit, AfterViewInit {

  form: FormGroup;
  throwErrorsForm: FormGroup;
  inEditMode = false;
  selection = new SelectionModel<Address>(false, []);
  displayedColumns: string[] = ['streetNumber', 'street', 'city', 'state', 'zip', 'actions'];
  editColumns: string[] = ['streetNumber-edit', 'street-edit', 'city-edit', 'state-edit', 'zip-edit', 'actions-edit'];
  dataSource: MatTableDataSource<Address>;
  @ViewChild(MatTable) table: MatTable<Address>;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('topPaginator') topPaginator: MatPaginator;

  constructor(
    private addressApiService: AddressApiService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    public appSettings: AppSettingsService
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      streetNumber: ['', Validators.required],
      street: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zip: ['', Validators.required]
    });

    this.throwErrorsForm = this.fb.group({
      errorSwitch: [this.appSettings.thowErrorsOnSave]
    });

    // this.selection.changed.pipe(
    //   tap(a => {
    //     console.log('do save', a);
    //   })
    // ).subscribe();
  }

  ngAfterViewInit(): void {
    // console.log('ngAfterViewInit 1', this.errorSwitch.checked)
    // this.errorSwitch.checked = this.appSettings.thowErrorsOnSave;
    // console.log('ngAfterViewInit 2', this.errorSwitch.checked)
    this.addressApiService.getAddresses().subscribe(
      (data) => {
        this.setUpNewDataSource(data);
      }
    );

  }

  applyFilter = ($event: any) => {
    this.dataSource.filter = $event.target.value.trim().toLowerCase();
  }


  syncPaginatorTop = (event: PageEvent) => {
    this.topPaginator.pageSize = event.pageSize;
    this.topPaginator.length = event.length;
    this.topPaginator.pageIndex = event.pageIndex;
    this.topPaginator.page.emit(event);
  }


  shouldUseViewRow = (index: number, rowData: Address): boolean => {
    return !(this.selection.isSelected(rowData));
  }
  shouldUseEditRow = (index: number, rowData: Address): boolean => {
    return (this.selection.isSelected(rowData));
  }

  throwErrorsChanged(event: any) {
    console.log('throwErrorsChanged', event);
    this.appSettings.thowErrorsOnSave = event.checked;
  }

  private setUpNewDataSource(addresses: Address[]){
    this.dataSource = new MatTableDataSource(addresses);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.topPaginator;
  }

  addRow(){

    if (this.inEditMode) {
      return;
    }

    this.selection.clear();
    const newRow: Address = {
      id: undefined,
      streetNumber: '',
      street: '',
      city: '',
      state: '',
      zip: ''
    };
    this.dataSource.data.unshift(newRow);
    this.setUpNewDataSource(this.dataSource.data);

    this.topPaginator.firstPage();
    this.sort.active = undefined;
    this.sort.sortChange.emit();

    this.editRow(newRow);

  }

  editRow = (row: Address) => {

    if (this.inEditMode) {
      return;
    }

    // console.log('editRow', row);
    this.form.setValue({
      streetNumber: row.streetNumber,
      street: row.street,
      city: row.city,
      state: row.state,
      zip: row.zip
    });
    this.selection.select(row);
    this.inEditMode = true;
    this.table.renderRows();
  }
  deleteRow = (row: Address) => {

    if (this.inEditMode) {
      return;
    }
    this.requestConfirmation('Do you want to remove this record?',undefined,'Yes', 'No').subscribe(
      result => {
        // console.log(`Dialgo result: ${result}`);
        if (result === true) {

          this.addressApiService.deleteAddress(row)
          .subscribe(
            result => {

              this.removeRowFromTable(row);

            },
            error => this.requestConfirmation('Error deleting ...', error, 'OK', undefined)
          );

        }
      }
    )

  }
  save = (row, newValues) => {
    var toSave = Object.assign({}, row, newValues);
    if (row.id === undefined) {
      // Insert
      this.addressApiService.addAddress(toSave)
      .subscribe(
        result => {
          Object.assign(row, toSave);
          this.exitEditMode();
        },
        error => this.requestConfirmation('Error adding ...', error, 'OK', undefined)
      );
    } else {
      // Update
      this.addressApiService.updateAddress(toSave)
      .subscribe(
        result => {
          Object.assign(row, toSave);
          this.exitEditMode();
        },
        error => this.requestConfirmation('Error saving ...', error, 'OK', undefined)
      );
    }

  }

  cancel = (row: Address) => {
    if (row.id === undefined) {
      this.removeRowFromTable(row);
    }
    this.exitEditMode();
  }

  private requestConfirmation(title: string, message: string, yesText: string, noText: string): Observable<boolean> {
    const dialogRef = this.dialog.open<SimpleDialogComponent, DialogData, boolean>(SimpleDialogComponent, {
      width: '250px',
      data: {title: title, message: message, yesText: yesText, noText: noText}
    });

    return dialogRef.afterClosed();
  }

  private exitEditMode() {
    this.inEditMode = false;
    this.selection.clear();
    this.table.renderRows();
  }

  private removeRowFromTable(row: Address) {
    this.dataSource.data.splice(this.dataSource.data.indexOf(row), 1);
    this.setUpNewDataSource(this.dataSource.data);
    this.exitEditMode();
  }
}
