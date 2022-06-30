import { Observable } from "rxjs";
import { first } from "rxjs/operators";

export const readFirst = <T>(obs$: Observable<T>): Promise<T> =>
  obs$.pipe(first()).toPromise();
