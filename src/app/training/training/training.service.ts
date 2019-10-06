import { Exercise } from "./exercise.model";
import { Subject } from "rxjs";
import {Subscription} from 'rxjs';

export class TrainingService {
  private availableExercise: Exercise[] = [
    { id: "crunches", name: "Crunches", duration: 30, calories: 8 },
    { id: "touch-toes", name: "Touch Toes", duration: 180, calories: 15 },
    { id: "crunches", name: "Side Lunges", duration: 120, calories: 18 },
    { id: "crunches", name: "Burpees", duration: 60, calories: 5 }
  ];

  exerciseChanged = new Subject<Exercise>();
  private runningExercise: Exercise;
  private exercise: Exercise[] = [];
  private fbSubs: Subscription[] = [];

  getAvailableExercise() {
    //returns a copy of availableExercise, it is a new object without affecting the original one
    return this.availableExercise.slice();
  }

  startExercise(selectedId: string) {
    this.runningExercise = this.availableExercise.find(
      ex => ex.id === selectedId
    );

    this.exerciseChanged.next({ ...this.runningExercise });
  }

  completeExercise() {
    this.exercise.push({
      ...this.runningExercise,
      date: new Date(),
      state: "completed"
    });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  cancelExercise(progress: number) {
    this.exercise.push({
      ...this.runningExercise,
      duration: this.runningExercise.duration * (progress / 100),
      calories: this.runningExercise.calories * (progress / 100),
      date: new Date(),
      state: "cancelled"
    });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  getRunningExercise() {
    return { ...this.runningExercise };
  }

  getCompletedOrCancelledExercise() {
    return this.exercise.slice();
  }

  cancelSubscription() {
    this.fbSubs.forEach(sub=>sub.unsubscribe());
  }
}
