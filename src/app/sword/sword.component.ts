import { Component, OnInit } from '@angular/core';
import { Options } from '@angular-slider/ngx-slider';
declare var jQuery: any;

@Component({
  selector: 'app-sword',
  templateUrl: './sword.component.html',
  styleUrls: ['./sword.component.css']
})
export class SwordComponent implements OnInit {
  constructor() {


(function($:any){
  var slotMachine = function() {
    var credits = 0,
      spinning:any = 5,
      spin = [0,0,0],
      slotsTypes:any = {
        'cherry': [2,5,10],
        'orange': [0,15,30],
        'prune': [0,40,50],
        'bell': [0,50,80],
        'bar1': [0,0,100],
        'bar2': [0,0,150],
        'bar3': [0,0,250],
        'seven': [0,0,500],
        'anybar': [0,0,80]
      },
      slots = [
        ['orange','bell','orange','bar2','prune','orange',
        'bar3','prune','orange','bar1','bell','cherry','orange',
        'prune','bell','bar1','cherry','seven','orange','prune',
        'orange','bell','orange'],
        ['chery','prune','orange','bell','bar1','cherry','prune',
        'bar3','cherry','bell','orange','bar1','seven','cherry',
        'bar2','cherry','bell','prune','cherry','orange','cherry',
        'prune','orange'],
        ['cherry','orange','bell','prune','bar2','cherry','prune',
        'orange','bar3','cherry','bell','orange','cherry','orange',
        'cherry','prune','bar1','seven','bell','cherry','cherry',
        'orange','bell'],
        ['cherry','orange','bell','prune','bar2','cherry','prune',
        'orange','bar3','cherry','bell','orange','cherry','orange',
        'cherry','prune','bar1','seven','bell','cherry','cherry',
        'orange','bell'],
        ['cherry','orange','bell','prune','bar2','cherry','prune',
        'orange','bar3','cherry','bell','orange','cherry','orange',
        'cherry','prune','bar1','seven','bell','cherry','cherry',
        'orange','bell']
      ],
      
      startSlot = function() {
        credits = 15;
        spinning = false;   
        $('#slotSplash').animate({top: -200}, 1000, 'bounceOut');
        $('#slotTrigger').removeClass('slotTriggerDisabled');
        return false;
      },
      endSlot = function() {
        $('#slotSplash').animate({top: 0}, 1000, 'bounceOut');
      },
      addCredit = function(incrementCredits:any) {
        var currentCredits = credits;
        credits += incrementCredits;
        $('#slotCredits')
          .css('credit', 0)
          .animate({
            credit: incrementCredits
          },{
            duration: 400 + incrementCredits,
            easing: 'easeOut',
            step: function (now:any) {
              $(this).html(parseInt(currentCredits + now, 10));
            },
            complete: function() {
              $(this).html(credits);
            }
          });
      },
      spinfun = function() {
        if (spinning == false) {
          spinning = 5;
          credits --;
          $('#slotCredits').html(credits);
          spin[0] = Math.round(Math.random() * 23);
          spin[1] = Math.round(Math.random() * 23);
          spin[2] = Math.round(Math.random() * 23);
          $('#slotTrigger').addClass('slotTriggerDisabled');
          $('img.slotSpinAnimation').show();
          $('#wheel1 img:first').css('top', - (spin[0] * 32 + 16) + 'px');
          $('#wheel2 img:first').css('top', - (spin[1] * 32 + 16) + 'px');
          $('#wheel3 img:first').css('top', - (spin[2] * 32 + 16) + 'px');
          $('#wheel4 img:first').css('top', - (spin[3] * 32 + 16) + 'px');
          $('#wheel5 img:first').css('top', - (spin[4] * 32 + 16) + 'px');
          setTimeout(function(){
            stopSpin(1);
          }, 1500 + (1500 * Math.round(Math.random())));
          setTimeout(function(){
            stopSpin(2);
          }, 1500 + (1500 * Math.round(Math.random())));
          setTimeout(function(){
            stopSpin(3);
          }, 1500 + (1500 * Math.round(Math.random())));
          setTimeout(function(){
            stopSpin(4);
          }, 1500 + (1500 * Math.round(Math.random())));
          setTimeout(function(){
            stopSpin(5);
          }, 1500 + (1500 * Math.round(Math.random())));

        }
        return false;
      },
      stopSpin = function(slot:any) {
        $('#wheel' + slot)
          .find('img:last')
            .hide()
            .end()
          .find('img:first')
            .animate({
              top: - spin[slot - 1] * 82
            },{
              duration: 500,
              easing: 'elasticOut',
              complete: function() {
                spinning --;
                if (spinning == 0 ) {
                  endSpin();
                }
              }
            });
      },
      endSpin = function() {
        var slotNumber:any = Math.round(spin[0]);
        var slotType = slots[0][slotNumber],
          matches = 1,
          barMatch = /bar/.test(slotType) ? 1 : 0,
          winnedCredits = 0,
          waitToSpin = 10;
        if ( slotType == slots[1][spin[1]]) {
          matches ++;
          if ( slotType == slots[2][spin[2]]) {
            matches ++;
          } else if (barMatch !=0 && /bar/.test(slots[2][spin[2]])) {
            barMatch ++;
          }
        } else if (barMatch != 0 && /bar/.test(slots[1][spin[1]])) {
          barMatch ++;
          if (/bar/.test(slots[2][spin[2]])) {
            barMatch ++;
          }
        }
        if (matches != 5 && barMatch == 3) {
          slotType = 'anybar';
          matches = 5;
        }
        var winnedCredits:number = slotsTypes[slotType][matches-1];
        
        if (winnedCredits > 0) {
          addCredit(winnedCredits);
          waitToSpin = 410 + winnedCredits;
        }
        setTimeout(function() {
          if (credits == 0) {
            setTimeout(function() {
              endSlot();
            }, 1000);
          } else {
            $('#slotTrigger').removeClass('slotTriggerDisabled');
            console.log("check")
            spinning = false;
          }
        }, waitToSpin);
      };
    return {
      init: function() {
        $('#slotSplash a').bind('click', startSlot);
        $('#slotTrigger')
          .bind('mousedown', function(){
            $('#slotTrigger').addClass('slotTriggerDown');
          })
          .bind('click', spinfun);
        $(document).bind('mouseup', function(){
          $('#slotTrigger').removeClass('slotTriggerDown');
        });
        $('#wheel1 img:first').css('top', - Math.round((Math.random() * 23) * 32) + 'px');
        $('#wheel2 img:first').css('top', - Math.round((Math.random() * 23) * 32) + 'px');
        $('#wheel3 img:first').css('top', - Math.round((Math.random() * 23) * 32) + 'px');
      }
    };
  }();
  $.extend($.easing,{
    bounceOut: function (x:any, t:any, b:any, c:any, d:any) {
      if ((t/=d) < (1/2.75)) {
        return c*(7.5625*t*t) + b;
      } else if (t < (2/2.75)) {
        return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
      } else if (t < (2.5/2.75)) {
        return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
      } else {
        return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
      }
    },
    easeOut:function (x:any, t:any, b:any, c:any, d:any) {
      return -c *(t/=d)*(t-2) + b;
    },
    elasticOut: function (x:any, t:any, b:any, c:any, d:any) {
      var s=1.70158;var p=0;var a=c;
      if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
      if (a < Math.abs(c)) { a=c; var s=p/4; }
      else var s = p/(2*Math.PI) * Math.asin (c/a);
      return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
    }
  });
  $(document).ready(slotMachine.init);
})(jQuery);
   }
  
  ngOnInit(): void {
    jQuery(".navicon").click(function(){
      jQuery("body").toggleClass("renav");
    });
  }
value: number = 100;
  options: Options = {
    floor: 0,
    ceil: 200
  };
  value2: number = 100;
  options2: Options = {
    floor: 0,
    ceil: 200
  };
}
