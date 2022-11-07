import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export class RegisterValidators {
    static match(controlName:string, matchingName:string): ValidatorFn {
        return (fg: AbstractControl): ValidationErrors | null => {
            const control = fg.get(controlName);
            const matchingControl = fg.get(matchingName);

            if (!control || !matchingControl) {
                console.log('Form controls can not be found in the form group.');
                
                return {controlNotFound: false }
            }

            const error = control.value === matchingControl.value ? null : {noMatch: true}

            matchingControl.setErrors(error);

            return error
        }
    }
}
