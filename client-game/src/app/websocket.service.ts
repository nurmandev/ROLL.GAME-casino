import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket: WebSocket;
  public messages: Observable<any>;

  constructor() { }

  public connect(): void {
    this.socket = new WebSocket('wss://bustabit.com/socket.io/?EIO=3&transport=websocket');

    this.messages = new Observable(observer => {
      this.socket.onmessage = (event) => {
        observer.next(event.data);
      };
      this.socket.onerror = (event) => {
        observer.error(event);
      };
      this.socket.onclose = () => {
        observer.complete();
      };
    });
  }

  public send(message: any): void {
    this.socket.send(JSON.stringify(message));
  }

  public close(): void {
    this.socket.close();
  }
}