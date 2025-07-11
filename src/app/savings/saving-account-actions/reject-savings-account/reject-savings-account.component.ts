/** Angular Imports */
import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Dates } from 'app/core/utils/dates';

/** Custom Services */
import { SavingsService } from 'app/savings/savings.service';
import { SettingsService } from 'app/settings/settings.service';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { STANDALONE_SHARED_IMPORTS } from 'app/standalone-shared.module';

/**
 * Reject Savings Account Component
 */
@Component({
  selector: 'mifosx-reject-savings-account',
  templateUrl: './reject-savings-account.component.html',
  styleUrls: ['./reject-savings-account.component.scss'],
  imports: [
    ...STANDALONE_SHARED_IMPORTS,
    CdkTextareaAutosize
  ]
})
export class RejectSavingsAccountComponent implements OnInit {
  /** Minimum date allowed. */
  minDate = new Date(2000, 0, 1);
  /** Maximum date allowed. */
  maxDate = new Date();
  /** Reject Saving Account form. */
  rejectSavingsAccountForm: UntypedFormGroup;
  /** Savings Account Id */
  accountId: any;

  /**
   * @param {FormBuilder} formBuilder Form Builder
   * @param {SavingsService} savingsService Savings Service
   * @param {Dates} dateUtils Date Utils
   * @param {ActivatedRoute} route Activated Route
   * @param {Router} router Router
   * @param {SettingsService} settingsService Setting service
   */
  constructor(
    private formBuilder: UntypedFormBuilder,
    private savingsService: SavingsService,
    private dateUtils: Dates,
    private route: ActivatedRoute,
    private router: Router,
    private settingsService: SettingsService
  ) {
    this.accountId = this.route.snapshot.params['savingAccountId'];
  }

  /**
   * Creates the reject savings form.
   */
  ngOnInit() {
    this.maxDate = this.settingsService.businessDate;
    this.createRejectSavingsAccountForm();
  }

  /**
   * Creates the reject savings account form.
   */
  createRejectSavingsAccountForm() {
    this.rejectSavingsAccountForm = this.formBuilder.group({
      rejectedOnDate: [
        '',
        Validators.required
      ],
      note: ['']
    });
  }

  /**
   * Submits the form and rejects the saving account,
   * if successful redirects to the saving account.
   */
  submit() {
    const rejectSavingsAccountFormData = this.rejectSavingsAccountForm.value;
    const locale = this.settingsService.language.code;
    const dateFormat = this.settingsService.dateFormat;
    const prevRejectedOnDate: Date = this.rejectSavingsAccountForm.value.rejectedOnDate;
    if (rejectSavingsAccountFormData.rejectedOnDate instanceof Date) {
      rejectSavingsAccountFormData.rejectedOnDate = this.dateUtils.formatDate(prevRejectedOnDate, dateFormat);
    }
    const data = {
      ...rejectSavingsAccountFormData,
      dateFormat,
      locale
    };
    this.savingsService.executeSavingsAccountCommand(this.accountId, 'reject', data).subscribe(() => {
      this.router.navigate(['../../'], { relativeTo: this.route });
    });
  }
}
