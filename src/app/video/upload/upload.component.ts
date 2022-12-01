import { Component, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import firebase from 'firebase/compat/app';
import { last, switchMap } from 'rxjs';
import { ClipService } from 'src/app/services/clip/clip.service';
import { v4 as uuid } from 'uuid';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnDestroy {
  isDragover = false
  file: File | null = null;
  otherSteps = false
  showAlert = false
  alertColor = 'blue'
  alertMsg = 'Please wait! your video is being uploaded.'
  inSubmission = false
  percentage = 0
  showPercentage = false
  user: firebase.User | null = null
  task?: AngularFireUploadTask


  // Controls
  title = new FormControl('', {
    validators: [
      Validators.required,
      Validators.minLength(3)
    ],
    nonNullable: true
  });

  uForm = new FormGroup({
    title: this.title
  })

  constructor(
    private storage: AngularFireStorage,
    private auth: AngularFireAuth,
    private clipService: ClipService,
    private router: Router
  ) { 
    auth.user.subscribe(user => this.user = user)
  }

  ngOnDestroy(): void {
    this.task?.cancel()
  }

  storeFile(e:Event) {
    this.isDragover = false
    this.file = (e as DragEvent).dataTransfer ?
      (e as DragEvent).dataTransfer?.files.item(0) ?? null :
      (e.target as HTMLInputElement).files?.item(0) ?? null

    if(!this.file || this.file.type !== 'video/mp4') {
      console.log('not a mp4 file');
      return
    }
    
    this.title.setValue(this.file.name.replace(/\.[^/.]+$/, ''));
    this.otherSteps = true
    console.log(this.file)
  }

  uploadFile() {
    this.uForm.disable()
    const clipId = uuid()
    const filePath = `clips/${clipId }.mp4`
    this.showAlert = true
    this.alertColor = 'blue'
    this.alertMsg = 'Please wait! your video is being uploaded.'
    this.inSubmission = true
    this.showPercentage = true
    

    this.task = this.storage.upload(filePath, this.file)
    const clipRef = this.storage.ref(filePath)

    this.task.percentageChanges().subscribe(progress => {
      this.percentage = progress as number / 100
    })

    this.task.snapshotChanges().pipe(
      last(),
      switchMap(() => clipRef.getDownloadURL())
    ).subscribe({
      next: async (url) => {
        const clip = {
          uid: this.user?.uid as string,
          displayName: this.user?.displayName as string,
          title: this.title.value,
          fileName: `${clipId}.mp4`,
          url,
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }

        const clipDocRef = await this.clipService.createClip(clip)

        setTimeout(() => {
          this.router.navigate([
            'clip', clipDocRef.id
          ]);
        }, 1000)
        
        

        this.alertColor = 'green'
        this.alertMsg = 'Success! Your clip is now ready to be shared with the world.'
        this.showPercentage = false;
      },
      error: (error) => {
        this.uForm.enable()
        this.alertColor = 'red'
        this.alertMsg = 'Upload failed! please try again later.'
        this.inSubmission = false
        this.showPercentage = false
        console.error(error)

      }
    })

  }

}
