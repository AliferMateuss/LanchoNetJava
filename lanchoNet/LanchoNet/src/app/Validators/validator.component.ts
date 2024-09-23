import { Injectable } from "@angular/core";
import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";

@Injectable({
  providedIn: 'root'
})

export class GenericValidator {
  constructor() { }

  static isValidCpf(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const cpf = control.value?.replace(/[^\d]+/g, '');

      if (!cpf) {
        return { cpfNotValid: true };
      }

      if (cpf.length !== 11 || /^(.)\1+$/.test(cpf)) {
        return { cpfNotValid: true };
      }

      let sum = 0;
      let rest: number;

      for (let i = 1; i <= 9; i++) {
        sum = sum + parseInt(cpf.substring(i - 1, i)) * (11 - i);
      }

      rest = (sum * 10) % 11;

      if ((rest === 10) || (rest === 11)) {
        rest = 0;
      }

      if (rest !== parseInt(cpf.substring(9, 10))) {
        return { cpfNotValid: true };
      }

      sum = 0;

      for (let i = 1; i <= 10; i++) {
        sum = sum + parseInt(cpf.substring(i - 1, i)) * (12 - i);
      }

      rest = (sum * 10) % 11;

      if ((rest === 10) || (rest === 11)) {
        rest = 0;
      }

      if (rest !== parseInt(cpf.substring(10, 11))) {
        return { cpfNotValid: true };
      }

      return null;
    };
  }

  static isValidCpfOrNull(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const cpf = control.value?.replace(/[^\d]+/g, '');

      if (!cpf) {
        return { cpfNotValid: true };
      }

      if (cpf.length !== 11 || /^(.)\1+$/.test(cpf)) {
        return { cpfNotValid: true };
      }

      let sum = 0;
      let rest: number;

      for (let i = 1; i <= 9; i++) {
        sum = sum + parseInt(cpf.substring(i - 1, i)) * (11 - i);
      }

      rest = (sum * 10) % 11;

      if ((rest === 10) || (rest === 11)) {
        rest = 0;
      }

      if (rest !== parseInt(cpf.substring(9, 10))) {
        return { cpfNotValid: true };
      }

      sum = 0;

      for (let i = 1; i <= 10; i++) {
        sum = sum + parseInt(cpf.substring(i - 1, i)) * (12 - i);
      }

      rest = (sum * 10) % 11;

      if ((rest === 10) || (rest === 11)) {
        rest = 0;
      }

      if (rest !== parseInt(cpf.substring(10, 11))) {
        return { cpfNotValid: true };
      }

      return null;
    };
  }

  static isValidCnpj(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      const cnpj: string = control.value?.replace(/[^\d]+/g, '');

      if (!cnpj || cnpj.length !== 14) {
        return { cnpjNotValid: true };
      }

      const multiplicador1: number[] = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
      const multiplicador2: number[] = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
      let soma: number = 0;
      let resto: number;
      let digito: string;
      let tempCnpj: string;

      tempCnpj = cnpj.substring(0, 12);

      for (let i = 0; i < 12; i++) {
        soma += parseInt(tempCnpj[i]) * multiplicador1[i];
      }

      resto = soma % 11;
      resto = resto < 2 ? 0 : 11 - resto;
      digito = resto.toString();
      tempCnpj = tempCnpj + digito;

      soma = 0;
      for (let i = 0; i < 13; i++) {
        soma += parseInt(tempCnpj[i]) * multiplicador2[i];
      }

      resto = soma % 11;
      resto = resto < 2 ? 0 : 11 - resto;
      digito = digito + resto.toString();

      return cnpj.endsWith(digito) ? null : { cnpjNotValid: true };
    };
  }

  static isValidCnpjOrNull(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {

      if (!control.value) {
        return null;
      }

      const cnpj: string = control.value?.replace(/[^\d]+/g, '');

      if (!cnpj || cnpj.length !== 14) {
        return { cnpjNotValid: true };
      }

      const multiplicador1: number[] = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
      const multiplicador2: number[] = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
      let soma: number = 0;
      let resto: number;
      let digito: string;
      let tempCnpj: string;

      tempCnpj = cnpj.substring(0, 12);

      for (let i = 0; i < 12; i++) {
        soma += parseInt(tempCnpj[i]) * multiplicador1[i];
      }

      resto = soma % 11;
      resto = resto < 2 ? 0 : 11 - resto;
      digito = resto.toString();
      tempCnpj = tempCnpj + digito;

      soma = 0;
      for (let i = 0; i < 13; i++) {
        soma += parseInt(tempCnpj[i]) * multiplicador2[i];
      }

      resto = soma % 11;
      resto = resto < 2 ? 0 : 11 - resto;
      digito = digito + resto.toString();

      return cnpj.endsWith(digito) ? null : { cnpjNotValid: true };
    };
  }

  static rgValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const rg = control.value.replace(/[^\d]+/g, '');

      if (rg.length < 8) {
        return { rgInvalid: true };
      }

      return null;
    };
  }

  static telefoneValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; 
      }

      const telefone = control.value.replace(/[^\d]+/g, '');

      if (telefone.length !== 11) {
        return { telefoneInvalido: true }; 
      }

      return null;
    };
  }

  static inscricaoEstadualValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; 
      }

      const inscricaoEstadual = control.value.replace(/[^\d]+/g, '');

      if (inscricaoEstadual.length < 9) {
        return { IEInvalida: true }; 
      }

      return null;
    };
  }

  static emailValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const email = control.value;

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return { emailInvalido: true };
      }

      return null;
    };
  }

  static isValidPis(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pis: string = control.value?.replace(/[^\d]+/g, '');

      if (!pis || pis.length !== 11) {
        return { pisNotValid: true };
      }

      const multiplicador: number[] = [3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
      let soma: number = 0;
      let resto: number;

      for (let i = 0; i < 10; i++) {
        soma += parseInt(pis[i]) * multiplicador[i];
      }

      resto = soma % 11;
      resto = resto < 2 ? 0 : 11 - resto;

      return pis.endsWith(resto.toString()) ? null : { pisNotValid: true };
    };
  }

  static lessThan18Years(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const dateOfBirth = new Date(control.value);
      const today = new Date();
      today.setFullYear(today.getFullYear() - 18);

      if (dateOfBirth && dateOfBirth >= today) {
        return { lessThan18Years: true };
      }

      return null;
    };
  }
}
