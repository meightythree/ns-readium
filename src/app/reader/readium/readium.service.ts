import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import {book} from './book';

@Injectable()
export class ReadiumService {

    loadEbookContent(): Observable<string> {
        return of(book)
    }
}