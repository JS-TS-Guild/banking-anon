import GlobalRegistry from "@/services/GlobalRegistry"
import { BankAccountId, BankId, UserId } from "@/types/Common"

export default class BankAccount {
    userId: UserId
    private bankId: BankId
    private bankAccountId: BankAccountId
    private accountBalance: number

    constructor(accountBalance:number, bankId: BankId) {
        this.accountBalance = accountBalance
        this.bankId = bankId
        this.bankAccountId = crypto.randomUUID()
        GlobalRegistry.addBankAccounts([this])
    }
    attachUser(userId: UserId){
        this.userId = userId
    }
    getId(){
        return this.bankAccountId
    }
    getBankId(){
        return this.bankId
    }

    getBalance() {
        return this.accountBalance
    }

    getUser() {
        GlobalRegistry.getUser(this.userId)
    }

    updateBalance(amount: number){
        
        this.accountBalance += amount;
        
    }
}