import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  // Alert props
  alertMsg = ''
  alertColor = 'blue'
  showAlert = false
  inSubmission = false


  credentials = {
    email:'',
    password:''
  }

  constructor(
    private auth: AngularFireAuth,
   
  ) { }

  ngOnInit(): void {
  }

  async login() {
    this.alertMsg = 'Please wait! Your account is being created'
    this.alertColor = 'blue'
    this.showAlert = true;
    this.inSubmission = true;


    try {
      await this.auth.signInWithEmailAndPassword(
        this.credentials.email, this.credentials.password
      )
    } catch (error:any) {
      switch (error.code) {
        case "auth/invalid-email":
          this.alertMsg = 'Invalid Email'
          break;

        case "auth/user-not-found":
          this.alertMsg = 'User not found'
          break;

        case "auth/user-disabled":
          this.alertMsg = 'The user is disabled'
          break;

        case "auth/wrong-password":
          this.alertMsg = 'The password is incorrect'
          break;
      
        default:
          this.alertMsg = 'An unexpected error has occured!'
          break;
      }
      this.alertColor = 'red'
      this.inSubmission = false;
      return
    }

    this.alertMsg = 'Success! now you are logged in'
    this.alertColor = 'green'
  }

}
