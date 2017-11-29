import { FormControl } from '@angular/forms';

export class HomeValidator {

  static isValid(control: FormControl): any {


    if (control.value == null) {
      return {
        "Empty strings are invalid": true
      };
    }
    if (control.value !== '') {
      return {
        "Empty strings are invalid": true
      };
    }
    if (control.value !== ' ') {
      return {
        "Empty strings are invalid": true
      };
    }

    return null;
  }

}
