import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent  {
  // Alert Props
  showAlert = false
  alertMsg = 'Please wait! Your account is being created'
  alertColor = 'blue'

  //Forms controls for the inputs
  name = new FormControl('', [
    Validators.minLength(3),
    Validators.required
  ])
  email = new FormControl('', [
    Validators.required,
    Validators.email
  ])
  age = new FormControl('', [
    Validators.required,
    Validators.min(16),
    Validators.max(100)
  ])
  phoneNumber = new FormControl('', [
    Validators.required,
    Validators.minLength(13),
    Validators.maxLength(13)
  ])
  password = new FormControl('', [
    Validators.required,
    Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm)
  ])
  confirmPassword = new FormControl('', [
    Validators.required
  ])

  //Form group to register the Form
  registerForm = new FormGroup({
    name: this.name,
    email: this.email,
    Age: this.age,
    phoneNumber: this.phoneNumber,
    password: this.password,
    confirmPassword: this.confirmPassword
  })

  register() {
    this.showAlert = true;
    this.alertMsg = 'Please wait! Your account is being created.'
    this.alertColor = 'blue'
    
  }
}
