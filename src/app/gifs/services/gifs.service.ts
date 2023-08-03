import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Gif, SearchResponse } from '../interfaces/gifs.interfaces';
import { JsonPipe } from '@angular/common';

@Injectable({providedIn: 'root'})
export class GifsService {
  public gifList:Gif[] = [];
  private  _tagHistory: string[] = [];
  private apiKey:       string = 'YTrbjg4WLU0S9qlLrhRFJ416LrLypnri';
  private serviceUrl:   string = 'https://api.giphy.com/v1/gifs/search';
  private test:any[] = [];


  constructor( private http:HttpClient ) {
    this.loadLocalStorage();

   }

  get tagsHistory() {
    return [...this._tagHistory];
  }

  private organizeHistory(tag: string){
    tag = tag.toLowerCase();
    if ( this._tagHistory.includes(tag)){
      this._tagHistory = this._tagHistory.filter( (oldTag) => oldTag != tag)
    }
    this._tagHistory.unshift( tag );
    this._tagHistory = this.tagsHistory.splice(0,10);
    this.saveLocalStorage();

  }

  private saveLocalStorage():void {
    localStorage.setItem('history', JSON.stringify( this._tagHistory ));
  }

  private loadLocalStorage() {
    if( !localStorage.getItem('history') ) return;
    this._tagHistory= JSON.parse( localStorage.getItem('history')! );
    this.searchTag(this._tagHistory[0]);

  }

   searchTag( tag:string ):void {
    if (tag.length === 0) return;
    this.organizeHistory(tag);

    const params = new HttpParams()
      .set('api_key', this.apiKey )
      .set('limit', '10' )
      .set('q', tag )


    /* fetch('https://api.giphy.com/v1/gifs/search?api_key=YTrbjg4WLU0S9qlLrhRFJ416LrLypnri&q=valorant&limit=10')
    .then( resp => resp.json() )
    .then( data => console.log(data) );
    const resp = await fetch('https://api.giphy.com/v1/gifs/search?api_key=YTrbjg4WLU0S9qlLrhRFJ416LrLypnri&q=valorant&limit=10');
    const data = await resp.json();
    console.log(data);*/

    this.http.get<SearchResponse>(`${ this.serviceUrl }`, { params })
    .subscribe( resp => {
      this.gifList = resp.data;
      console.log('gifs:',this.gifList);
    });

  }

}
