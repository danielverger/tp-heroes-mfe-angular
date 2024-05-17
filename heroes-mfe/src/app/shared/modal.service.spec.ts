import { TestBed } from '@angular/core/testing';

import { ModalService } from './modal.service';
import { ConfirmDialogComponent } from './confirm/confirm-dialog.component';
import { LoaderComponent } from './loader/loader.component';

import { MatSnackBar, MatSnackBarConfig, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

describe('ModalService', () => {
  let service: ModalService;
  let matDialog: MatDialog;
  let snackBar: MatSnackBar;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        MatDialogModule,
        MatSnackBarModule
      ]
    });
    service = TestBed.inject(ModalService);
    matDialog = TestBed.inject(MatDialog);
    snackBar = TestBed.inject(MatSnackBar);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should display a matdialog when calling confirmDialog', () => {
    const dialog = spyOn(matDialog, 'open');
    service.confirmDialog('title', 'message');

    expect(dialog).toHaveBeenCalledWith(
      ConfirmDialogComponent, { width: '350px', data: { title: 'title', message: 'message' }}
    );
  });

  it('should display a snackBar when calling openSnackBar', () => {
    const dialog = spyOn(snackBar, 'open');
    service.openSnackBar('message', 'info');
    const config = new MatSnackBarConfig();
    config.politeness = 'assertive';
    config.announcementMessage = '';
    config.duration = 1200;
    config.data = null; 
    config.horizontalPosition = 'end';
    config.verticalPosition = 'top';
    config.panelClass = 'info-snackbar';
    expect(dialog).toHaveBeenCalledWith('message', '', config );
  });

  it('should display a loading matdialog when calling showLoading', () => {
    const dialog = spyOn(matDialog, 'open');
    service.showLoading();

    expect(dialog).toHaveBeenCalledWith(
      LoaderComponent, { disableClose: true, panelClass: 'loader-dialog' }
    );
  });

  it('should remove a loading matdialog when calling closeLoading', () => {
    service.showLoading();
    expect(service.dialogRef).not.toBe(null);
    service.closeLoading();
    expect(service.dialogRef).toBe(null);
  });
});
