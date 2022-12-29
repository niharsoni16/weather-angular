import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../weather.service';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  constructor(
    private weather: WeatherService,
    private spinner: NgxSpinnerService
  ) {}
  ngOnInit(): void {
    // this.historyData=JSON.parse(localStorage.getItem('myData'))
    // this.historyData=[]
    let objLocal: any = localStorage.getItem('myData');
    this.historyData = objLocal ? JSON.parse(objLocal) : [];
    console.log(this.historyData);
    this.callData('Ahmedabad');
  }
  // commentValue='';
  // searchRegion=''
  regionFromAPI = '';
  temp = true;
  wind_direction = true;
  tempValue = '';
  // humidityValue=26;
  // tempValue=27;
  wind_KM_unit = 'KM/hr';
  wind_MILE_unit = 'mile/hr';
  city: any;
  currentCondition: any = {};
  nextDays: any = {};
  frequentSearch = ['Ahmedabad', 'Bharuch', 'Goa', 'surat', 'Gandhinagar'];
  // search=document.getElementById('search-region-box')
  historyData: any = [];
  dataFromApi: any = [];
  sampleData: any;
  _history: any;
  _res: any;

  // getData() {
  //   this.spinner.show();
  //   this.weather.apiGet(this.city).subscribe(
  //     (res: any) => {
  //       console.log(res);
  //       this.regionFromAPI = res.region;
  //       this.currentCondition = res.currentConditions;
  //       this.nextDays = res.next_days;
  //       console.log(this.nextDays);
  //       this.setApiData(this.city);
  //       this.spinner.hide();
  //       // this.city='';
  //     },
  //     (err: any) => {
  //       console.log(this);
  //       this.spinner.hide();
  //     }
  //   );
  // }
  callData(data: any, from?: any, index?: any) {
    // console.log(data);
    // console.log(this.historyData);
    // this.historyData.forEach((element:any) => {
    //   // console.log(element);
    //   if(this.city===element.city){
    //     console.log("City is already in history")
    //   }
    //   else{
    //     console.log("city will be added")
    //   }
    // });
    // if(data===this.historyData.city){
    // console.log("city will be added")
    this.city = data;
    let cityIndex: any = this.historyData.findIndex(
      (x: any) => x?.city === this.city
    );
    console.log(cityIndex);
    if (cityIndex > -1) {
      console.log('Its already in a history');
      return;
    } else {
      console.log('check city Else part');
      console.log(this._res);

      this.weather.apiGet(data).subscribe(
        (res: any) => {
          // console.log(res);
          this._res = res;
          this.regionFromAPI = res.region;
          this.currentCondition = res.currentConditions;
          this.nextDays = res.next_days;
          this.spinner.hide();
          if (from) {
            this.setApiData(data);
          }

          this.city = '';
        },
        (err: any) => {
          console.log(this);
          // this.searchBox.value='';
          this.spinner.hide();
        }
      );

      // this.historyData[index].temp=this._res.currentConditions.temp.c;
      // this.historyData[index].comment=this._res.currentConditions.comment;
      // }
    }
  }

  updateFromApi(data: any, index?: any) {
    this.weather.apiGet(data).subscribe(
      (res: any) => {
        // this._history=history;
        // console.log(this._currentCondition);
        // console.log(this._history);
        this.historyData[index].temp = res.currentConditions.temp.c;
        // this._history.temp=this.currentCondition.temp.c;
        this.historyData[index].comment = res.currentConditions.comment;

        this.historyData[index].city = data;
        console.log(this.historyData);
        localStorage.setItem('myData', JSON.stringify(this.historyData));
      },
      (err: any) => {
        console.log(this);
      }
    );
    // this.historyData.push({
    //   city:this.historyData.city,
    //   temp:this._currentCondition.temp.c,
    //   comment:this._currentCondition.comment
    // })
    // this.historyData.push((_history:any,_currentCondition:any)=>{

    // this.historyData.city=_history.city,
    // this.historyData.temp=45,
    // this.historyData.comment=_currentCondition.comment
    // })
  }

  deleteElement(index: any) {
    console.log(index);
    this.historyData.splice(index, 1);
    localStorage.setItem('myData', JSON.stringify(this.historyData));
  }
  setApiData(data: any) {
    this.historyData.push({
      city: data,
      temp: this.currentCondition.temp.c,
      comment: this.currentCondition.comment,
    });
    localStorage.setItem('myData', JSON.stringify(this.historyData));
  }
  clearHistory() {
    console.log('LocalStorage will be cleared');
    localStorage.removeItem('myData');
    localStorage.setItem('myData', JSON.stringify(this.historyData));
  }
  // getApiData() {
  //   // this.dataFromApi=localStorage.getItem('myData');
  //   // this.dataFromApi = JSON.stringify(localStorage.getItem('myData'));
  //   // localStorage['myData'] = JSON.stringify(this.historyData);
  //   // this.dataFromApi = JSON.parse(localStorage['myData']);

  //   // console.log(this.dataFromApi);
  //   // console.log(this.dataFromApi);
  // }

  async options(i?: any) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-warning',
      },
      buttonsStyling: true,
    });
    swalWithBootstrapButtons
      .fire({
        showCloseButton: true,
        title: 'Delete the city',
        text: 'Press Confirm to delete the city',
        showCancelButton: true,
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        reverseButtons: false,
      })
      .then((result) => {
        if (result.value) {
          this.deleteElement(i);
          // this.updateData(i);
          // console.log('Confirm Press');
        }
        // console.log('Cancel press');
      });
  }
  async deleteAll() {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-warning',
      },
      buttonsStyling: true,
    });
    swalWithBootstrapButtons
      .fire({
        showCloseButton: true,
        title: 'Delete all data',
        text: 'It will delete all data from LocalStorage',
        showCancelButton: true,
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        reverseButtons: false,
      })
      .then((result) => {
        if (result.value) {
          this.clearHistory();
          return;
        }
        console.log('LocalStorage will not be cleared');
      });
  }

  // function(){
  //   Swal("Deleted!", "Your imaginary file has been deleted.", "success");
  // });
}
