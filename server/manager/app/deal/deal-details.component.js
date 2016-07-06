System.register(['angular2/core', 'angular2/router', '../services/deals.service', '../custom-date.pipe', '../custom-datetime.pipe'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, router_1, deals_service_1, custom_date_pipe_1, custom_datetime_pipe_1;
    var DealDetailsComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (deals_service_1_1) {
                deals_service_1 = deals_service_1_1;
            },
            function (custom_date_pipe_1_1) {
                custom_date_pipe_1 = custom_date_pipe_1_1;
            },
            function (custom_datetime_pipe_1_1) {
                custom_datetime_pipe_1 = custom_datetime_pipe_1_1;
            }],
        execute: function() {
            DealDetailsComponent = (function () {
                function DealDetailsComponent(dealsService, routeParams, router) {
                    this.dealsService = dealsService;
                    this.routeParams = routeParams;
                    this.router = router;
                }
                DealDetailsComponent.prototype.ngOnInit = function () {
                    var _this = this;
                    this.hotel_ID = this.routeParams.get('hotel_ID');
                    this.booking_Num = Number.parseInt(this.routeParams.get('booking_Num'));
                    console.log('getting deal with booking_Num: ', this.booking_Num);
                    this.dealsService
                        .getDeal(this.hotel_ID, this.booking_Num)
                        .subscribe(function (d) { return _this.deal = d; }, function (error) { return console.error('Error: ' + error); }, function () { return console.log('Successfully fetched a Deal!'); });
                };
                DealDetailsComponent.prototype.gotoDealsList = function () {
                    var link = ['Deals'];
                    this.router.navigate(link);
                };
                DealDetailsComponent.prototype.getContract = function () {
                    this.dealsService
                        .getContract(this.hotel_ID, this.booking_Num)
                        .subscribe(function (d) { return console.log(d); }, function (error) { return console.log(error); }, function () { return console.log("done"); });
                    alert("거래가 성립되었습니다!");
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], DealDetailsComponent.prototype, "deal", void 0);
                DealDetailsComponent = __decorate([
                    core_1.Component({
                        selector: 'deal-details',
                        templateUrl: './app/template/deal-details.html',
                        pipes: [custom_date_pipe_1.MakeKoreanDatePipe, custom_datetime_pipe_1.MakeKoreanDateTimePipe]
                    }), 
                    __metadata('design:paramtypes', [deals_service_1.DealsService, router_1.RouteParams, router_1.Router])
                ], DealDetailsComponent);
                return DealDetailsComponent;
            }());
            exports_1("DealDetailsComponent", DealDetailsComponent);
        }
    }
});
//# sourceMappingURL=deal-details.component.js.map