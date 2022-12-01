import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable, of } from 'rxjs';
import IUser from 'src/app/models/user.model';
import { delay, map, filter, switchMap } from "rxjs/operators";
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usersCollection: AngularFirestoreCollection<IUser>;
  public isAuthenticated$: Observable<boolean>
  public isAuthenticatedWithDelay$: Observable<boolean>;
  private redirect = false;

  constructor(
    private auth: AngularFireAuth,
    private db: AngularFirestore,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.usersCollection = this.db.collection('users');
    this.isAuthenticated$ = auth.user.pipe(
      map(user => !!user)
    )
    this.isAuthenticatedWithDelay$ = this.isAuthenticated$.pipe(
      delay(1000)
    )

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(e => this.route.firstChild),
      switchMap(route => route?.data ?? of({}))
    ).subscribe(data => {
      this.redirect = data.authOnly ?? false
    })
  }


  public async createUser(user:IUser) {
    if(!user.password) {
      throw new Error('password not provided!');
    }

    const userCred = await this.auth.createUserWithEmailAndPassword(
      user.email as string, user.password as string
    )
    
    if(!userCred.user) {
      throw new Error("User can't be found.")
    }

    await this.usersCollection.doc(userCred.user?.uid).set({
      name: user.name,
      email: user.email,
      age: user.age,
      phoneNumber: user.phoneNumber
    })

    await userCred.user.updateProfile({
      displayName: user.name
    })
  }

  async logout(event: Event) {
    if (event) {
      event.preventDefault()
    }

    await this.auth.signOut()

    if(this.redirect) {
      await this.router.navigateByUrl('/about')
      return
    }
  }
}
