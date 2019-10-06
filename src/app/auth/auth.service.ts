import { User } from "./user.model";
import { AuthData } from "./auth-data.model";
import { Subject } from "rxjs/Subject";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { AngularFireAuth } from "@angular/fire/auth";
import { TrainingService } from '../training/training/training.service';

@Injectable()
export class AuthService {
  authChange = new Subject<boolean>();
  //private user: User;
  private isAuthenticated: boolean=false;

  constructor(private router: Router, private afAuth: AngularFireAuth, private trainingService: TrainingService) {}


  initAuthListener() {
    this.afAuth.authState.subscribe(user=> {
      if(user) {
        this.isAuthenticated = true;
        this.authChange.next(true);
        this.router.navigate(["/training"]);
      } else {
        this.afAuth.auth.signOut();
        this.isAuthenticated =false;
        this.authChange.next(false);
        this.router.navigate(["/login"]);
      }
    });
  }

  registerUser(authData: AuthData) {
    this.afAuth.auth
      .createUserWithEmailAndPassword(authData.email, authData.password)
      .then(result => {
        console.log(result);
        this.authSuccessfully();
      })
      .catch(error => {
        console.log(error);
      });

    /*
    this.user = {
      email: authData.email,
      userId: Math.round(Math.random() * 1000).toString()
    };
   */
    
  }
  login(authData: AuthData) {
    this.afAuth.auth
      .signInWithEmailAndPassword(authData.email, authData.password)
      .then(result => {
        console.log(result);
        
      })
      .catch(error => {
        console.log(error);
      });
    /*
    this.user = {
      email: authData.email,
      userId: Math.round(Math.random() * 1000).toString()
    };
*/
    
  }



  logout() {
    this.trainingService.cancelSubscription();
   
  }

  isAuth() {
    return this.isAuthenticated;
  }
}
