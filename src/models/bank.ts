import { BankAccountId, BankId, UserId } from "@/types/Common"
import BankAccount from "./bank-account"
import GlobalRegistry from "@/services/GlobalRegistry"

export default class Bank {
    private bankId: BankId
    private isNegativeAllowed: boolean = false

    constructor(options?: {isNegativeAllowed?: boolean} ){
        this.bankId = crypto.randomUUID()
        if (options){
            this.isNegativeAllowed = options.isNegativeAllowed
        }
        GlobalRegistry.addBank(this)
    }
    static create(options?: {isNegativeAllowed?: boolean}){
        return new Bank(options)
    }

    getId() {
        return this.bankId
    }
    createAccount(balance: number){
        return new BankAccount(balance, this.bankId)
    }
    getAccount(bankAccountId: BankAccountId){
        return GlobalRegistry.getBankAccount(bankAccountId)
    }

    send(userOne: UserId, userTwo: UserId, amount: number, bankId?: BankId){
        GlobalRegistry.transfer(this.isNegativeAllowed, userOne, userTwo, amount, this.bankId, bankId)
    }


}
