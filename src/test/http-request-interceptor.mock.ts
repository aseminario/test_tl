import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { v4 as uuidv4 } from 'uuid';
import { Observable, of } from 'rxjs';
import { addressesResponse } from './addresses.response';




@Injectable()
export class HttpRequestInterceptorMock implements HttpInterceptor {
    constructor(private injector: Injector) {}

    intercept(request: HttpRequest<any>, next: HttpHandler):
              Observable<HttpEvent<any>> {
        if (request.url && request.url
         .indexOf(`https://0f1c6e64.s3.amazonaws.com/addresses.txt`) > -1) {

            return of(new HttpResponse({ status: 200, body: addressesResponse }));

        } else if (request.url && request.method === 'DELETE' && request.url
          .indexOf(`http://nodomain.tech/noApi`) > -1) {

            return of(new HttpResponse({ status: 200, body: true }));

        } else if (request.url && request.method === 'PUT' && request.url
          .indexOf(`http://nodomain.tech/noApi`) > -1) {

            return of(new HttpResponse({ status: 200, body: request.body }));

        } else if (request.url && request.method === 'POST' && request.url
          .indexOf(`http://nodomain.tech/noApi`) > -1) {
            request.body.id = uuidv4();
            return of(new HttpResponse({ status: 200, body: request.body }));

        }

        return next.handle(request);
    }
}
