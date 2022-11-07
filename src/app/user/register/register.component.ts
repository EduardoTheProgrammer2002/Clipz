import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import IUser from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth/auth.service';
import { EmailTaken } from '../validators/email-taken';
import { RegisterValidators } from '../validators/register-validators';

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
  inSubmission = false;

  constructor(
    private auth: AuthService,
    private emailTaken: EmailTaken
  ) {}

  //Forms controls for the inputs
  name = new FormControl('', [
    Validators.minLength(3),
    Validators.required
  ])
  email = new FormControl('', [
    Validators.required,
    Validators.email
  ], [this.emailTaken.validate])
  age = new FormControl<number | null>(null, [
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
    age: this.age,
    phoneNumber: this.phoneNumber,
    password: this.password,
    confirmPassword: this.confirmPassword
  }, [RegisterValidators.match('password', 'confirmPassword')])

  async register() {
    this.showAlert = true;
    this.alertMsg = 'Please wait! Your account is being created.'
    this.alertColor = 'blue'
    this.inSubmission = true

    try {
      this.auth.createUser(this.registerForm.value as IUser);

    } catch (e:any) {
      this.inSubmission = false

      switch (e.code) {
        case 'auth/email-already-in-use':
          this.alertMsg = 'Email already in use'
          break;
      
        case 'auth/invalid-email':
          this.alertMsg = 'Invalid Email'
          break;
      
        case 'auth/operation-not-allowed':
          this.alertMsg = 'Operation not allowed'
          break;
      
        case 'auth/weak-password':
          this.alertMsg = 'Weak password'
          break;
      
        default:
          this.alertMsg = 'An unexpected error occured';
          console.log(e);
          
          break;
      }

      this.alertColor = 'red'
      return
    }
    
    this.alertMsg = 'Success! Your account has been created.'
    this.alertColor = 'green'
  }
}
