import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { ApiService } from '../api.service';

let mediaStream;
@Component({
  selector: 'app-watchvideo',
  templateUrl: './watchvideo.component.html',
  styleUrls: ['./watchvideo.component.scss']
})
export class WatchvideoComponent implements OnInit {
  @ViewChild('video') video: ElementRef;
  @ViewChild('videoPlay') videoPlay: ElementRef;
  @ViewChild('canvasfd') canvasfd: ElementRef;
  @ViewChild('content') content: ElementRef;
  @ViewChild('userVideoPlay') userVideoPlay: ElementRef;

  constructor(private fb: FormBuilder,
    private api: ApiService,
    private sanitizer: DomSanitizer,
    private snackbar: MatSnackBar,
    private dialogRef: MatDialog
  ) { }
  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }
  image: any;
  cnt_id: any;
  cnt_error: boolean;
  nameForm: FormGroup;
  intro: boolean = true;
  videoPart: boolean;
  Duration: any;
  submit: boolean = false;
  detection: boolean = false;
  videoComplete: boolean = false;
  Play: boolean = false;
  total = 0;
  Subscription: Subscription;
  uservideoPart: boolean = false;
  videoData: Blob[];
  downloadUrl: any;
  mediaRecorder: any;
  stream: MediaStream;
  interval: any;
  model: any;
  videoUrl: any;
  file:any;
  monet_id: any;
  detectStart: boolean = false;
  objects: any = [];
  denied: boolean = false;
  durationInterval: any;
  rVideo:any;
  horizontal: MatSnackBarHorizontalPosition = 'center';
  vertical: MatSnackBarVerticalPosition = 'top';



  ngOnInit(): void {
    // ****************************************** Used this method in place of URLSearchParams because URLSearchParams doesn't work properly with Hash Routing *************************************************************
    
    this.openCamera();
    
    
    this.nameValidation();
    this.api.allow$.subscribe((e: any) => {
      if (e === true) {
        this.openCamera();
      }
    })
    
  }

  //********************************************** Name field validation function *************************************************************
  nameValidation() {
    this.nameForm = this.fb.group({
      name: new FormControl('', Validators.required),
      email: new FormControl('', Validators.compose([Validators.required,Validators.email])),
    })
  }

  //********************************************** Submit button function *************************************************************
  next() {
    if (this.nameForm.invalid || this.stream === undefined) {
      this.submit = true;
      setTimeout(() => {
        this.submit = false;
      }, 3000);
      if (this.stream === undefined) {
        this.dialogRef.open(CameraPermission, {
          data: {
            width: 500,
            height: 400
          },
          disableClose: true
        })
      }
    }
    else {
      localStorage.setItem('Uname', this.nameForm.value.name)
      this.videoPart = true;
      this.intro = false;
      // this.videoUrl = 'https://pankajphour-locationadmin.netlify.app/assets/Thor.mp4'
      this.videoUrl = '/assets/Thor.mp4'
      setTimeout(()=>{
        const video = this.video.nativeElement;
        video.style.backgroundColor = 'white';
        video.srcObject = this.stream;
      },1000)
    }
  }


  //********************************************** Camera open function (hits on OnInit)*************************************************************
  openCamera() {
    // console.log("Load");
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream: any) => {
      mediaStream = stream;
      this.stream = stream;
    }, (error: any) => {
      
    })
  }


  //********************************************** Function hits on video start *************************************************************
  start(event: any) {
    this.content.nativeElement.style.maxWidth = '1920px';
    this.content.nativeElement.style.width = '100%';
    this.content.nativeElement.style.maxHeight = '80vh'
    this.content.nativeElement.style.height = '100%'
    this.durationInterval = setInterval(() => {
      this.Duration = Math.ceil((this.videoPlay.nativeElement.currentTime / this.videoPlay.nativeElement.duration) * 100);
    }, 10)
    this.startRecording();
  }

  //********************************************** Function hits on video pause *************************************************************
  pause(event: any) {
    clearInterval(this.interval);
    this.stopCamera();
  }

  // Function hits on video Ending 
  Ended(event: any) {
      this.detectStart = false;
      this.videoPart = false;
      this.videoComplete = true;
    clearInterval(this.durationInterval)
    clearInterval(this.interval);
    this.mediaRecorder.stop();
    this.stopCamera();
  }

  //********************************************** Function hits on video Buffering *************************************************************
  Waiting(e: any) {
    this.mediaRecorder.pause();
  }

  //********************************************** Function hits on playing video again after video buffering *************************************************************
  Playing(e: any) {
    this.mediaRecorder.resume();
  }

  //********************************************** Function hits on play button on  video *************************************************************
  play() {
    this.Play = true;
    this.videoPlay.nativeElement.play();
  }
  mediaStream = null;


  //********************************************** Stop camera function *************************************************************
  stopCamera() {
    mediaStream.getTracks().forEach(element => {
      element.stop();
    });
  }


  //********************************************** function for Sanitizing Blob URL *************************************************************
  modify(url: any) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  //********************************************** Function to start recording of user *************************************************************
  startRecording() {
    this.videoData = [];
      this.mediaRecorder = new MediaRecorder(this.stream);
    this.mediaRecorder.start();
    this.onDataAvailableEvent();
    this.onStopRecordingEvent();
  }

  //********************************************** Function for checking data after video recording of user *************************************************************
  onDataAvailableEvent() {
    try {
      this.mediaRecorder.ondataavailable = (event: any) => {
        if (event.data && event.data.size > 0) {
          this.videoData.push(event.data);
        }
      };
    } catch (error) {
      // console.log(error);
    }
  }

  //*********************************************** function hit on recording stopped of user *************************************************************
  onStopRecordingEvent() {
    try {
      this.mediaRecorder.onstop = (event: Event) => {
        const videoBuffer = new Blob(this.videoData, {
          type: 'video/mp4'
        });
        const url = window.URL.createObjectURL(videoBuffer); // you can download with <a> tag
        this.downloadUrl = this.modify(url);
        // console.log(this.downloadUrl);
        setTimeout(()=>{
          fetch(this.downloadUrl.changingThisBreaksApplicationSecurity).then((res:any) => res.blob()).then((e:any) => {
            // console.log(e)
            this.file = e;
          let self = this;
          let reader = new FileReader();
          reader.onload = function(e){
              // console.log(e);
          }
          reader.onloadend = function(end){
            // console.log(end);
            self.rVideo = end.target.result
            let params = {
              name:localStorage.getItem('Uname'),
              data:end.target.result
            }
            self.api.postRecording('/postVideo',params).subscribe((e:any)=>{
              // console.log(e);
              
            })
            
          }
          reader.readAsDataURL(self.file)

          })
        },2000)
      };
    } catch (error) {
      // console.log(error);
    }
  }

  //**********************************************  This function is used while testing for checking user video *************************************************************
  userVideo() {
    this.videoComplete = false;
    this.uservideoPart = true;
  }

}
//********************************************** */ this is for camera permission pop up*************************************************************
@Component({
  selector: 'app-watchvideo',
  templateUrl: './cameraPermission.html',
  styleUrls: ['./watchvideo.component.scss']
})



export class CameraPermission implements OnInit {
  constructor(
    private dialogRef: MatDialog,
    private api: ApiService
  ) { }
  ngOnInit(): void {
  }
  cancel() {
    this.dialogRef.closeAll();
  }
  allow() {
    this.api.allow.next(true);
    this.dialogRef.closeAll();
  }

}
