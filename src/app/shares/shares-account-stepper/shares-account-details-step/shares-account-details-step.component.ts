/** Angular Imports */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { SettingsService } from 'app/settings/settings.service';

/** Custom Services */
import { SharesService } from 'app/shares/shares.service';
import { MatStepperPrevious, MatStepperNext } from '@angular/material/stepper';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { STANDALONE_SHARED_IMPORTS } from 'app/standalone-shared.module';

/**
 * Shares Account Details Step
 */
@Component({
  selector: 'mifosx-shares-account-details-step',
  templateUrl: './shares-account-details-step.component.html',
  styleUrls: ['./shares-account-details-step.component.scss'],
  imports: [
    ...STANDALONE_SHARED_IMPORTS,
    MatStepperPrevious,
    FaIconComponent,
    MatStepperNext
  ]
})
export class SharesAccountDetailsStepComponent implements OnInit {
  /** Shares Account Template */
  @Input() sharesAccountTemplate: any;

  /** Minimum date allowed. */
  minDate = new Date(2000, 0, 1);
  /** Maximum date allowed. */
  maxDate = new Date();
  /** Product Data */
  productData: any;
  /** Shares Account Details Form */
  sharesAccountDetailsForm: UntypedFormGroup;

  /** Shares Account Template with product data  */
  @Output() sharesAccountProductTemplate = new EventEmitter();

  /**
   * Sets share account details form.
   * @param {FormBuilder} formBuilder Form Builder.
   * @param {SharesService} sharesService Shares Service.
   * @param {SettingsService} settingsService Settings Service
   */
  constructor(
    private formBuilder: UntypedFormBuilder,
    private sharesService: SharesService,
    private settingsService: SettingsService
  ) {
    this.createSharesAccountDetailsForm();
  }

  ngOnInit() {
    this.maxDate = this.settingsService.businessDate;
    this.buildDependencies();
    if (this.sharesAccountTemplate) {
      this.productData = this.sharesAccountTemplate.productOptions;
      if (this.sharesAccountTemplate.productId) {
        this.sharesAccountDetailsForm.patchValue({
          productId: this.sharesAccountTemplate.productId,
          submittedDate:
            this.sharesAccountTemplate.timeline.submittedOnDate &&
            new Date(this.sharesAccountTemplate.timeline.submittedOnDate),
          externalId: this.sharesAccountTemplate.externalId
        });
      }
    }
  }

  /**
   * Creates shares account details form.
   */
  createSharesAccountDetailsForm() {
    this.sharesAccountDetailsForm = this.formBuilder.group({
      productId: [
        '',
        Validators.required
      ],
      submittedDate: [
        '',
        Validators.required
      ],
      externalId: ['']
    });
  }

  /**
   * Fetches shares account product template on productId value changes
   */
  buildDependencies() {
    const clientId = this.sharesAccountTemplate.clientId;
    this.sharesAccountDetailsForm.get('productId').valueChanges.subscribe((productId: string) => {
      this.sharesService.getSharesAccountTemplate(clientId, productId).subscribe((response: any) => {
        this.sharesAccountProductTemplate.emit(response);
      });
    });
  }

  /**
   * Returns shares account form value.
   */
  get sharesAccountDetails() {
    return this.sharesAccountDetailsForm.value;
  }
}
