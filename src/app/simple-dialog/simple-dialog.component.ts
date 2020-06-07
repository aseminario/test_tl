import { Component, OnInit, ChangeDetectionStrategy, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export class DialogData {
  title: string;
  message: string;
  yesText: string;
  noText: string;
}
@Component({
  selector: 'app-simple-dialog',
  templateUrl: './simple-dialog.component.html',
  styleUrls: ['./simple-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SimpleDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<SimpleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  ngOnInit(): void {

  }

  onNoClick = () => {
    this.dialogRef.close(false);
  }
  onYesClick = () => {
    this.dialogRef.close(true);
  }

}
