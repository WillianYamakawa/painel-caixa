import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AppStorageService } from "./app-storage";
import { Observable } from "rxjs";

export interface OptionVO<T>{
    code: T;
    label: string
}

@Injectable({
  providedIn: 'root'
})
export class OptionsService {
  apiUrl: string;

  constructor(private http: HttpClient, private appStorage: AppStorageService) {
    this.apiUrl = `${appStorage.ApiUrl}/options`;
  }

  getProductOptions(): Observable<OptionVO<number>[]> {
    return this.http.get<OptionVO<number>[]>(`${this.apiUrl}/product-options`);
  }
}