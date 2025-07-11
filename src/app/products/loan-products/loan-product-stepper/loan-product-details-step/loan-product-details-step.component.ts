/** Angular Imports */
import { Component, OnInit, Input } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Dates } from 'app/core/utils/dates';

/** Custom Services */
import { SettingsService } from 'app/settings/settings.service';
import { MatTooltip } from '@angular/material/tooltip';
import { MatCheckbox } from '@angular/material/checkbox';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { MatStepperPrevious, MatStepperNext } from '@angular/material/stepper';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { STANDALONE_SHARED_IMPORTS } from 'app/standalone-shared.module';

@Component({
  selector: 'mifosx-loan-product-details-step',
  templateUrl: './loan-product-details-step.component.html',
  styleUrls: ['./loan-product-details-step.component.scss'],
  imports: [
    ...STANDALONE_SHARED_IMPORTS,
    MatTooltip,
    MatCheckbox,
    CdkTextareaAutosize,
    MatStepperPrevious,
    FaIconComponent,
    MatStepperNext
  ]
})
export class LoanProductDetailsStepComponent implements OnInit {
  @Input() loanProductsTemplate: any;

  loanProductDetailsForm: UntypedFormGroup;

  fundData: any;

  minDate = new Date(2000, 0, 1);
  maxDate = new Date(new Date().setFullYear(new Date().getFullYear() + 10));

  /**
   * @param {FormBuilder} formBuilder Form Builder.
   * @param {Dates} dateUtils Date Utils.
   * @param {SettingsService} settingsService Settings Service.
   */

  constructor(
    private formBuilder: UntypedFormBuilder,
    private dateUtils: Dates,
    private settingsService: SettingsService
  ) {
    this.createLoanProductDetailsForm();
  }

  ngOnInit() {
    this.fundData = this.loanProductsTemplate.fundOptions;

    this.loanProductDetailsForm.patchValue({
      name: this.loanProductsTemplate.name,
      shortName: this.loanProductsTemplate.shortName,
      description: this.loanProductsTemplate.description,
      externalId: this.loanProductsTemplate.externalId,
      fundId: this.loanProductsTemplate.fundId,
      startDate: this.loanProductsTemplate.startDate && new Date(this.loanProductsTemplate.startDate),
      closeDate: this.loanProductsTemplate.closeDate && new Date(this.loanProductsTemplate.closeDate),
      includeInBorrowerCycle: this.loanProductsTemplate.includeInBorrowerCycle
    });
  }

  createLoanProductDetailsForm() {
    this.loanProductDetailsForm = this.formBuilder.group({
      name: [
        '',
        Validators.required
      ],
      shortName: [
        '',
        Validators.required
      ],
      description: [''],
      externalId: [''],
      fundId: [''],
      startDate: [''],
      closeDate: [''],
      includeInBorrowerCycle: [false]
    });
  }

  get loanProductDetails() {
    const loanProductDetailsFormData = this.loanProductDetailsForm.value;
    const prevStartDate: Date = this.loanProductDetailsForm.value.startDate;
    const prevCloseDate: Date = this.loanProductDetailsForm.value.closeDate;
    const dateFormat = this.settingsService.dateFormat;
    if (loanProductDetailsFormData.startDate instanceof Date) {
      loanProductDetailsFormData.startDate = this.dateUtils.formatDate(prevStartDate, dateFormat) || '';
    }
    if (loanProductDetailsFormData.closeDate instanceof Date) {
      loanProductDetailsFormData.closeDate = this.dateUtils.formatDate(prevCloseDate, dateFormat) || '';
    }
    return loanProductDetailsFormData;
  }
}
