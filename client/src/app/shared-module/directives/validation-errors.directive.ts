import {
  Directive,
  Input,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { FormGroup } from '@angular/forms';

import { ValidationHelper } from '../pipes/validation-helper';

@Directive({
  selector: '[appValidationErrors]',
})
export class ValidationErrorsDirective implements OnInit {
  constructor(
    private container: ViewContainerRef,
    private template: TemplateRef<unknown>
  ) {}

  @Input('appValidationErrorsControl')
  control?: string;

  @Input('appValidationErrorsLabel')
  label?: string;

  @Input('appValidationErrors')
  formGroup?: FormGroup;

  ngOnInit() {
    const validationHelper = new ValidationHelper();
    if (this.formGroup && this.control) {
      this.handleControlStatusChanges(this.control, validationHelper);
    } else if (this.formGroup) {
      this.handleFormValueChanges(this.formGroup, validationHelper);
    }
  }

  handleControlStatusChanges(
    controlName: string,
    validationHelper: ValidationHelper
  ): void {
    const control = this.formGroup?.get(controlName);
    if (control) {
      control.statusChanges.subscribe(() => {
        if (this.container.length > 0) {
          this.container.clear();
        }
        if (control && control.dirty && control.invalid && control.errors) {
          validationHelper
            .formatMessages(control.errors, this.label ?? this.control ?? '')
            .forEach((err) => {
              this.container.createEmbeddedView(this.template, {
                $implicit: err,
              });
            });
        }
      });
    }
  }

  handleFormValueChanges(
    formGroup: FormGroup,
    validationHelper: ValidationHelper
  ): void {
    formGroup.valueChanges.subscribe(() => {
      if (this.container.length > 0) {
        this.container.clear();
      }
      if (this.formGroup && this.formGroup.dirty && this.formGroup.invalid) {
        this.container.createEmbeddedView(this.template, {
          $implicit: validationHelper.getTopErrorMessage(this.formGroup),
        });
      }
    });
  }
}
