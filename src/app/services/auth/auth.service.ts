import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import IUser from 'src/app/models/user.model';
import { delay, map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usersCollection: AngularFirestoreCollection<IUser>;
  public isAuthenticated$: Observable<boolean>
  public isAuthenticatedWithDelay$: Observable<boolean>;

  constructor(
    private auth: AngularFireAuth,
    private db: AngularFirestore
  ) {
    this.usersCollection = this.db.collection('users');
    this.isAuthenticated$ = auth.user.pipe(
      map(user => !!user)
    )
    this.isAuthenticatedWithDelay$ = this.isAuthenticated$.pipe(
      delay(1000)
    )
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
}
