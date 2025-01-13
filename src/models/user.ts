import GlobalRegistry from "@/services/GlobalRegistry";
import { BankAccountId, UserId } from "@/types/Common";

export default class User {
    private name: [string, string]
    private userId: UserId
    constructor(name: string){
        let firstName: string
        let lastname: string[]
        [firstName, ...lastname] = name.split(" ");
        this.name = [firstName, lastname.join(" ")]
        this.userId = crypto.randomUUID()
    }
    static create(name: string, bankAccountIds: BankAccountId[]){
        const user = new User(name)
        GlobalRegistry.addOrUpdateUser(user, bankAccountIds)
        return user
    }
    getId(){
        return this.userId
    }
    getName(){
        return this.name.join(" ")
    }
    getFirstName(){
        return this.name[0]
    }
}