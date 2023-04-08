import React, { Component } from 'react';
import { render, unstable_renderSubtreeIntoContainer } from 'react-dom';
import TimerModal from './TimerModal';
import './timer.scss';

class Timer extends Component {

    constructor(props) {
        super(props);

        this.state = {
            hours: 0,
            minutes: 0,
            seconds: 0,
            overHours: 0,
            overMinutes: 0,
            overSeconds: 0,
            running: false,
        }

        this.point = 0;
        this.overTime = false;
        this.overTimeConfirm = false;

        this.startHours = 0;
        this.startMinutes = 0;
        this.startSeconds = 0;

    }

    setMinute(labtime) {
        labtime = Number(labtime) * 60;
        var hours = Math.floor(labtime / 3600);
        var minutes = Math.floor((labtime % (3600)) / (60));
        var seconds = Math.round((labtime % (60)));
        this.setState({ hours, minutes, seconds });
    }

    pad(d) {
        return (d < 10) ? '0' + d.toString() : d.toString();
    }

    count() {
        var now = Number(moment().format('X'));
        if (now <= this.point) {
            var overHours = 0;
            var overMinutes = 0;
            var overSeconds = 0;
            var distance = this.point - now;
            var hours = Math.floor(distance / 3600);
            var minutes = Math.floor((distance % (3600)) / (60));
            var seconds = Math.round((distance % (60)));
            this.overTime = false;
        } else {
            var hours = 0;
            var minutes = 0;
            var seconds = 0;
            var distance = now - this.point;
            var overHours = Math.floor(distance / 3600);
            var overMinutes = Math.floor((distance % (3600)) / (60));
            var overSeconds = Math.round((distance % (60)));
            this.overTime = true;

            if (!this.overTimeConfirm) {
                this.timerModal.modal();
                this.timerModal.setTitle('Out of Time');
                this.timerModal.setContent('Your lab time has ended.');
                this.timerModal.setOnContinue(() => {
                    this.overTimeConfirm = true;
                    this.timerModal.modal('hide');
                })
                this.timerModal.setOnFinish(() => {
                    this.pause();
                    this.timerModal.setTitle('Time Report');
                    this.timerModal.setContent('The total lab time: ' + this.caculeLabTime());
                    this.timerModal.setOnFinish(() => {
                        this.finish();
                        this.timerModal.modal('hide');
                    })
                    this.timerModal.setOnContinue(null)
                })
            }
        }

        localStorage.setItem(`countdown_timer_${window.lab.session}`, JSON.stringify({
            hours,
            minutes,
            seconds,
            overHours,
            overMinutes,
            overSeconds,
            running: this.state.running,
            point: this.point,
            overTime: this.overTime,
            overTimeConfirm: this.overTimeConfirm,
            startHours: this.startHours,
            startMinutes: this.startMinutes,
            startSeconds: this.startSeconds,
        }));
        this.setState({ hours, minutes, seconds, overHours, overMinutes, overSeconds });
    }


    caculeLabTime() {
        var labtime = (this.startHours * 3600 + this.startMinutes * 60 + this.startSeconds)
            - (this.state.hours * 3600 + this.state.minutes * 60 + this.state.seconds)
            + (this.state.overHours * 3600 + this.state.overMinutes * 60 + this.state.overSeconds);

        var hour = Math.floor(labtime / 3600);
        var minute = Math.floor((labtime % (3600)) / (60));
        var second = Math.round((labtime % (60)));

        return `${hour}h : ${minute}m : ${second}s`;

    }

    start() {
        this.startHours = this.state.hours;
        this.startMinutes = this.state.minutes;
        this.startSeconds = this.state.seconds;
        this.resume();
    }

    onStart() {
        if (this.state.hours == 0 && this.state.minutes == 0 && this.state.seconds == 0) {
            addMessage('warning', 'Please set time first');
            return;
        };
        this.start();
        this.timerModal.modal('hide');
    }

    resume() {
        var now = Number(moment().format('X'));
        this.point = now + (this.state.hours * 3600 + this.state.minutes * 60 + this.state.seconds)
            - (this.state.overHours * 3600 + this.state.overMinutes * 60 + this.state.overSeconds);
        this.setState({ running: true });
        this.couter = setInterval(() => { this.count() }, 1000);
    }

    pause() {
        this.setState({ running: false });
        if (this.couter) {
            clearInterval(this.couter)
        }
    }

    onPause() {
        this.pause();
        this.timerModal.modal();
        this.timerModal.setTitle('Time Report');
        this.timerModal.setContent('The total lab time: ' + this.caculeLabTime());
        this.timerModal.setOnFinish(() => {
            this.finish();
            this.timerModal.modal('hide');
        })
        this.timerModal.setOnContinue(() => {
            this.resume();
            this.timerModal.modal('hide');
        })
    }

    finish() {
        this.pause();
        this.point = 0;
        this.overTime = false;
        this.overTimeConfirm = false;
        this.setState({
            hours: 0, minutes: 0, seconds: 0,
            overHours: 0, overMinutes: 0, overSeconds: 0,
            running: false,
        }, ()=>{
            if (window.lab && window.lab.countdown) {
                this.setMinute(window.lab.countdown);
            }
        });

        
        
        localStorage.removeItem(`countdown_timer_${window.lab.session}`)
    }

    change(state, vector) {
        if (vector == 'up') {
            this.setState({ [state]: this.state[state] + 1 })
        } else {
            var value = this.state[state] - 1; if (value < 0) value = 0;
            this.setState({ [state]: value });
        }
    }

    render() {

        return <div className='timer_frame' onMouseLeave={() => {
            //$("#lab-sidebar").css('width', '');
            //$("#lab-sidebar ul").css('width', '');
        }} onMouseEnter={() => {
            //$("#lab-sidebar").css('width', '40px');
            //$("#lab-sidebar ul").css('width', '30px');
        }}>

            {this.overTime
                ? <div className='box_flex timer_box' style={{ position: 'absolute', top: -30 }}>
                    <div className='timer_item'>
                        <input type='text' value={this.pad(this.state.overHours)} readOnly={true}></input>
                    </div>
                :
                <div className='timer_item'>
                        <input type='text' value={this.pad(this.state.overMinutes)} readOnly={true}></input>
                    </div>
                :
                <div className='timer_item'>
                        <input type='text' value={this.pad(this.state.overSeconds)} readOnly={true}></input>
                    </div>
                    <div className='timer_button btn btn-danger'>Over</div>
                </div>
                : ''
            }

            <div className='box_flex timer_box'>
                <div className='timer_item'>
                    <div className="button timer-edit timer-up" onClick={() => this.change('hours', 'up')}><i className="fa fa-caret-up"></i></div>
                    <input type='text' value={this.pad(this.state.hours)} onChange={event => this.setState({ hours: Number(event.target.value) })}></input>
                    <div className="button timer-edit timer-down" onClick={() => this.change('hours', 'down')}><i className="fa fa-caret-down"></i></div>
                </div>
                :
                <div className='timer_item'>
                    <div className="button timer-edit timer-up" onClick={() => this.change('minutes', 'up')}><i className="fa fa-caret-up"></i></div>
                    <input type='text' value={this.pad(this.state.minutes)} onChange={event => this.setState({ minutes: Number(event.target.value) })}></input>
                    <div className="button timer-edit timer-down" onClick={() => this.change('minutes', 'down')}><i className="fa fa-caret-down"></i></div>
                </div>
                :
                <div className='timer_item'>
                    <div className="button timer-edit timer-up" onClick={() => this.change('seconds', 'up')}><i className="fa fa-caret-up"></i></div>
                    <input type='text' value={this.pad(this.state.seconds)} onChange={event => this.setState({ seconds: Number(event.target.value) })}></input>
                    <div className="button timer-edit timer-down" onClick={() => this.change('seconds', 'down')}><i className="fa fa-caret-down"></i></div>
                </div>
                {this.state.running
                    ? <div className='timer_button btn btn-primary' onClick={() => this.onPause()}>Pause</div>
                    : <div className='timer_button btn btn-primary' onClick={() => this.onStart()}>Start</div>
                }

            </div>




        </div>
    }

    componentDidMount() {
        App.onReadyRegister.push(()=>{

            var timerModal = document.createElement("div");
        document.body.appendChild(timerModal);
        render(<TimerModal ref={modal => this.timerModal = modal}></TimerModal>, timerModal);

        var saveTimer = localStorage.getItem(`countdown_timer_${window.lab.session}`);
        try {
            var saveTimer = JSON.parse(saveTimer);
        } catch (error) {
            saveTimer = null;
        }

        if (saveTimer == null) {
            if (window.lab && window.lab.countdown) {
                this.setMinute(window.lab.countdown);
            }
        } else {

            this.point = saveTimer.point
            this.overTime = saveTimer.overTime
            this.overTimeConfirm = saveTimer.overTimeConfirm
            this.startHours = saveTimer.startHours
            this.startMinutes = saveTimer.startMinutes
            this.startSeconds = saveTimer.startSeconds

            var stateData = {
                hours: saveTimer.hours,
                minutes: saveTimer.minutes,
                seconds: saveTimer.seconds,
                overHours: saveTimer.overHours,
                overMinutes: saveTimer.overMinutes,
                overSeconds: saveTimer.overSeconds,
            }
            this.setState(stateData, () => { if (saveTimer.running) this.resume() });
        }

        })
        
        
    }

}


export default Timer;
