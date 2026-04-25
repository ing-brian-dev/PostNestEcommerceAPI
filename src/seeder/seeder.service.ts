import { Injectable } from "@nestjs/common";

@Injectable()
export class SeederService {

    async seed() {
        console.log('Desde seeder');
    }
}