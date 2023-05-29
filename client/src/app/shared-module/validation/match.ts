import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class MatchValidator {
  static Match(matchTo: string, reverse?: boolean): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!!control.parent && reverse) {
        const c = (control.parent?.controls as any)[matchTo] as AbstractControl;
        if (c) {
          c.updateValueAndValidity();
        }
        return null;
      }
      if (
        !!control.parent &&
        !!control.parent.value &&
        control.value === (control.parent?.controls as any)[matchTo].value
      ) {
        return null;
      }
      return { match: { matchTo: matchTo } };
    };
  }
}
