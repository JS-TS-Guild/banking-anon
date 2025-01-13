import Bank from "@/models/bank"
import BankAccount from "@/models/bank-account"
import User from "@/models/user"
import { BankAccountId, BankId, UserId } from "@/types/Common"

export default class GlobalRegistry {
  private static banks: Bank[] = []
  private static bankAccounts: BankAccount[] = []
  private static users: User[] = []

  static clear(): void {
    this.users = []
    this.bankAccounts = []
    this.banks = []
  }

  static addOrUpdateUser(user: User, bankAccountIds: BankAccountId[]) {
    let existingUserIndex = -1
    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i].getId() === user.getId()) {
        existingUserIndex = i
        break
      }
    }

    if (existingUserIndex !== -1) {
      this.users[existingUserIndex] = user
    } else {
      this.users.push(user)
    }

    if (bankAccountIds.length) {
      for (let i = 0; i < bankAccountIds.length; i++) {
        const id = bankAccountIds[i]
        for (let j = 0; j < this.bankAccounts.length; j++) {
          if (this.bankAccounts[j].getId() === id) {
            this.bankAccounts[j].attachUser(user.getId())
            break
          }
        }
      }
    }
  }

  static addBank(bank: Bank) {
    let existingBankIndex = -1
    for (let i = 0; i < this.banks.length; i++) {
      if (this.banks[i].getId() === bank.getId()) {
        existingBankIndex = i
        break
      }
    }

    if (existingBankIndex !== -1) {
      this.banks[existingBankIndex] = bank
    } else {
      this.banks.push(bank)
    }
  }

  static addBankAccounts(bankAccounts: BankAccount[]) {
    for (let i = 0; i < bankAccounts.length; i++) {
      const bankAccount = bankAccounts[i]
      let existingIndex = -1
      
      for (let j = 0; j < this.bankAccounts.length; j++) {
        if (this.bankAccounts[j].getId() === bankAccount.getId()) {
          existingIndex = j
          break
        }
      }

      if (existingIndex !== -1) {
        this.bankAccounts[existingIndex] = bankAccount
      } else {
        this.bankAccounts.push(bankAccount)
      }
    }
  }

  static getBankAccount(bankAccountId: BankAccountId) {
    for (let i = 0; i < this.bankAccounts.length; i++) {
      if (this.bankAccounts[i].getId() === bankAccountId) {
        return this.bankAccounts[i]
      }
    }
    return null
  }

  static transfer(isNegativeAllowed: boolean, userOne: UserId, userTwo: UserId, amount: number, transferFromBankId: BankId, transferToBankId?: BankId) {
    let bankAccountsForUserOne: BankAccount[] = []
    let bankAccountsForUserTwo: BankAccount[] = []

    for (let i = 0; i < this.bankAccounts.length; i++) {
      const account = this.bankAccounts[i]
      if (account.userId === userOne && account.getBankId() === transferFromBankId) {
        bankAccountsForUserOne.push(account)
      } else if (account.userId === userTwo) {
        bankAccountsForUserTwo.push(account)
      }

    }

    if (!bankAccountsForUserOne.length || !bankAccountsForUserTwo.length) {
      throw new Error('Bank accounts not found for one or both users')
    }
    if (!isNegativeAllowed ) {
        bankAccountsForUserOne  = bankAccountsForUserOne.filter(bankAccount => bankAccount.getBalance() >= amount )
        if (!bankAccountsForUserOne.length) throw new Error("Insufficient funds")
    }
    bankAccountsForUserOne[0].updateBalance(-amount)
    bankAccountsForUserTwo[0].updateBalance(amount)
  }

  static getUser(userId: UserId) {
    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i].getId() === userId) {
        return this.users[i]
      }
    }
    return null
  }
}