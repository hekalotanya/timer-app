import './App.css';
import React from 'react';
import { Button } from '@mui/material';
import { Observable } from 'rxjs';

export class App extends React.Component {
  state = {
    seconds: 0,
    minutes: 0,
    hours: 0,
    start: false,
  }

  startTimeObser = new Observable(observer => {
    this.updateTime();
    observer.next({ start: true });
    clearInterval(this.timer);
    this.timer = setInterval(this.updateTime, 1000);

    observer.complete();
  });

  waitObser = new Observable(observer => {
    observer.next(observer);
  })


  // PROMISE REALIZATION
  // waitTime = (event) => {
  //   const promise = new Promise((resolve,reject) => {
  //     setTimeout(() => {
  //       reject();
  //     }, 300);

  //     event.target.addEventListener('click',() => {
  //       resolve();
  //     })
  //   })

  //   promise.then(() => {
  //     clearInterval(this.timer);
  //     this.setState({ start: false });
  //   })
  // }


  timer = null;

  updateTime = () => {
    this.setState((state) => {
      return ({
        seconds: state.seconds === 59 ? 0 : state.seconds + 1,
        minutes: state.seconds === 59 ? state.minutes + 1 : state.minutes,
        hours: state.minutes === 59 ? state.hours + 1 : state.hours,
      }
      )
    })
  }

  startTimer = () => {
    this.updateTime();
    this.setState({ start: true });
    clearInterval(this.timer);
    this.timer = setInterval(this.updateTime, 1000);
  }

  retimer = () => {
    clearInterval(this.timer);
    this.timer = setInterval(this.updateTime, 1000);
    this.setState({seconds: 0, minutes: 0, hours: 0});
  }

  stopTimer = () => {
    clearInterval(this.timer);
    this.setState({seconds: 0, minutes: 0, hours: 0, start: false});
  }

  render() {
    const {seconds, minutes, hours, start} = this.state;
    return (
      <div className="App">
        <h1>Stopwatch</h1>
        <div className='buttonsMenu'>
          <Button
            className='button'
            variant="contained"
            type="button"
            onClick={() => this.startTimeObser.subscribe(this.setState.bind(this))}
            disabled={start}
          >
            Start
          </Button>
          <Button
            className='button'
            variant="contained"
            type="button"
            onClick={this.stopTimer}
            disabled={!start}
          >
            Stop
          </Button>
          <Button
            className='button'
            variant="contained"
            type="button"
            onClick={this.retimer}
            disabled={!start}
          >
            Reset
          </Button>
          <Button
            className='button'
            variant="contained"
            type="button"
            onClick={(event) => {
              this.waitObser.subscribe((observer) => {

                const listener = () => {
                  clearInterval(this.timer);
                  this.setState({ start: false });
                }

                event.target.addEventListener('click', listener, { once: true});

                setTimeout(() => {
                  event.target.removeEventListener('click', listener);
                  observer.complete();
                }, 300)
              });
            }}
            disabled={!start}
          >
            Wait
          </Button>
        </div>
        <span className='timer'>
          {hours.toString().length === 2 ? hours : '0'+ hours.toString()}
          :{minutes.toString().length === 2 ? minutes : '0'+ minutes.toString()}
          :{seconds.toString().length === 2 ? seconds : '0'+ seconds.toString()}
        </span>
      </div>
    );
  }
}
