import { ValidatorFn } from "@angular/forms";
import { AbstractControl } from "@angular/forms";
import { ValidationErrors } from "@angular/forms";  

export function multiploDe(n: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const valor = Number(control.value);

        if (control.valid === null || control.value === "") return null;
            return valor % n === 0 ? null : { multiploDe: { n, valor }
        }
        
    };
}