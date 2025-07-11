/** Angular Imports */
import { Component, OnInit, Inject } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose
} from '@angular/material/dialog';
import {
  UntypedFormBuilder,
  Validators,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
  ReactiveFormsModule
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { PasswordsUtility } from 'app/core/utils/passwords-utility';
import { environment } from '../../../environments/environment';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { InputPasswordComponent } from '../input-password/input-password.component';
import { STANDALONE_SHARED_IMPORTS } from 'app/standalone-shared.module';

/**
 * Change Password Dialog component.
 */
@Component({
  selector: 'mifosx-change-password-dialog',
  templateUrl: './change-password-dialog.component.html',
  styleUrls: ['./change-password-dialog.component.scss'],
  imports: [
    ...STANDALONE_SHARED_IMPORTS,
    MatDialogTitle,
    CdkScrollable,
    MatDialogContent,
    InputPasswordComponent,
    MatDialogActions,
    MatDialogClose
  ]
})
export class ChangePasswordDialogComponent implements OnInit {
  minPasswordLength: number = environment.minPasswordLength | 12;

  /** Change Password Form */
  changePasswordForm: any;
  /** Password input field type. */
  passwordInputType: string[] = [
    'password',
    'password'
  ];

  /**
   * @param {MatDialogRef} dialogRef Component reference to dialog.
   * @param {any} data Provides any data.
   */
  constructor(
    public dialogRef: MatDialogRef<ChangePasswordDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: UntypedFormBuilder,
    private passwordsUtility: PasswordsUtility
  ) {}

  ngOnInit() {
    this.createChangePasswordForm();
  }

  /** Change Password form */
  createChangePasswordForm() {
    this.changePasswordForm = this.formBuilder.group(
      {
        password: [
          '',
          this.passwordsUtility.getPasswordValidators()
        ],
        repeatPassword: [
          '',
          [
            Validators.required,
            this.confirmPassword('password')]
        ]
      },
      { updateOn: 'blur' }
    );
  }

  /**
   * Confirm Change Password of Users
   * @param controlNameToCompare Form Control Name to be compared.
   */
  confirmPassword(controlNameToCompare: string): ValidatorFn {
    return (c: AbstractControl): ValidationErrors | null => {
      if (c.value == null || c.value.length === 0) {
        return null;
      }
      const controlToCompare = c.root.get(controlNameToCompare);
      if (controlToCompare) {
        const subscription: Subscription = controlToCompare.valueChanges.subscribe(() => {
          c.updateValueAndValidity();
          subscription.unsubscribe();
        });
      }
      return controlToCompare && controlToCompare.value !== c.value ? { notequal: true } : null;
    };
  }
}
