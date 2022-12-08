import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { 
  AngularFirestore, 
  AngularFirestoreCollection, 
  DocumentReference,
  QuerySnapshot
} from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot, Router } from '@angular/router';
import { BehaviorSubject, combineLatest, map, Observable, of, switchMap } from 'rxjs';
import IClip from 'src/app/models/clip.model';


@Injectable({
  providedIn: 'root'
})
export class ClipService implements Resolve<IClip | null> {
  private clipsCollection: AngularFirestoreCollection<IClip>
  pageClips: IClip[] = []
  pendingRequest = false;

  constructor(
    private db: AngularFirestore,
    private auth: AngularFireAuth,
    private storage: AngularFireStorage,
    private router: Router
  ) {
    this.clipsCollection = db.collection('clips');
  }

  createClip(clip: IClip): Promise<DocumentReference<IClip>> {
    return this.clipsCollection.add(clip)
  }

  getUserClips(sort$: BehaviorSubject<string>) {
    return combineLatest([this.auth.user, sort$]).pipe(
      switchMap(values => {
        const [user, sort] = values

        if (!user) {
          return of([])
        }

        const query = this.clipsCollection.ref.where(
          'uid', '==', user.uid
        ).orderBy(
          'timestamp',
          sort === '1' ? 'desc' : 'asc'
        )

        return query.get()
      }),
      map((snapshot) => (snapshot as QuerySnapshot<IClip>).docs)
    )
  }

  updateClip(id: string, title: string) {
    return this.clipsCollection.doc(id).update({
      title
    })
  }

  async deleteClip(clip: IClip) {
    const clipRef = this.storage.ref(`clips/${clip.fileName}`)
    console.log(clip.screenshotFileName);
    const screenshotRef = this.storage.ref(
      `screenshots/${clip.screenshotFileName}`
    )

    console.log(screenshotRef)
    await screenshotRef.delete()
    await clipRef.delete()


    await this.clipsCollection.doc(clip.docID).delete()
  }

  async getClips() {
    if(this.pendingRequest) {
      return
    }

    this.pendingRequest = true
    let query = this.clipsCollection.ref.orderBy('timestamp','desc').limit(6)

    const { length } = this.pageClips;

    if(length) {
      const lastDocID = this.pageClips[length - 1].docID;
      const lastDoc = await this.clipsCollection.doc(lastDocID)
        .get()
        .toPromise()
      query = query.startAfter(lastDoc) 
    }

    const snapshot = await query.get()

    snapshot.forEach(doc => {
      this.pageClips.push({
        docID: doc.id,
        ...doc.data()
      })
    })

    this.pendingRequest = false

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.clipsCollection.doc(route.params.id)
        .get()
        .pipe(
          map(snapshot => {
            const data = snapshot.data()
            
            if(!data) {
              this.router.navigateByUrl('/');
              return null
            }

            return data
          }) 
        )
  }
}
