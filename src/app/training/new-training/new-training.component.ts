import { Component, OnInit } from "@angular/core";
import { TrainingService } from "../training/training.service";
import { Exercise } from "../training/exercise.model";
import { NgForm } from "@angular/forms";
import { AngularFirestore } from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Component({
  selector: "app-new-training",
  templateUrl: "./new-training.component.html",
  styleUrls: ["./new-training.component.css"]
})
export class NewTrainingComponent implements OnInit {
  exercises: Observable<any>;

  constructor(
    private trainingService: TrainingService,
    private db: AngularFirestore
  ) {}

  ngOnInit() {
    this.exercises = this.db.collection("availableExercises").snapshotChanges()
                      .pipe(
                        map(docArray => {
                          return docArray.map( doc => {
                            return {
                              id: doc.payload.doc.id,
                              ...doc.payload.doc.data()
                            }
                          })
                        })                
                      );

    //this.exercises = this.db.collection('availableExercises').valueChanges();
    //this.exercises = this.trainingService.getAvailableExercise();
    //console.log(this.exercises);
  }

  onStartTraining(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise);
  }
}
