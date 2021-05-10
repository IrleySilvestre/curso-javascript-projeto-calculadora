class CalcController {
    constructor() {
        this._locale = 'pt-BR'
        this._displayCalcEl = document.querySelector('[dataDisplay]')
        this._dateEl = document.querySelector('[dataDate]')
        this._clockEl = document.querySelector('[dataTime]')
        this._currentDate
        this._operation = []
        this.inicialize()
    }

    get displayTime() {
        return this._clockEl.innerHTML
    }

    set displayTime(value) {
        return this._clockEl.innerHTML = value
    }

    get displayDate() {
        return this._dateEl.innerHTML
    }

    set displayDate(value) {
        return this._dateEl.innerHTML = value
    }

    get displayCalc() {
        return this._displayCalcEl.innerHTML;
    }

    set displayCalc(value) {
        this._displayCalcEl.innerHTML = value
    }

    get currentDate() {
        return new Date()
    }

    set currentDate(date) {
        this._currentDate = date
    }

    inicialize() {
        this.setDisplayDateTime()
        setInterval(() => {
            this.setDisplayDateTime()
        }, 1000)
        this.displayCalc = 0
        this.initButtonEvents()
    }

    setDisplayDateTime() {
        this.displayDate = this.currentDate.toLocaleDateString(this._locale)
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale, {weekday: "short"})
    }

    addEventListenerAll(element, events, fn) {
        events.split(' ').forEach(evt => {
            element.addEventListener(evt, fn, false)
        })
    }

    initButtonEvents() {
        let buttons = document.querySelectorAll('#buttons > g , #parts > g')
        buttons.forEach((btn, index) => {
            this.addEventListenerAll(btn, 'click drag', evt => {
                let txtBtn = btn.className.baseVal.replace('btn-', '')
                this.execBtn(txtBtn)
            })

            this.addEventListenerAll(btn, 'mouseover mouseup mousedown', evt => {
                btn.style.cursor = "pointer"
            })

        })
    }

    execBtn(value) {
        switch (value) {
            case 'ac':
                this.clearAll()
                break
            case 'ce':
                this.clearEntry()
                break
            case 'divisao':
                this.addOperation('/')
                break
            case 'multiplicacao':
                this.addOperation('*')
                break
            case 'subtracao':
                this.addOperation('-')
                break
            case 'soma':
                this.addOperation('+')
                break

            case 'porcento':

                break

            case 'igual':

                break

            case 'ponto':

                break

            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation((parseInt(value)))
                break

            default:
                this.seError()
                break

        }
    }

    clearAll() {
        this._operation = []
        this.displayCalc = 0
    }

    clearEntry() {
        if (!isNaN(this.getLastOparation())) {
            let temp = (this.getLastOparation()).toString()
            if (temp.length === 1) {
                this._operation.pop()
                this.displayCalc = 0
            } else {
                let newTemp = temp.slice(0, temp.length - 1)
                this.setLastOperation(parseInt(newTemp))
                this.setLastNumberToDisplay()
            }
        } else {
            this.clearAll()
        }

    }

    getLastOparation() {
        return this._operation[this._operation.length - 1]
    }

    setLastOperation(value) {
        this._operation[this._operation.length - 1] = value
    }

    isOparator(value) {
        return (['+', '-', '*', '%', '/'].indexOf(value) > -1) ? true : false
    }

    pushOperation(value) {
        this._operation.push(value)

        if (this._operation.length > 3) {
            this.calc()
        }
    }

    setLastNumberToDisplay() {
        let lastNumber
        for (let i = this._operation.length - 1; i >= 0; i--) {
            if (!this.isOparator(this._operation[i])) {
                lastNumber = this._operation[i]
                break
            }
        }
        this.displayCalc = lastNumber

    }

    calc() {
        let last = this._operation.pop()
        let result = eval(this._operation.join(''))
        this._operation = []
        this._operation.push(result, last)
        this.setLastNumberToDisplay()
    }

    addOperation(value) {
        if (this._operation.length === 0) {
            if (this.isOparator(value)) {
                this._operation = []
            }
            if (!isNaN(value)) {
                this.pushOperation(value)
                this.setLastNumberToDisplay()
            }
        } else {
            if (isNaN(value)) {
                if (this.isOparator(this.getLastOparation())) {
                    this.setLastOperation(value)
                } else {
                    this.pushOperation(value)
                }
            } else {
                if (isNaN(this.getLastOparation())) {
                    this.pushOperation(value)
                    this.setLastNumberToDisplay()
                } else {
                    let newValue = this.getLastOparation().toString() + value.toString()
                    this.setLastOperation(parseInt(newValue))
                    this.setLastNumberToDisplay()
                }
            }
        }
    }

    seError() {
        console.log('todo set error')
    }

}

