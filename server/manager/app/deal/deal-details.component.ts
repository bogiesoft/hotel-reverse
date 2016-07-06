import { Component, Input, OnInit } from 'angular2/core';
import { RouteParams, Router} from 'angular2/router';
import { Response } from 'angular2/http';

import { DealsService } from '../services/deals.service';
import { Deal } from '../model/deal';

// import pipe for expressing date, datetime
import { MakeKoreanDatePipe } from '../custom-date.pipe';
import { MakeKoreanDateTimePipe } from '../custom-datetime.pipe';

@Component({
  selector: 'deal-details',
  templateUrl: './app/template/deal-details.html',
  pipes: [ MakeKoreanDatePipe, MakeKoreanDateTimePipe ]
})

export class DealDetailsComponent implements OnInit {
  @Input() deal : Deal;
  hotel_ID: string;
  booking_Num: number;

  constructor(private dealsService: DealsService,
              private routeParams: RouteParams,
              private router: Router){
  }

  ngOnInit(){
    this.hotel_ID = this.routeParams.get('hotel_ID');
    this.booking_Num = Number.parseInt(this.routeParams.get('booking_Num'));

    console.log('getting deal with booking_Num: ', this.booking_Num);

    this.dealsService
      .getDeal(this.hotel_ID, this.booking_Num)
      .subscribe(
        d => this.deal = d,
        error => console.error('Error: ' + error),
        () => console.log('Successfully fetched a Deal!')
      );
  }

  gotoDealsList(){
    let link = ['Deals'];
    this.router.navigate(link);
  }

  getContract(){
    this.dealsService
      .getContract(this.hotel_ID, this.booking_Num)
      .subscribe(
        d => console.log(d),
        error => console.log(error),
        () => console.log("done")
      )
    alert("거래가 성립되었습니다!")
  }
}
