import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataExchangeService } from './data-exchange-service';
import { Controller } from '../models/Controller';
import { Action } from '../models/Action';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CoreService {

userDetails:any;

private readonly API: any = 'http://localhost:5000/api/'; //local Server

  private readonly httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
    }),
  };

  constructor(private http: HttpClient,private dataExchangeService:DataExchangeService) {
    if(this.dataExchangeService.getUserDetails()) {
     this.userDetails = this.dataExchangeService.getUserDetails();}
  }

  private addTokens<T>(object: T): T & { userToken: string | null; companyToken: string | null } {
  
   const   companyToken= this.userDetails?.data?.companyToken;
  const    userToken=this.userDetails?.data?.userToken;
  
    return {
      ...object,
      userToken,
      companyToken
    };
  }
  public getByIdData<T>(
    controller: Controller,
    action: Action,
    typeOrId: string | number|any
  ): Observable<Response> {
   
    const url = this.API + controller + '/' + action + '/' + typeOrId;
    return this.http.get<Response>(url, this.httpOptions);
  }

  public getAllData<T>(
    action: Action,
    controller: Controller
  ): Observable<Response> {
    
    const url = this.API + action + '/' + controller;
    return this.http.get<Response>(url, this.httpOptions);
  }

  public getDetailsData(
    controller: Controller,
    action: Action,
    object: any
  ): Observable<Response> {
     const payload = this.addTokens(object);
    const url = this.API + controller + '/' + action;
    return this.http.post<Response>(url, payload, this.httpOptions);
  }
  public SaveData(
    action: Action | any,
    controller: Controller,
    object:  any|null
  ): Observable<Response> {
    const payload = this.addTokens(object);
    const url = this.API + action + '/' + controller;

    return this.http.post<Response>(url, payload, this.httpOptions);
  }

  public UpdateData(
    controller: Controller,
    action: Action,
    object: any | null
  ): Observable<Response> {
    const payload = this.addTokens(object);
    const url = this.API + controller + '/' + action;
    return this.http.put<Response>(url, payload, this.httpOptions);
  }

  public DeleteData(
    controller: Controller,
    action: Action,
    object: any | null
  ): Observable<Response> {
        const payload = this.addTokens(object);
    const url = this.API + controller + '/' + action;
    return this.http.put<Response>(url, payload, this.httpOptions);
  }

  public upload(action: Action | any, controller: Controller, object: any) {
    const url = this.API + action + '/' + controller;
     //const payload = this.addTokens(object);
    return this.http.post<any>(url, object, {
      reportProgress: true,
      observe: 'events',
    });
  }
}
