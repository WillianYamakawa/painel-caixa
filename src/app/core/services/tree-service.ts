import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppStorageService } from './app-storage';

export enum TreeType {
    ProductCategory = 1,
}

export interface TreeBasic {
    label: string;
    type: TreeType;
    parentId: number | null;
}

export interface Tree extends TreeBasic {
    id: number;
    children: Tree[];
}

export interface TreeUpdate {
    id: number;
    label: string
}

@Injectable({
    providedIn: 'root',
})
export class TreeService {
    apiUrl: string;

    constructor(private http: HttpClient, private appStorage: AppStorageService) {
        this.apiUrl = `${appStorage.ApiUrl}/tree`;
    }

    list(type: TreeType): Observable<Tree[]> {
        return this.http.get<Tree[]>(`${this.apiUrl}/list?treeType=${type}`);
    }

    create(tree: TreeBasic): Observable<number> {
        return this.http.post<number>(`${this.apiUrl}/create`, tree);
    }

    update(tree: TreeUpdate): Observable<number> {
        return this.http.post<number>(`${this.apiUrl}/update`, tree);
    }

    delete(treeId: number): Observable<string> {
        return this.http.patch<string>(`${this.apiUrl}/disable?treeId=${treeId}`, null);
    }
}
