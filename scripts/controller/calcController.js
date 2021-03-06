class CalcController {
    constructor() {
        this._locale = 'pt-BR'
        this._displayCalcEl = document.querySelector('[dataDisplay]')
        this._dateEl = document.querySelector('[dataDate]')
        this._clockEl = document.querySelector('[dataTime]')
        this._currentDate
        this._operation = []
        this._result = false
        this._audioOnOff = false
        this._audio = new Audio('click.mp3')
        this.inicialize()
        this.initKeyBoard()
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

    copyToClepBoard() {
        let input = document.createElement('input')
        input.value = this.displayCalc
        document.body.appendChild(input)
        input.select()
        document.execCommand('Copy')
        input.remove()

    }

    pastFromClipBoard(){
        document.addEventListener('paste', ev => {
            let text = ev.clipboardData.getData('Text')
            if (!isNaN(text)){
                this.displayCalc = text
            }
        })
    }
    toggleAudio(){
        this._audioOnOff = !this._audioOnOff
    }

    playAudio(){
        if (this._audioOnOff){
            this._audio.currentTime = 0
            this._audio.play()
        }
    }

    inicialize() {
        this.setDisplayDateTime()
        setInterval(() => {
            this.setDisplayDateTime()
        }, 1000)
        this.displayCalc = 0
        this.initButtonEvents()
        this.pastFromClipBoard()

        document.querySelectorAll('.btn-ac').forEach(btn=>{
            btn.addEventListener('dblclick', e => {
                this.toggleAudio()
            })
        })
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
        this.playAudio()
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
                this.addOperation('%')
                break

            case 'igual':
                this.addOperation('=')
                break

            case 'ponto':
                this.addDot()
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
                this.setLastOperation(parseFloat(newTemp))
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

    aroundNumber(value) {
        let resultString = value.toString()
        if (resultString.indexOf('.') > 0 && resultString.length > 11) {
            let result = value.toFixed(9)
            return result
        } else {
            return value
        }
    }

    calc() {
        let last = this._operation.pop()
        let result = this.aroundNumber(eval(this._operation.join('')))
        this._operation = []
        this._operation.push(result, last)
        this.setLastNumberToDisplay()

    }

    calcPercent() {
        if (this.isOparator(this.getLastOparation())) {
            this._operation.push(this._operation[0] * (this._operation[0] / 100))
            let resultPercent = this.aroundNumber(eval(this._operation.join('')))
            this._operation = []
            this._operation.push(resultPercent)
            this._result = true
            this.displayCalc = resultPercent
        } else {
            if (this._operation.length === 1) {
                this._operation[0] = this._operation[0] / 100
                this._result = true
                this.displayCalc = this._operation

            } else {
                let resultPercent = this._operation[0] * (this._operation[2] / 100)
                this._operation[2] = resultPercent
                let result = this.aroundNumber(eval(this._operation.join('')))
                this._operation = []
                this._operation.push(result)
                this._result = true
                this.displayCalc = result
            }
        }

    }

    calcEqual() {
        if (this._operation.length === 1) {
            this._result = true
        }
        if (isNaN(this.getLastOparation())) {
            this._operation.push(this._operation[0])
            this._result = true
            let resulCalc = this.aroundNumber(eval(this._operation.join('')))
            this.displayCalc = resulCalc
            this._operation = []
            this._operation[0] = resulCalc
        }
        if (this._operation.length === 3) {
            this._result = true
            let resulCalc = this.aroundNumber(eval(this._operation.join('')))
            this.displayCalc = resulCalc
            this._operation = []
            this._operation[0] = resulCalc

        }

    }

    addDot(value) {
        let lestOperation = this.getLastOparation()
        if ((typeof (lestOperation) === 'string') && (lestOperation.indexOf('.') > 0)) {
            return
        }

        if (this.getLastOparation() === 0) {
            this.setLastOperation(lestOperation.toString() + '.')
            this.displayCalc = this.getLastOparation()
            return
        }

        if (this.isOparator(lestOperation) || !lestOperation) {
            this.pushOperation('0.')
        } else {
            if (value) {
                this.setLastOperation(this.getLastOparation() + value.toString())
                this.displayCalc = this.getLastOparation()
            } else {
                this.setLastOperation(lestOperation.toString() + '.')
                this.displayCalc = this.getLastOparation()
            }
        }
    }

    addOperation(value) {
        if (value === 0) {
            if (this._operation[0] === 0) return
        }
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
                if (value === "%") {
                    this.calcPercent()
                } else if ((value === "=")) {
                    this.calcEqual()
                } else {
                    if (this.isOparator(this.getLastOparation())) {
                        this.setLastOperation(value)
                    } else {
                        this.pushOperation(value)
                    }
                }
            } else {
                if (isNaN(this.getLastOparation())) {
                    this.pushOperation(value)
                    this.setLastNumberToDisplay()
                } else {
                    if (typeof (this.getLastOparation()) === String && this.isOparator(this.getLastOparation())) {
                        this.addDot(value)

                    } else {
                        if (this._result) {
                            this.setLastOperation(parseFloat(value))
                            this.setLastNumberToDisplay()
                            this._result = false
                        } else {
                            let newValue = this.getLastOparation().toString() + value.toString()
                            this.setLastOperation(newValue)
                            this.setLastNumberToDisplay()
                        }
                    }
                }
            }
        }
    }

    initKeyBoard() {

        document.addEventListener('keyup', (e) => {
            this.playAudio()
            switch (e.key) {
                case 'Escape':
                    this.clearAll()
                    break
                case 'Backspace':
                    this.clearEntry()
                    break
                case '/':
                    this.addOperation('/')
                    break
                case '*':
                case 'x':
                    this.addOperation('*')
                    break
                case '-':
                    this.addOperation('-')
                    break
                case '+':
                    this.addOperation('+')
                    break

                case '%':
                    this.addOperation('%')
                    break

                case '=':
                case 'Enter':
                    this.addOperation('=')
                    break

                case '.':
                case ',':
                    this.addDot()
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
                    this.addOperation((parseInt(parseInt(e.key))))
                    break
                case 'c':
                    if (e.ctrlKey) this.copyToClepBoard()
                    if (e.metaKey) this.copyToClepBoard()
                    break
            }
        })
    }

    seError() {
        console.log('todo set error')
    }

}

