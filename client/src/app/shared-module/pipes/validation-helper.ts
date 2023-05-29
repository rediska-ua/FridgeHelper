import { Pipe, PipeTransform } from '@angular/core';
import { FormControl, FormGroup, ValidationErrors } from '@angular/forms';

@Pipe({
  name: 'validationFormat',
})
export class ValidationHelper implements PipeTransform {
  transform(source: any, name: any): string[] {
    if (source instanceof FormControl) {
      return this.formatMessages((source as FormControl).errors, name);
    }
    return this.formatMessages(source as ValidationErrors, name);
  }

  formatMessages(errors: ValidationErrors | null, name: string): string[] {
    const messages: string[] = [];
    for (const errorName in errors) {
      switch (errorName) {
        case 'required':
          messages.push(`You must enter a ${name}`);
          break;
        case 'email':
          messages.push(`You must enter a ${name} in valid email format`);
          break;
        case 'minlength':
          messages.push(
            `A ${name} must be at least ${errors['minlength'].requiredLength} characters`
          );
          break;
        case 'pattern':
          messages.push(`The ${name} contains illegal characters`);
          break;
        case 'match':
          messages.push(
            `The ${name} value must match with ${errors['match'].matchTo} value`
          );
          break;
        case 'min':
          messages.push(`Number must be more then ${errors[errorName].min}`);
          break;
        case 'max':
          messages.push(`Number must be less then ${errors[errorName].max}`);
          break;
      }
    }
    return messages;
  }

  getTopErrorMessage(formGroup: FormGroup): string {
    let topErrorMsg = '';
    const controls = Object.keys(formGroup.controls);

    for (const control of controls) {
      const controlErrors = formGroup.get(control)?.errors;

      if (controlErrors) {
        const keyError = Object.keys(controlErrors).at(
          controlErrors['length'] - 1
        );

        break;
      }
    }
    return topErrorMsg;
  }
}
