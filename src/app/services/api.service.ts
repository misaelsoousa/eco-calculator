import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

export interface Municipio {
  id: number;
  cidade: string;
  value: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = '/api';

  constructor(private http: HttpClient) { }

  getMunicipios(): Observable<Municipio[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    return this.http.get<Municipio[]>(`${this.baseUrl}/Eco/municipios`, { headers })
  }

  postRelatorio(payload: {
    origem: string;
    destino: string;
    formato: number;
    tipo: number;
    quantidade: number;
    carregamento: number;
  }): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    return this.http.post<any>(`${this.baseUrl}/Eco`, payload, { headers })
  }


}
